// Direcciones de las APIs. En localhost se usan los puertos locales;
// en línea, las URLs de Render (rellenar al crear los servicios).
const local = ['localhost', '127.0.0.1'].includes(window.location.hostname);
window.CODEFORGE_API = local
  ? { admin: 'http://localhost:8080', auth: 'http://localhost:8081', queries: 'http://localhost:8082' }
  : { admin: 'https://codeforge-administracion.onrender.com', auth: 'https://codeforge-autenticacion.onrender.com', queries: 'https://codeforge-consultas.onrender.com' };
