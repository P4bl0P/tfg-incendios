# Especificación de Requisitos: Historias de Usuario

El ciclo de desarrollo del producto sigue un modelo iterativo e incremental. Los requisitos del sistema se expresan mediante Historias de Usuario, las cuales servirán como entrada principal para diseñar los Casos de Prueba, los Bocetos (UI) y la Arquitectura del Sistema.

## 1. Historias de Usuario: Rol Ciudadano (Público)

* **HU-01 (Visualización de Incendios):** Como ciudadano, quiero visualizar un mapa interactivo con la ubicación y el perímetro de los incendios activos para conocer el nivel de amenaza en mi zona.
* **HU-02 (Consulta de Rutas):** Como ciudadano, quiero ver en el mapa las rutas de evacuación seguras y los puntos de encuentro para saber hacia dónde dirigirme en caso de emergencia.
* **HU-03 (Geolocalización):** Como ciudadano, quiero un botón que centre el mapa en mi ubicación GPS actual para calcular visualmente mi distancia respecto al frente de fuego.
* **HU-04 (Recepción de Alertas):** Como ciudadano, quiero recibir notificaciones push en mi dispositivo móvil cuando cambie el nivel de alerta operativa, para reaccionar de forma inmediata aunque la aplicación esté cerrada (PWA).

## 2. Historias de Usuario: Rol Gestor (Autenticado)

* **HU-05 (Acceso Seguro):** Como gestor de emergencias, quiero iniciar sesión mediante credenciales seguras para acceder al panel de mando exclusivo y evitar el uso no autorizado de la plataforma.
* **HU-06 (Declaración de Incidentes):** Como gestor de emergencias, quiero registrar nuevos focos de incendio y actualizar su estado (Activo, Estabilizado, Controlado, Extinguido) para mantener informada a la población.
* **HU-07 (Edición Cartográfica):** Como gestor de emergencias, quiero dibujar polígonos de afectación y zonas de exclusión directamente sobre el mapa para delimitar las áreas de peligro real.
* **HU-08 (Gestión del Tráfico):** Como gestor de emergencias, quiero marcar tramos de carretera como cortados o intransitables para que el sistema deje de recomendarlos como vías de evacuación.
* **HU-09 (Emisión de Alertas Masivas):** Como gestor de emergencias, quiero enviar alertas masivas desde mi panel de control para que lleguen instantáneamente a todos los ciudadanos conectados al sistema.

## 3. Historias de Usuario: Sistema (Automatización)

* **HU-10 (Ingesta de Satélites):** Como sistema, quiero consumir periódicamente los datos de la API pública de NASA FIRMS para insertar nuevos puntos de calor (anomalías térmicas) de forma automática en la base de datos geoespacial.