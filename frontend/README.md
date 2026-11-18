# Frontend

Giao diện web HoloLab (Three.js, Rapier, React/Vite). **Hiện chưa có mã nguồn** trong repo.

Cấu trúc dự kiến (đặt trong thư mục này):

| Đường dẫn | Vai trò |
|---|---|
| `web/` | Static app mà backend phục vụ: `index.html`, `data/` (bài học, rubric), `models/`, `vendor/`, `src/` |
| `ui/` | Mã nguồn React; `npm run build` xuất ra `web/ui/` |
| `tests_js/`, `tools/` | Test JavaScript và công cụ QA |

```bash
cd frontend
npm ci
npm test
npm run build
```

Backend đọc `frontend/web/` (đổi bằng biến môi trường `HOLOLAB_WEB_DIR`).
