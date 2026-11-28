# Frontend

| Thư mục | Nội dung | Phục vụ tại |
|---|---|---|
| `web/` | **Ứng dụng lab 3D** (JS thuần, Three.js, Rapier, MediaPipe): `index.html`, `src/`, `data/`, `vendor/`, `models/`, `styles.css`. Đã đóng kèm đủ để chạy, không cần build | `/` |
| `ui/` | Khung thư viện bài của lab (React), build ra `web/ui/` (có commit) | `/ui/` |
| `src/`, `index.html` | **Ứng dụng EGAD** (React + Vite), build ra `web/app/` (không commit) | `/app/` |
| `tests_js/` | 156 test (`node --test`) | — |
| `tools/` | Kiểm tra trình duyệt (`qa_mouse_v39.mjs`, `qa_egad_v39.mjs`), `vendor.mjs`; các script `*_v3x` cũ là lịch sử | — |

```bash
cd frontend
npm ci
npm test
npm run build        # build:shell -> web/ui, build:app -> web/app
npm run dev          # EGAD app ở http://localhost:5173 (backend phải chạy ở :8765)
npm run vendor       # chép lại thư viện từ node_modules vào web/vendor
```

Hai test đọc dữ liệu của backend (`../backend/data`, `../backend/training`). Hướng dẫn sử dụng lab: `../docs/HUONG_DAN_THI_NGHIEM.md`.
