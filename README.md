# CodeForge Frontend

Interfaz web responsive para los servicios de autenticación, administración y consultas.

## Ejecutar

1. Inicia las tres APIs en los puertos 8080, 8081 y 8082, y la base de datos.
2. Desde esta carpeta ejecuta `powershell -ExecutionPolicy Bypass -File .\serve.ps1`. Mantén esa ventana abierta mientras uses el frontend; presiona Ctrl+C para detener el servidor.
3. Abre <http://localhost:5500>.

El puerto 5500 coincide con el origen permitido por CORS en los tres servicios. Si cambias el puerto, actualiza los valores de `API` en `app.js` y la configuración CORS de los servicios.

## Funciones conectadas

- Registro y acceso JWT.
- Feed cronológico del servicio de consultas.
- Explorar y publicar proyectos; ver detalle y dar like.
- Leer y publicar comentarios desde el detalle de un proyecto; abrir una conversación con su autor.
- Explorar y publicar discusiones; consultar detalle completo y resolver las propias.
- Consultar y editar perfil, seguir usuarios y mantener conversaciones privadas.
- Selector de tecnologías alimentado por `GET /api/v1/technologies`.

Las publicaciones recientes se consultan desde `GET /api/v1/projects` y `GET /api/v1/discussions`. Los detalles se obtienen desde `GET /api/v1/projects/{id}` y `GET /api/v1/discussions/{id}`. El historial de una conversación se consulta en `GET /api/v1/mensajes?with={userId}`; el envío existente usa `POST /api/v1/mensajes`.

Los comentarios de proyectos usan `GET` y `POST /api/v1/projects/{id}/comments`. El formulario aparece dentro del detalle de cada proyecto.

Si una API responde 401, el frontend cierra la sesión local y solicita iniciar sesión otra vez. El puerto 5500 debe mantenerse para coincidir con CORS.
