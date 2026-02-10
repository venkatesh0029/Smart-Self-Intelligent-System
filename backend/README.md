# Smart Shelf Intelligence System - Backend

FastAPI backend for processing video streams, managing inventory, and detecting events.

## Features

- **Video Processing**: Real-time object detection using YOLOv8.
- **Inventory Management**: Track products on shelves.
- **Event Detection**: Detect picks, returns, and misplaced items.
- **Analytics**: Dashboard statistics and anomalies.

## API Documentation

Once running, access the interactive API docs at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Development

### Requirements
- Python 3.11+
- Video source (Webcam or file)

### Setup
1. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run with Uvicorn:
   ```bash
   uvicorn app.main:app --reload
   ```

## Docker
The backend is designed to run in a Docker container (see root `docker-compose.yml`).
