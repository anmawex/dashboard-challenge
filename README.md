# Dashboard Challenge

Esta es una aplicación de dashboard creada con React, diseñada para gestionar productos, visualizar métricas clave y monitorear el inventario.

## Estructura del Proyecto: Arquitectura "Feature-Based"

Este proyecto sigue una arquitectura **feature-based** (basada en funcionalidades). En lugar de organizar el código por tipo de archivo (por ejemplo, todos los componentes en una carpeta y todas las vistas en otra), lo estructuramos en torno a las funcionalidades de la aplicación.

La estructura principal se encuentra en `src/app`:

```
src/app/
├───api/             # Lógicas para interactuar con APIs externas
├───dashboard/       # Funcionalidad del panel principal
├───inventory/       # Funcionalidad de gestión de inventario
├───products/        # Funcionalidad para crear y editar productos
├───shell/           # Componente principal o layout de la aplicación
└───theme/           # Tema de la interfaz de usuario (ej. Material-UI)
```

Además, tenemos un directorio `src/shared` para código que se reutiliza a través de diferentes funcionalidades:

```
src/shared/
├───components/      # Componentes genéricos (formularios, spinners, etc.)
├───hooks/           # Hooks personalizados reutilizables
└───utils/           # Funciones de utilidad (formateo, etc.)
```

### ¿Por Qué se Eligió esta Arquitectura?

La arquitectura "feature-based" fue la mejor opción para este proyecto por varias razones clave:

1.  **Escalabilidad:** Es muy sencillo añadir nuevas funcionalidades. Simplemente se crea una nueva carpeta dentro de `src/app` con todos sus componentes, vistas y hooks, sin afectar al resto de la aplicación.
2.  **Mantenimiento Sencillo:** Todo el código relacionado con una funcionalidad específica está agrupado en un solo lugar. Esto facilita la localización de archivos, la corrección de errores y la refactorización, ya que el contexto está claramente definido.
3.  **Cohesión y Bajo Acoplamiento:** Cada funcionalidad es un módulo cohesivo. Los cambios dentro de una funcionalidad tienen un impacto mínimo en otras, reduciendo el riesgo de introducir errores inesperados en otras partes de la aplicación.
4.  **Autonomía para Equipos:** En un entorno de equipo, diferentes desarrolladores o equipos pueden trabajar en distintas funcionalidades de forma paralela con una menor probabilidad de conflictos.

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm run dev`

Ejecuta la aplicación en modo de desarrollo.
Abre [http://localhost:5173](http://localhost:5173) para verla en tu navegador.

### `npm run build`

Construye la aplicación para producción en la carpeta `dist`.

### `npm run lint`

Ejecuta el linter (ESLint) para identificar y corregir problemas en el código.

### `npm run preview`

Inicia un servidor local para previsualizar la build de producción.

## Instalación y Uso

1.  Clona el repositorio:
    ```sh
    git clone <url-del-repositorio>
    ```
2.  Navega al directorio del proyecto:
    ```sh
    cd dashboard-challenge
    ```
3.  Instala las dependencias:
    ```sh
    npm install
    ```
4.  Inicia la aplicación en modo de desarrollo:
    ```sh
    npm run dev
    ```
