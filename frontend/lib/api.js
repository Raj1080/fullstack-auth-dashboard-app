// frontend/lib/api.js
const BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: 'include', // IMPORTANT: send cookies for auth
    headers: {
      'Content-Type': options?.body ? 'application/json' : undefined,
      ...(options?.headers || {}),
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw { status: res.status, data };
    return data;
  } catch (err) {
    // If parse failed but res.ok, return raw text
    if (res.ok) return text;
    throw err;
  }
}

export function get(path) {
  return request(path, { method: 'GET' });
}
export function post(path, body) {
  return request(path, { method: 'POST', body });
}
export function put(path, body) {
  return request(path, { method: 'PUT', body });
}
export function del(path) {
  return request(path, { method: 'DELETE' });
}
