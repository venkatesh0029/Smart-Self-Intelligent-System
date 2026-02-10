# 🚀 Project Roadmap

## 🔴 Phase 1: Data & Model (MOST IMPORTANT)
*This gives you the biggest accuracy boost.*

- [x] **Collect 500–2000 shelf images**
  - Real CCTV footage or phone camera.
  - Different angles, lighting, crowd levels.
  - Empty, full, half-full shelves.
- [x] **Extract frames from videos (1–2 FPS)**
- [x] **Clean dataset**
  - Remove blurry / duplicate frames.
- [x] **Label dataset in YOLO format**
  - Classes: `item`, `empty_shelf`, `misplaced_item`.
  - Validate labels (no missing boxes, consistent classes).
- [x] **Split dataset**
  - 70% train
  - 20% validation
  - 10% test
- [x] **Train custom YOLOv8 model**
  - `imgsz`: 640
  - `epochs`: 50–100
  - `augmentation`: ON
  - Evaluate: mAP50, precision, recall
- [x] **Save best weights (`best.pt`)**

## 🔵 Phase 2: Model Integration (Backend)
*Now connect ML → system.*

- [x] **Replace YOLO weights in backend container**
- [x] **Update model loading path**
- [x] **Verify DeepSORT tracking still works**
- [x] **Run detection on test video**
- [x] **Log detection events to MongoDB**
- [x] **Validate confidence thresholds**

## 🟠 Phase 3: Event & Analytics Validation
*Make sure AI output flows correctly.*

- [x] **Generate test events**
  - Pick, Place, Misplacement, Stockout.
- [x] **Verify data flow**
  - Events saved in MongoDB.
  - Inventory updates in PostgreSQL.
  - Cache updates in Redis.
- [x] **Check Analytics API (`/api/analytics/dashboard`)**
- [x] **Verify charts update with new data**

## 🟡 Phase 4: Alerts System
*Make it production-ready.*

- [x] **Configure Email / WhatsApp alerts**
- [x] **Set severity thresholds**
- [x] **Test alert triggering**
- [x] **Add alert resolve flow**
- [x] **Add alert history**

## 🟢 Phase 5: Frontend Polish (High Impact)
*Make it look enterprise-grade.*

- [x] **Add animations (Framer Motion)**
- [x] **Add skeleton loaders**
- [x] **Add page transitions**
- [x] **Add live update feeling**
- [x] **Add AI explainability panel**
- [x] **Add demo mode toggle**

## 🟣 Phase 6: System Health & Reliability
*This is what impresses interviewers.*

- [x] **Show System Metrics**
  - FPS, Model latency, API health, Queue size, Container status.
- [x] **Add system health page**
- [x] **Add logs viewer**

## ⚫ Phase 7: Final Demo & Deployment
*Make it demo-ready.*

- [x] **Create demo dataset**
- [x] **Create demo video stream**
- [x] **Record demo video**
- [x] **Write clean README**
- [x] **Prepare architecture diagram**
- [x] **Add screenshots**
- [x] **Deploy on cloud (optional)**

---
**✅ If You Follow This Order**
You will have:
- Real AI system (not fake)
- Production-style architecture
- Strong ML + Full-stack proof
- Resume-ready project
- Placement-ready demo
