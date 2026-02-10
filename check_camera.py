import cv2

def list_cameras():
    print("Searching for available cameras...")
    available_ports = []
    for i in range(5):
        try:
            cap = cv2.VideoCapture(i, cv2.CAP_DSHOW)
            if cap.isOpened():
                print(f"✅ Camera found at index {i}")
                ret, frame = cap.read()
                if ret:
                    print(f"   - resolution: {frame.shape[1]}x{frame.shape[0]}")
                else:
                    print(f"   - warning: could not read frame")
                cap.release()
                available_ports.append(i)
            else:
                print(f"❌ No camera at index {i}")
        except Exception as e:
            print(f"❌ Error checking index {i}: {e}")
            
    return available_ports

if __name__ == "__main__":
    ports = list_cameras()
    if not ports:
        print("\nSUMMARY: No cameras found! Check connections or permissions.")
    else:
        print(f"\nSUMMARY: Found cameras at indices: {ports}")
