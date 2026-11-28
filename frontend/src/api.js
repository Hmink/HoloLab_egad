// Thin client for the Python backend. Errors always carry a Vietnamese message.

export class ApiError extends Error {
  // code: backend error_code (or 'network'); retryable: show "Thử chấm lại"
  constructor(message, { code = 'unknown', retryable = false, status = 0 } = {}) {
    super(message);
    Object.assign(this, { code, retryable, status });
  }
}

async function request(path, options) {
  let response;
  try {
    response = await fetch(path, options);
  } catch {
    throw new ApiError('Không kết nối được backend. Đã chạy "python server.py" trong thư mục backend chưa?', { code: 'network', retryable: true });
  }
  let body = null;
  try {
    body = await response.json();
  } catch {
    /* non-JSON body */
  }
  if (!response.ok) {
    throw new ApiError(body?.error ?? `Backend trả lỗi HTTP ${response.status}.`, {
      code: body?.error_code ?? 'unknown',
      retryable: body?.retryable === true,
      status: response.status,
    });
  }
  return body;
}

export const getHealth = () => request('/api/health');
export const getLessons = () => request('/data/lessons-thpt.json').then((d) => d.lessons);
export const getRubrics = () => request('/data/egad-rubrics.json');
export const assess = (payload) =>
  request('/api/egad/assess', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
