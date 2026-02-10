# Smart-Self-Intelligent-System
An enterprise-grade AI-powered retail intelligence platform that uses Computer Vision (YOLOv8) with real-time video streams to monitor shelves, detect anomalies, analyze customer interactions, and automate restocking alerts. The system is built with a scalable microservices architecture using Docker, modern web tech, and ML analytics.

##🎯 Goal: Reduce manual shelf checks, prevent stockouts/theft, and provide actionable insights to retail managers in real time.

##✨ Key Features
```
🧠 Real-Time Computer Vision

Detects products, empty shelves, misplacements using YOLOv8

Supports CCTV/USB camera streams

📊 ML Analytics

Anomaly detection (unusual shelf behavior)

Predictive restocking alerts

Customer interaction analysis (heatmaps, dwell time – future scope)

🌐 Full-Stack Platform

Frontend dashboard for visualization

Backend APIs for analytics & alerts

Multi-database support (Postgres, MongoDB, Redis)

🐳 Production-Ready Deployment

Dockerized services
```
## 🏗 System Architecture
```
                    +----------------------+
                    |      Frontend        |
                    |  (React Dashboard)   |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |      API Gateway     |
                    |   (Backend Service)  |
                    +----+-----------+-----+
                         |           |
                         v           v
              +----------------+   +----------------+
              |  PostgreSQL    |   |   MongoDB      |
              | (Inventory DB) |   | (Events Logs)  | 
              +----------------+   +----------------+
                         |            |
                         v            v
                    +----------------------+
                    |     ML Analytics     |
                    | (Anomaly + Forecast) |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |  CV Engine (YOLOv8)  |
                    | Real-Time Detection  |
                    +----------+-----------+
                               |
                               v
                        CCTV / USB Camera
```
## Core Tech Stack
```
| Layer       | Technology                 |
| ----------- | -------------------------- |
| Frontend    | React / Web UI             |
| Backend     | Python / Node.js APIs      |
| AI Engine   | YOLOv8 (Ultralytics)       |
| Databases   | PostgreSQL, MongoDB, Redis |
| DevOps      | Docker, Docker Compose     |
| ML Pipeline | Custom YOLO training       |
```

## 📁 Project Structure
```
Smart-Self-Intelligent-System/
│
├── backend/                    # Backend API services
│   ├── app/                    # Core backend logic
│   ├── services/               # Analytics & alert services
│   └── requirements.txt
│
├── frontend/                   # Dashboard UI
│   ├── src/
│   └── public/
│
├── ai_engine/                  # Computer Vision pipeline
│   ├── inference.py
│   ├── yolov8_model/
│   └── train_yolo.py
│
├── datasets/                   # Custom datasets (YOLO format)
│
├── smart-trolley.v2i.yolov8/   # Custom YOLO dataset / model
│
├── database/
│   ├── postgres_init.sql
│   └── migrations/
│
├── utils/                      # Helper scripts
│
├── docker-compose.yml          # Development stack
├── docker-compose.prod.yml     # Production stack
├── run_with_docker.bat         # Windows dev runner
├── run_prod_docker.bat         # Production runner
├── verify_system.py            # Health checks
├── check_camera.py             # Camera test script
├── .env.example                # Environment variables template
└── README.md                   # Project documentation
```
## ⚙️ Installation & Setup
```
✅ Prerequisites

Python 3.9+

Docker & Docker Compose

Node.js (for frontend)

NVIDIA GPU (optional, recommended for YOLO performance)
```
##🚀 Quick Start (Docker – Recommended)
```
git clone https://github.com/venkatesh0029/Smart-Self-Intelligent-System.git
cd Smart-Self-Intelligent-System
docker-compose up --build
```
Frontend:
👉 http://localhost:3000

Backend API:
👉 http://localhost:8000/docs

## 🧪 Verify System Health
```
python verify_system.py
```
##🎯 Training Custom YOLO Model
```
pip install ultralytics
yolo detect train model=yolov8n.pt data=dataset.yaml epochs=50
```
This will train a custom model for:

Products

Empty shelves

Misplaced items

## 📊 Example Use Cases
```
📉 Detect out-of-stock shelves

🚨 Identify misplaced products

🕵️ Monitor suspicious activity / shrinkage

📦 Generate automatic restocking alerts

🧍 Analyze customer-product interactions
```
## 🔮 Roadmap
 Mobile App (React Native)

 Advanced customer heatmaps

 Auto retraining ML pipeline

 Cloud deployment (AWS/GCP)

 Role-based dashboard access
 ## 🛡 Security & Privacy
Camera streams processed locally (no cloud upload by default)

Sensitive configs stored in .env

Database isolated via Docker network
## 📜 License
This project is licensed under the MIT License.
