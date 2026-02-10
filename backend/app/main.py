"""
Main FastAPI application for Smart Shelf Intelligence System
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import asyncio
import json
import cv2
import logging
from typing import List
from contextlib import asynccontextmanager

from .config import settings

# --- PYTORCH 2.6 FIX ---
# Monkey-patch torch.load to disable weights_only=True default
import torch
_original_load = torch.load

def strict_load_bypass(*args, **kwargs):
    if 'weights_only' not in kwargs:
        kwargs['weights_only'] = False
    return _original_load(*args, **kwargs)

torch.load = strict_load_bypass
# -----------------------

from .database import engine, Base
from .api import inventory, events, analytics

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global video processor
video_processor = None
connected_clients: List[WebSocket] = []


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    logger.info("Starting Smart Shelf Intelligence System...")
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")
    
    # Initialize video processor
    global video_processor
    from app.services.video_service import VideoService
    
    try:
        logger.info(f"Initializing VideoProcessor with source: '{settings.VIDEO_SOURCE}'")
        video_processor = VideoService(
            video_source=settings.VIDEO_SOURCE,
            yolo_model=settings.YOLO_MODEL,
            conf_threshold=settings.CONFIDENCE_THRESHOLD,
            frame_skip=settings.FRAME_SKIP
        )
        # video_processor.start() # Removed auto-start: Camera starts only on client connection
        logger.info("Video processor initialized (Wait for client to start)")
    except Exception as e:
        logger.error(f"Failed to initialize video processor: {e}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down...")
    if video_processor:
        video_processor.stop()


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(inventory.router, prefix="/api/inventory", tags=["inventory"])
app.include_router(events.router, prefix="/api/events", tags=["events"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "video_processor": video_processor is not None,
        "connected_clients": len(connected_clients)
    }


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time updates
    Sends frame processing results, events, and alerts
    """
    await websocket.accept()
    connected_clients.append(websocket)
    logger.info(f"Client connected. Total clients: {len(connected_clients)}")
    
    try:
        # Auto-start video processing if this is the first client
        if video_processor and not video_processor.running:
            logger.info("First client connected. Starting video processor.")
            video_processor.start()
            # Give it a moment to initialize
            await asyncio.sleep(0.5) 
            asyncio.create_task(process_video_stream(websocket))
        elif video_processor and video_processor.running:
             # Just attach to existing stream
             asyncio.create_task(process_video_stream(websocket))
        
        # Keep connection alive and receive messages
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle client commands
            if message.get("command") == "start":
                logger.info("Start command received")
                if video_processor:
                    asyncio.create_task(process_video_stream(websocket))
            
            elif message.get("command") == "stop":
                logger.info("Stop command received")
                if video_processor:
                    video_processor.stop()
    
    except WebSocketDisconnect:
        connected_clients.remove(websocket)
        logger.info(f"Client disconnected. Total clients: {len(connected_clients)}")
        if len(connected_clients) == 0 and video_processor and video_processor.running:
            logger.info("No active clients. Stopping video processor to release camera.")
            video_processor.stop()
            
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        if websocket in connected_clients:
            connected_clients.remove(websocket)
            if len(connected_clients) == 0 and video_processor and video_processor.running:
                logger.info("No active clients. Stopping video processor to release camera.")
                video_processor.stop()


async def process_video_stream(websocket: WebSocket):
    """Process video stream and send results via WebSocket"""
    if not video_processor:
        return
    
    loop = asyncio.get_running_loop()

    def frame_callback_threadsafe(result):
        """Thread-safe callback for each processed frame"""
        try:
            # Send results to connected client
            data = {
                "type": "frame_result",
                "timestamp": result['timestamp'],
                "frame_number": result['frame_number'],
                "detections_count": len(result['detections']),
                "tracked_objects_count": len(result['tracked_objects']),
                "events": result['events'],
                "shelf_counts": result['shelf_counts'],
                "processing_time": result['processing_time']
            }
            
            # Send asynchronously from thread
            asyncio.run_coroutine_threadsafe(websocket.send_json(data), loop)
            
            # If there are events, also notify all clients
            if result['events']:
                for event in result['events']:
                     asyncio.run_coroutine_threadsafe(broadcast_event(event), loop)
        
        except Exception as e:
            logger.error(f"Error in frame callback: {e}")
    
    try:
        # Register callback
        video_processor.add_callback(frame_callback_threadsafe)
        
        # Keep connection alive (the loop is now in VideoService)
        # We monitor the connection state via the websocket loop in websocket_endpoint
        while True:
            await asyncio.sleep(1)
            
    except asyncio.CancelledError:
        pass
    except Exception as e:
        logger.error(f"Error processing video stream: {e}")
    finally:
        video_processor.remove_callback(frame_callback_threadsafe)


async def broadcast_event(event: dict):
    """Broadcast event to all connected clients"""
    message = {
        "type": "event",
        "data": event
    }
    
    disconnected = []
    for client in connected_clients:
        try:
            await client.send_json(message)
        except Exception as e:
            logger.error(f"Failed to send to client: {e}")
            disconnected.append(client)
    
    # Remove disconnected clients
    for client in disconnected:
        if client in connected_clients:
            connected_clients.remove(client)


@app.get("/api/video/stream")
async def video_stream():
    """
    Video stream endpoint (MJPEG)
    Returns processed video frames with visualizations
    """
    async def generate_frames():
        logger.info("Video stream connection established")
        if not video_processor:
            logger.error("Video processor is None inside stream")
            return
            
        last_frame_time = 0
        
        try:
            frames_yielded = 0
            while True:
                # Poll for latest frame
                if video_processor.latest_result:
                    result = video_processor.latest_result
                    
                    frame = result.get('frame')
                    if frame is not None:
                        _, buffer = cv2.imencode('.jpg', frame)
                        frame_bytes = buffer.tobytes()
                        
                        frames_yielded += 1
                        if frames_yielded % 100 == 0:
                            logger.info(f"Stream yielded {frames_yielded} frames")

                        yield (b'--frame\r\n'
                               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
                    else:
                        if frames_yielded % 100 == 0:
                            logger.warning("Frame is None in latest_result")
                else:
                    if frames_yielded == 0:
                        logger.warning("No latest_result available in video_processor yet")
                
                await asyncio.sleep(0.06) # ~15 FPS polling
                
        except asyncio.CancelledError:
            logger.info("Stream cancelled")
        except Exception as e:
            logger.error(f"Stream error: {e}")
    
    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )


@app.get("/api/stats")
async def get_stats():
    """Get processing statistics"""
    if video_processor:
        return video_processor.get_stats()
    return {"error": "Video processor not initialized"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=True
    )