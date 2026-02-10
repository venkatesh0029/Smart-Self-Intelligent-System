import requests
import time
import sys

def check_endpoint(url, name, retries=5, delay=2):
    print(f"Checking {name} at {url}...")
    for i in range(retries):
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                print(f"✅ {name} is UP ({response.status_code})")
                return True
            else:
                print(f"⚠️ {name} returned {response.status_code}")
        except requests.exceptions.ConnectionError:
            print(f"⏳ {name} connection failed, retrying ({i+1}/{retries})...")
        except Exception as e:
            print(f"❌ {name} error: {e}")
        
        time.sleep(delay)
    
    print(f"❌ {name} is DOWN after {retries} attempts")
    return False

def main():
    print("--- System Verification ---")
    
    backend_ok = check_endpoint("http://localhost:8000/health", "Backend API")
    frontend_ok = check_endpoint("http://localhost:3000", "Frontend Dashboard")
    
    if backend_ok and frontend_ok:
        print("\n✅ All systems GO!")
        sys.exit(0)
    else:
        print("\n❌ System verification FAILED")
        sys.exit(1)

if __name__ == "__main__":
    main()
