import { api } from './client';

export const ordersApi = {
  list(params = {}) {
    const search = new URLSearchParams(params);
    const qs = search.toString();
    return api.get(`/orders${qs ? `?${qs}` : ''}`, { auth: true });
  },
  get(orderId) {
    return api.get(`/orders/${orderId}`, { auth: true });
  },
  create(payload) {
    return api.post('/orders', payload, { auth: true });
  },
  cancel(orderId) {
    return api.post(`/orders/${orderId}/cancel`, {}, { auth: true });
  },
};

export const couponsApi = {
  validate(code, subtotalCents) {
    return api.post('/coupons/validate', { code, subtotalCents }, { auth: true });
  },
};

export const addressApi = {
  list() {
    return api.get('/users/me/addresses', { auth: true });
  },
  create(payload) {
    return api.post('/users/me/addresses', payload, { auth: true });
  },
  remove(id) {
    return api.delete(`/users/me/addresses/${id}`, { auth: true });
  },
};
