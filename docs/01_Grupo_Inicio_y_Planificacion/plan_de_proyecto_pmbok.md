# Plan de Proyecto y Estimación Temporal (300 Horas)

La gestión de este Trabajo Fin de Grado se estructura de manera sistemática siguiendo los cinco Grupos de Procesos basados en la terminología PMBOK, tal y como establece la normativa académica. 

## 1. Grupo de Inicio (15 horas)
* **Revisión de la Propuesta y Estimación:** Definición de objetivos, alcance, entregables y estimación inicial de esfuerzo.
* **Acuerdo de Colaboración:** Redacción del Acta de Constitución (Adjudicación).
* **Salidas generadas:** Propuesta de trabajo revisada, Estimación temporal, Acta de Constitución y esqueleto del Plan de Proyecto.

## 2. Grupo de Planificación (35 horas)
* **Requisitos y Arquitectura:** Recopilación y análisis de requisitos mediante Historias de Usuario, y diseño de la arquitectura global del sistema (Docker, PostGIS, Node, React).
* **Planificación de Tareas:** Creación de la EDT (Estructura de Desglose del Trabajo), identificación de hitos y estimación de recursos.
* **Gestión de Riesgos y Seguimiento:** Documentación de riesgos, establecimiento de métricas de control y definición del control de versiones.
* **Salidas generadas:** Plan de Proyecto ampliado, Plan de Ejecución inicial, Diseño de Arquitectura.

## 3. Grupo de Ejecución (140 horas)
*Este grupo aglutina el ciclo de vida de desarrollo del producto (prototipos e incremental).*
* **Desarrollo del Sistema (Implementación):** 110h. Programación de la capa de datos (PostGIS), lógica de negocio (Backend/API) y capa de presentación (PWA).
* **Entorno y Configuración:** 10h. Mantenimiento del entorno Docker, control de versiones y copias de seguridad.
* **Pruebas de Sistema:** 20h. Aplicación de casos de prueba unitarios y de integración.
* **Salidas generadas:** Producto (Incrementos de software), Informe de Actividad, Casos de Prueba aplicados.

## 4. Grupo de Seguimiento (50 horas)
* **Control del Proyecto:** Revisión de registros de estado, seguimiento del cronograma (línea base de tiempo) e informes de estado.
* **Gestión de Calidad (QA):** Auditoría, revisión de criterios de aceptación y evaluación de solicitudes de cambio.
* **Reuniones con Tutor:** Seguimiento de acuerdos, actas de reuniones y validación de entregables.
* **Salidas generadas:** Plan de Seguimiento ampliado, Actas de reuniones, Informes de estado.

## 5. Grupo de Cierre (60 horas)
* **Cierre de Iteraciones y Proyecto:** Redacción de retrospectivas, acuerdo de cierre con el tutor y lecciones aprendidas.
* **Documentación Final:** Elaboración del Manual de Usuario y de la Memoria final del TFG.
* **Salidas generadas:** Acta de Cierre, Manual de Usuario, Memoria del TFG.

## 6. Estructura de Desglose del Trabajo (EDT)
Para facilitar la asignación y seguimiento, el proyecto se divide en los siguientes paquetes de trabajo principales:
* **PT1. Gestión y Planificación:** Actas, planes de proyecto, ejecución y seguimiento.
* **PT2. Especificación y Diseño:** Historias de usuario, bocetos UI, diseño E-R y diagramas de componentes.
* **PT3. Infraestructura y Datos:** Contenedores Docker, configuración PostGIS y scripts de ingesta externa (NASA FIRMS).
* **PT4. Desarrollo Backend:** Autenticación RBAC, API REST, WebSockets.
* **PT5. Desarrollo Frontend:** PWA, renderizado cartográfico (Leaflet), panel de gestión.
* **PT6. Calidad y Cierre:** QA, casos de prueba, actas de reuniones y memoria final del TFG.

## 7. Gestión de Riesgos
* **Riesgo 1 (Tecnológico):** Inestabilidad o cambios en la API pública de NASA FIRMS. 
  * *Mitigación:* Implementar un sistema de control de errores y un *mock* de datos locales para el entorno de desarrollo.
* **Riesgo 2 (Planificación):** Retrasos en el desarrollo debido al límite estricto del WIP (Work In Progress).
  * *Mitigación:* Metodología para corrección de desviaciones mediante la reasignación de horas del Grupo de Seguimiento hacia el de Ejecución.
* **Riesgo 3 (Rendimiento):** Latencia excesiva en consultas geoespaciales complejas.
  * *Mitigación:* Uso de índices espaciales (GiST) en PostGIS desde el inicio de la fase de construcción.
  
---
**Total Estimado:** 300 Horas.