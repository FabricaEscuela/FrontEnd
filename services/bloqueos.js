// Cliente HTTP de la HU 019 (bloqueos entre usuarios).
// SRP/DIP: la UI (app.js) no conoce URLs ni verbos; solo consume esta abstracción.
// `api` es el wrapper fetch inyectado desde app.js (service, path, options).

export const createBloqueosApi = (api) => ({
  listar: () => api('queries', '/api/v1/bloqueados'),

  bloquear: (usuarioId) =>
    api('admin', '/api/v1/bloqueos', { method: 'POST', body: JSON.stringify({ usuarioId }) }),

  desbloquear: (usuarioId) =>
    api('admin', `/api/v1/bloqueos/${encodeURIComponent(usuarioId)}`, { method: 'DELETE' }),

  iniciarConversacion: (usuarioId) =>
    api('admin', '/api/v1/conversaciones', { method: 'POST', body: JSON.stringify({ usuarioId }) })
});
