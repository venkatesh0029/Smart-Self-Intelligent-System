from ultralytics import YOLO
import os
import torch

# --- PYTORCH 2.6 FIX ---
# Monkey-patch torch.load to disable weights_only=True default
_original_load = torch.load

def strict_load_bypass(*args, **kwargs):
    if 'weights_only' not in kwargs:
        kwargs['weights_only'] = False
    return _original_load(*args, **kwargs)

torch.load = strict_load_bypass
# -----------------------

def train():
    # Load a model
    model = YOLO("yolov8n.pt")  # load a pretrained model (recommended for training)

    # Use absolute path for data.yaml to avoid issues
    data_path = os.path.abspath("smart trolley.v2i.yolov8/data.yaml")

    # Train the model
    results = model.train(
        data=data_path,
        epochs=50,
        imgsz=640,
        patience=10,
        batch=16,
        name='smart_trolley_v8n'
    )

    print("Training Completed.")
    print(f"Best weights saved at: {results.save_dir}/weights/best.pt")

if __name__ == '__main__':
    train()
