const BASE_URL = 'https://salon-backend-production-5139.up.railway.app/api';

function checkResponse(r) {
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
  return r.json();
}

export const api = {
  get: (endpoint) =>
    fetch(`${BASE_URL}/${endpoint}`).then(checkResponse),

  post: (endpoint, data) =>
    fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(checkResponse),

  put: (endpoint, id, data) =>
    fetch(`${BASE_URL}/${endpoint}?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(checkResponse),

  delete: (endpoint, id) =>
    fetch(`${BASE_URL}/${endpoint}?id=${id}`, {
      method: 'DELETE',
    }).then(checkResponse),
};
