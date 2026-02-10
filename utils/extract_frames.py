import cv2
import os
import argparse
from pathlib import Path

def extract_frames(source_dir, output_dir, fps=1):
    """
    Extract frames from all videos in source_dir at specified FPS.
    """
    source_path = Path(source_dir)
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    video_extensions = ['.mp4', '.avi', '.mov', '.mkv']
    files = [f for f in source_path.iterdir() if f.suffix.lower() in video_extensions]
    
    if not files:
        print(f"No video files found in {source_dir}")
        return

    print(f"Found {len(files)} videos. Starting extraction at {fps} FPS...")

    total_frames_saved = 0

    for video_file in files:
        print(f"Processing {video_file.name}...")
        cap = cv2.VideoCapture(str(video_file))
        
        if not cap.isOpened():
            print(f"Error opening {video_file.name}")
            continue

        video_fps = cap.get(cv2.CAP_PROP_FPS)
        frame_interval = int(video_fps / fps)
        if frame_interval < 1:
            frame_interval = 1
            
        frame_count = 0
        saved_count = 0
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
                
            if frame_count % frame_interval == 0:
                frame_name = f"{video_file.stem}_frame_{saved_count:05d}.jpg"
                save_path = output_path / frame_name
                cv2.imwrite(str(save_path), frame)
                saved_count += 1
                total_frames_saved += 1
                
            frame_count += 1
            
        cap.release()
        print(f"Saved {saved_count} frames from {video_file.name}")

    print(f"Extraction complete. Total frames saved: {total_frames_saved}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Extract frames from videos for dataset.")
    parser.add_argument("--source", type=str, default="backend/videos", help="Directory containing video files")
    parser.add_argument("--output", type=str, default="dataset/raw_images", help="Output directory for images")
    parser.add_argument("--fps", type=int, default=1, help="Frames per second to extract")
    
    args = parser.parse_args()
    
    extract_frames(args.source, args.output, args.fps)
