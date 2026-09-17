# Planificación Temporal (300 Horas)

La carga de trabajo se distribuye a lo largo de las 5 fases principales del ciclo de vida del software, optimizando el esfuerzo técnico y garantizando tiempo suficiente para la validación y documentación académica requerida. La estimación total asciende a 300 horas, equivalente a la carga lectiva estándar de un Trabajo Fin de Grado.

## Desglose por Fases y Entregables

### Fase 1: Planificación y Requisitos (20h)
* **Configuración inicial de entorno e infraestructura base (WSL2, Docker, PostGIS, Node, React):** 5h *(Completado)*.
* **Análisis de viabilidad y definición del alcance:** 5h.
* **Especificación formal de requisitos y metodología:** 5h.
* **Investigación de fuentes de datos (NASA FIRMS, REDIAM):** 5h.
* **Entregables clave:** Entorno contenedorizado funcional, Tablero ZenHub configurado y documentos formales de especificación aprobados.

### Fase 2: Análisis y Diseño (35h)
* **Modelado conceptual y lógico de base de datos (E-R):** 10h.
* **Diseño de la arquitectura del sistema y API REST:** 10h.
* **Wireframes, prototipado UI/UX y diseño PWA:** 15h.

* **Entregables clave:** Diagrama Entidad-Relación, especificación de endpoints (Swagger/OpenAPI) y maquetas navegables de la interfaz.

### Fase 3: Construcción y Desarrollo (135h)
* **Capa de Datos y GIS (PostGIS):** 20h. (Estructuras espaciales, funciones topológicas, scripts de población de datos reales).
* **Capa de Negocio (Backend Node/Express/TS):** 50h. (Autenticación, controladores CRUD, WebSockets, integración de API externa).
* **Capa de Presentación (Frontend React/Vite/Tailwind):** 65h. (Mapas con Leaflet, gestión del estado, panel de mandos, notificaciones Push).

* **Entregables clave:** Release v1.0 (Producto Mínimo Viable funcional integrado en la rama `main`).

### Fase 4: Pruebas y Validación (40h)
* **Testing de API (Endpoints e integración):** 15h.
* **Auditoría de rendimiento espacial (Consultas PostGIS):** 10h.
* **Validación de UI/UX, latencia de WebSockets y PWA (Offline):** 15h.

* **Entregables clave:** Batería de pruebas superada, métricas de rendimiento y validación de resiliencia sin conexión de la PWA.

### Fase 5: Documentación Final y Cierre (70h)
* **Redacción de la Memoria del TFG:** 50h. (Estado del arte, metodologías, justificación tecnológica, manuales de despliegue).
* **Elaboración de la presentación y material para la defensa:** 20h.

* **Entregables clave:** Documento final del TFG (PDF), código fuente documentado y diapositivas para la defensa ante el tribunal.

---

**Total Estimado:** 300 Horas.