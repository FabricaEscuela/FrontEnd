// Direcciones de las APIs. En localhost se usan los puertos locales;
// en línea, las URLs de Render (rellenar al crear los servicios).
const local = ['localhost', '127.0.0.1'].includes(window.location.hostname);
window.CODEFORGE_API = local
  ? { admin: 'http://localhost:8080', auth: 'http://localhost:8081', queries: 'http://localhost:8082' }
  : { admin: 'RELLENAR_URL_ADMINISTRACION', auth: 'RELLENAR_URL_AUTENTICACION', queries: 'RELLENAR_URL_CONSULTAS' };
