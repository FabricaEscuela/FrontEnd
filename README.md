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
- Crear proyectos y dar like.
- Crear discusiones, consultar una discusión por ID y marcarla resuelta.
- Consultar y editar perfil, seguir usuarios y enviar mensajes directos.
- Selector de tecnologías alimentado por `GET /api/v1/technologies`.

La API de feed solo publica tipo, título, ID, autor y fecha. Por eso el feed presenta esos datos y abre los detalles de discusiones cuando se solicita su ID; la API actual no ofrece una vista de contenido completa ni listado de proyectos/discusiones.



