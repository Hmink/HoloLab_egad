# Frontend

Vite + React. Hiện có: khung ứng dụng, trang **EGAD thử nghiệm** (`src/pages/EgadPilot.jsx`). Phòng thí nghiệm 3D chưa có.

```
frontend/
  index.html, vite.config.js, package.json
  src/         App.jsx, api.js, lib/egad.js (hàm thuần, có test), pages/, styles.css
  tests_js/    test bằng node --test
  web/         thư mục backend phục vụ
    data/      bài học + rubric (BẢN NHÁP, chưa được giáo viên xác nhận), commit vào git
    index.html, assets/   kết quả build, KHÔNG commit
```

## Chạy

Cần Node 20+ và backend chạy sẵn (`cd backend && python server.py`, cần `backend/.env` có `GEMINI_API_KEY`).

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173 (proxy sang backend :8765)
```

Chạy bản build qua backend (một cổng duy nhất):

```bash
npm run build      # xuất vào web/
cd ../backend && python server.py   # http://127.0.0.1:8765
```

```bash
npm test
```

Hợp đồng API: `../docs/API.md`.

## Việc tiếp theo (giai đoạn 2–3)
Giao diện gán nhãn cho giáo viên, nhiều bài học hơn, cảnh 3D (thêm `three`, `@dimforge/rapier3d-compat` khi cần).
