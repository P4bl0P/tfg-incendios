# Especificación de Requisitos: Historias de Usuario

El ciclo de desarrollo del producto sigue un modelo iterativo e incremental basado en metodologías ágiles. Los requisitos del sistema se agrupan en **Épicas** funcionales y se expresan mediante Historias de Usuario (HU), sirviendo como entrada principal para el diseño de la Arquitectura, Interfaz (UI) y Casos de Prueba.

---

## Épica 1: Visualización Base e Interacción Geoespacial
**HU-01: Mapa Base y Focos Activos**
* **Como** ciudadano,
* **quiero** visualizar un mapa interactivo con la ubicación de los incendios activos,
* **para** conocer de forma rápida y visual el nivel de amenaza en mi territorio.
* **Criterios de Aceptación:**
  1. El sistema debe renderizar un mapa utilizando una librería GIS (ej. Leaflet/Mapbox).
  2. Los focos activos deben mostrarse con iconografía clara y diferenciada.
  3. El usuario debe poder alternar entre vista satélite y relieve.

**HU-02: Clustering Dinámico de Focos**
* **Como** usuario del mapa,
* **quiero** que los puntos de calor cercanos se agrupen visualmente al alejar el zoom,
* **para** que la interfaz no se sature ni se ralentice cuando hay multitud de incendios.
* **Criterios de Aceptación:**
  1. Mostrar un círculo con el número total de focos agrupados según el nivel de zoom.
  2. Al hacer clic en un clúster, el mapa debe hacer un zoom automático desglosando los puntos.

**HU-03: Geolocalización del Usuario**
* **Como** ciudadano,
* **quiero** un control que centre el mapa en mi ubicación GPS actual,
* **para** calcular visualmente mi distancia respecto al frente de fuego más cercano.
* **Criterios de Aceptación:**
  1. El navegador debe solicitar permiso de geolocalización.
  2. Al aceptar, un marcador azul indicará la posición del usuario en el mapa.

---

## Épica 2: Contexto Ampliado y Meteorología
**HU-04: Capa Meteorológica (Viento y Temperatura)**
* **Como** analista o ciudadano preventivo,
* **quiero** poder activar una capa superpuesta que muestre datos de viento y temperatura,
* **para** comprender las condiciones atmosféricas que afectan a la propagación del fuego.
* **Criterios de Aceptación:**
  1. Integración con una API externa (ej. OpenWeather) para obtener datos en tiempo real.
  2. La dirección y velocidad del viento debe representarse visualmente sobre los focos.

**HU-05: Panel Detallado y Geocodificación Inversa**
* **Como** usuario que consulta un fuego activo,
* **quiero** ver el municipio afectado y los datos técnicos satelitales al hacer clic en un foco,
* **para** identificar rápidamente la ubicación humana exacta y su intensidad.
* **Criterios de Aceptación:**
  1. Al pulsar un punto, se abrirá un panel lateral (*sidebar*).
  2. El sistema debe traducir las coordenadas al nombre del municipio/provincia (Geocodificación inversa).
  3. Mostrar el valor de intensidad (FRP) si proviene de satélite, o el estado operativo si es manual.

---

## Épica 3: Rutas y Alertas Tempranas
**HU-06: Consulta de Rutas de Evacuación**
* **Como** ciudadano,
* **quiero** ver en el mapa las rutas de evacuación seguras y los puntos de encuentro,
* **para** saber hacia dónde dirigirme en caso de emergencia inminente.
* **Criterios de Aceptación:**
  1. Visualización de polilíneas diferenciadas por color para rutas de evacuación.
  2. Los puntos de encuentro deben tener iconos específicos y mostrar su capacidad si está disponible.

**HU-07: Suscripción y Alertas Push Geolocalizadas**
* **Como** ciudadano en zona de riesgo,
* **quiero** suscribirme a alertas locales,
* **para** recibir una notificación *push* en mi dispositivo si se detecta un nuevo incendio cerca de mí (PWA).
* **Criterios de Aceptación:**
  1. La aplicación web debe registrar un *Service Worker* para notificaciones en segundo plano.
  2. El sistema cruzará las detecciones con la ubicación del usuario para disparar la alerta por proximidad.

---

## Épica 4: Automatización y Análisis
**HU-08: Ingesta Automática Satelital (NASA FIRMS)**
* **Como** sistema,
* **quiero** consumir periódicamente los datos de la API pública de NASA FIRMS,
* **para** insertar nuevos puntos de calor (anomalías térmicas) de forma automática en la base de datos geoespacial.
* **Criterios de Aceptación:**
  1. Tarea programada (*cronjob*) en el backend que actualice los datos periódicamente.
  2. Limpieza o marcado automático de focos antiguos que ya no reporten anomalía térmica.

**HU-09: Dashboard de Estadísticas Históricas**
* **Como** usuario investigador,
* **quiero** acceder a una vista de estadísticas de focos por provincia,
* **para** analizar la frecuencia de los incendios en la temporada actual.
* **Criterios de Aceptación:**
  1. Sección dedicada con gráficos interactivos (ej. Chart.js).
  2. Filtrado de datos por rango de fechas y provincias.

---

## Épica 5: Panel de Gestión y Control (Autenticado)
**HU-10: Acceso Seguro de Gestor**
* **Como** gestor de emergencias,
* **quiero** iniciar sesión mediante credenciales seguras,
* **para** acceder al panel de mando exclusivo y evitar el uso no autorizado.
* **Criterios de Aceptación:**
  1. Formulario de login protegido. Emisión y validación de tokens JWT.

**HU-11: Declaración de Incidentes y Edición Cartográfica**
* **Como** gestor de emergencias,
* **quiero** registrar focos manuales y dibujar polígonos de afectación sobre el mapa,
* **para** delimitar áreas de peligro real que los satélites aún no han detectado o precisado.
* **Criterios de Aceptación:**
  1. Herramientas de dibujo en el mapa (polígonos, zonas de exclusión) exclusivas para gestores.
  2. Capacidad para actualizar el estado del incendio (Activo, Estabilizado, Controlado, Extinguido).

**HU-12: Gestión del Tráfico y Emisión de Alertas**
* **Como** gestor de emergencias,
* **quiero** marcar carreteras como cortadas y enviar alertas masivas,
* **para** bloquear vías en el sistema de rutas y avisar a la población conectada.
* **Criterios de Aceptación:**
  1. Interfaz para trazar o seleccionar vías afectadas.
  2. Botón de emisión de alerta global que dispare notificaciones *push* a todos los usuarios o por áreas.