# Metodología de Trabajo y Control de Versiones

## 1. Gestión del Proyecto (ZenHub y Clockify)
* **Tablero Kanban (ZenHub):** Todo el trabajo se estructura en *Issues* asociadas al repositorio de GitHub. El flujo de estados será: `New Issues` -> `To Do` -> `In Progress` -> `Review/Testing` -> `Done`.
* **Registro de Tiempos (Clockify):** El desarrollo se enmarca en un límite estricto de 300 horas. Cada bloque de trabajo debe registrarse bajo el proyecto principal indicando la fase del ciclo de vida y utilizando etiquetas (Investigación, Desarrollo, Documentación).

## 2. Estrategia de Ramas (Gitflow simplificado)
Se utilizará un modelo de ramificación adaptado para un único desarrollador garantizando estabilidad:
* `main`: Rama de producción. Contiene únicamente código estable, funcional y evaluable. Nunca se programa directamente sobre esta rama.
* `develop`: Rama base de desarrollo e integración. Recibe los avances continuos del proyecto.
* `feature/<nombre-funcionalidad>`: Ramas efímeras creadas a partir de `develop` para desarrollar tareas específicas (ej. `feature/mapa-leaflet`, `feature/auth-jwt`). Al terminar, se fusionan (*merge*) con `develop`.

## 3. Convención de Commits (Conventional Commits)
Todos los mensajes de commit seguirán un estándar semántico para generar trazabilidad automática:
* `feat:` Nueva funcionalidad o característica.
* `fix:` Resolución de un error (bug).
* `docs:` Cambios exclusivos en documentación o archivos Markdown.
* `style:` Cambios de formato (espacios, comas) que no afectan a la lógica.
* `refactor:` Refactorización de código que no arregla un error ni añade funcionalidad.
* `chore:` Actualización de dependencias, configuración del entorno (ej. Docker) o tareas rutinarias.

*Ejemplo:* `feat: implementar login de gestores con JWT`