const BASE_URL = 'https://salon-backend-production-5139.up.railway.app/api';

export const api = {
  get: (endpoint) =>
    fetch(`${BASE_URL}/${endpoint}`).then((r) => r.json()),

  post: (endpoint, data) =>
    fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  put: (endpoint, id, data) =>
    fetch(`${BASE_URL}/${endpoint}?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  delete: (endpoint, id) =>
    fetch(`${BASE_URL}/${endpoint}?id=${id}`, {
      method: 'DELETE',
    }).then((r) => r.json()),
};
