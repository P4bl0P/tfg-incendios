# Especificación de Requisitos del Sistema

## 1. Requisitos Funcionales (RF)

### 1.1. Módulo Público (Ciudadanía - Acceso no autenticado)
* **RF-01 (Visualización Cartográfica):** El sistema mostrará un mapa interactivo con la ubicación y el polígono de afectación de los incendios activos.
* **RF-02 (Consulta de Rutas):** El sistema renderizará las vías de evacuación seguras y los puntos de encuentro establecidos.
* **RF-03 (Recepción de Alertas):** El sistema mostrará notificaciones en tiempo real si un gestor eleva el nivel de alerta.
* **RF-04 (Geolocalización):** El sistema permitirá al usuario centrar el mapa en su ubicación actual (GPS) para comprobar su proximidad al perímetro del fuego.

### 1.2. Módulo de Gestión (Mando y Coordinación - Autenticado)
* **RF-05 (Autenticación):** Acceso restringido mediante credenciales (Email y Contraseña) bajo un esquema de Control de Acceso Basado en Roles (RBAC).
* **RF-06 (Gestión de Incidentes):** Capacidad para registrar, modificar el estado (Activo, Estabilizado, Controlado, Extinguido) y cerrar focos de incendio.
* **RF-07 (Edición Espacial):** Herramientas para dibujar, editar y eliminar perímetros de fuego y zonas de exclusión sobre la cartografía base.
* **RF-08 (Gestión de Rutas):** Trazado manual de rutas de evacuación y marcado de tramos de infraestructura viaria como cortados.
* **RF-09 (Emisión de Alertas):** Funcionalidad para disparar alertas masivas hacia la población conectada a la plataforma.

### 1.3. Módulo de Sistema (Backend)
* **RF-10 (Ingesta de Datos):** Capacidad para consumir fuentes de datos externas oficiales (ej. API NASA FIRMS, MITECO) para la importación de detecciones térmicas.

## 2. Requisitos No Funcionales (RNF)

* **RNF-01 (Arquitectura y Despliegue):** El entorno de ejecución estará contenedorizado mediante Docker y Docker Compose.
* **RNF-02 (Rendimiento Geoespacial):** Los cálculos de topología (intersecciones, áreas, proximidad) se delegarán al motor de base de datos PostgreSQL mediante la extensión PostGIS.
* **RNF-03 (Seguridad):** Las contraseñas se almacenarán cifradas (Bcrypt) y las sesiones se gestionarán sin estado en el servidor mediante JSON Web Tokens (JWT).
* **RNF-04 (Usabilidad Móvil):** La interfaz pública se construirá como una Progressive Web App (PWA), instalable y completamente *responsive*.
* **RNF-05 (Resiliencia Offline):** El cliente web cacheará los activos estáticos y el último estado crítico del mapa conocido utilizando Service Workers.
* **RNF-06 (Tiempo Real):** La latencia en la propagación de alertas desde el gestor a los ciudadanos será inferior a 2 segundos mediante tecnología WebSocket.
