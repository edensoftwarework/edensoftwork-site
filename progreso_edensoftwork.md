# Progreso del Proyecto EDEN SoftWork

## Descripción del Proyecto
EDEN SoftWork es un emprendimiento de desarrollo de soluciones de software personalizadas. Ofrece servicios como mini softwares a medida, aplicaciones móviles y web, planillas, sitios web, integración de APIs, y mantenimiento. El sitio web principal es edensoftwork.com, alojado en Cloudflare con GitHub Pages.

## Archivos Creados/Editados
- **index.html**: Página principal con secciones de inicio, servicios, acerca de, portfolio y contacto. Diseño responsivo, profesional y moderno.
- **styles.css**: Estilos modulares con gradientes, íconos SVG, animaciones sutiles, y media queries para móvil/tablet.
- **favicon.svg**: Icono simple para la pestaña del navegador.
- **portfolio/gestion-turnos/index.html**: Sistema completo de Gestión de Turnos para el portfolio.
- **portfolio/gestion-turnos/styles.css**: Estilos externos para el sistema de turnos.
- **portfolio/gestion-turnos/script.js**: JavaScript externo para la lógica del sistema de turnos.
- **README.md**: Archivo de documentación (si existe).
- **progreso_edensoftwork.md**: Este archivo de progreso.

## Funcionalidades del Sitio Web
- **Diseño**: Header fijo con navegación, hero con gradiente, grid de servicios con íconos, secciones de about, portfolio y contacto con formulario.
- **Estética**: Colores vibrantes (púrpura-azul), bordes redondeados, sombras, animaciones de fade-in y hover.
- **Responsividad**: Adaptado para PC, notebook, tablet y móvil con media queries.
- **Tecnologías**: HTML5, CSS3, JavaScript básico para scroll suave y funcionalidad de proyectos.

## Proyecto Portfolio: Sistema de Gestión de Turnos
Ubicación: `/portfolio/gestion-turnos/`

### Funcionalidades Implementadas
- **Agregar Turnos**: Formulario con campos para cliente, fecha, hora inicio y fin. Validaciones estrictas (horarios 08:00-22:00, no fechas pasadas, no superposiciones, autocalculo de 30 min para hora fin).
- **Calendario Visual**: Calendario mensual navegable con días marcados según estado (sin turnos, con turnos activos, con turnos terminados). Día actual con colores especiales (azul oscuro si hay turnos activos, gris si terminados o sin turnos).
- **Modal de Día**: Al hacer clic en un día, muestra un timeline visual con barras horizontales representando los turnos. Eje de horarios en negrita para visibilidad.
- **Filtros y Búsqueda**:
  - Botones: "Hoy" (turnos del día actual), "Esta Semana" (lunes a domingo de la semana actual), "Todos" (desde hoy al futuro).
  - Búsqueda por cliente: Filtra turnos cuyos nombres comiencen con las letras ingresadas, combinable con filtros de fecha.
- **Estadísticas**: Contadores centrados arriba del calendario: Total de turnos (desde hoy), Turnos hoy, Turnos esta semana.
- **Edición de Turnos**: Modal separado para editar cliente, fecha y horarios con las mismas validaciones. Solo disponible para turnos no terminados.
- **Eliminación**: Opción para eliminar turnos, con confirmación.
- **Estados de Turnos**:
  - Turnos activos: Azul, editables.
  - Turnos terminados: Gris, solo eliminables.
- **Persistencia**: localStorage para guardar turnos entre sesiones.
- **Interfaz**: Profesional, responsiva, con cursores indicadores, mensajes de error, y navegación intuitiva.
- **Modularización**: Código separado en `index.html`, `styles.css` y `script.js` para mejor mantenibilidad.

### Tecnologías Usadas
- **Frontend**: HTML5, CSS3 (Flexbox, Grid), JavaScript (Vanilla JS).
- **Persistencia**: localStorage.
- **Validaciones**: JavaScript para horarios, fechas y conflictos.
- **Diseño**: Colores consistentes, modales, animaciones sutiles.

## Proyecto Portfolio: Sistema de Gestión de Inventario
Ubicación: `/portfolio/gestion-inventario/`

### Funcionalidades Implementadas
- **Agregar Productos**: Formulario con campos para nombre, descripción, categoría, proveedor, precios, stock inicial, unidad y umbral bajo stock. Validaciones estrictas y autocalculo de valor total.
- **Editar/Eliminar Productos**: Modal para edición con mismas validaciones; eliminación con confirmación, marcando como inactivo.
- **Categorías y Proveedores**: Gestión integrada: agregar/editar categorías y proveedores con nombre y contacto.
- **Movimientos de Stock**: Registro de entradas/salidas/ajustes con cantidad, fecha y notas. Actualización automática del stock.
- **Vista de Inventario**: Tabla con paginación, columnas ordenables (Nombre, Categoría, Proveedor, Stock, Precio Venta, Valor Total). Indicadores visuales para bajo stock.
- **Alertas de Bajo Stock**: Resaltado en tabla y estadísticas de productos por debajo del umbral.
- **Búsqueda y Filtros Avanzados**:
  - Búsqueda por nombre.
  - Filtros por categoría, proveedor, nivel de stock (bajo/normal/alto), rango de precios.
  - Combinables para consultas precisas.
- **Estadísticas y Reportes**: Dashboard con total productos, valor inventario, productos bajo stock. Gráficos interactivos (pie para categorías, barras para niveles de stock) usando Chart.js.
- **Exportación**: Descarga de tabla completa o filtrada a CSV usando PapaParse.
- **Interfaz Visual**: Profesional, responsiva, con modales, tooltips, animaciones. Tema consistente con colores neutros.
- **Estados y Validaciones**: Productos activos/inactivos, validaciones de campos, lógica de stock (no negativo en salidas).
- **Persistencia**: localStorage para productos, categorías, proveedores y movimientos. Importación/exportación de datos JSON.
- **Modularización**: Código separado en `index.html`, `styles.css` y `script.js`.

### Tecnologías Usadas
- **Frontend**: HTML5, CSS3 (Flexbox, Grid, Media Queries), JavaScript (Vanilla JS).
- **Librerías Externas**: Chart.js para gráficos, PapaParse para CSV.
- **Persistencia**: localStorage.
- **Validaciones**: JavaScript para campos y lógica de negocio.
- **Diseño**: Colores profesionales, íconos SVG, sombras y bordes redondeados.

## Progreso Actual
- Sitio web básico completo y funcional.
- Sección Portfolio agregada al sitio principal con preview de los proyectos.
- Segundo proyecto del portfolio completado: Sistema de Gestión de Inventario, un web app completo para control de stock en pequeños negocios.
- Sistema incluye CRUD avanzado, gestión de categorías/proveedores, movimientos de stock, filtros, estadísticas con gráficos, exportación CSV, y persistencia local.
- Ambos proyectos modularizados, responsivos, y listos para presentación en portfolio.
- Enlaces ajustados para navegación directa.
- Usuario listo para commitear y pushear actualizaciones.
- Proyecto concluido por ahora; listo para próximos desarrollos.

## Próximos Pasos
1. Desarrollar más proyectos para portfolio (web apps simples sin backend inicialmente).
2. Crear cuentas en redes sociales (Instagram, LinkedIn) para promoción.
3. Agregar más secciones o contenido al sitio principal si es necesario.
4. Implementar backend en proyectos futuros si es necesario.
5. Monitorear y optimizar SEO.
6. Considerar agregar exportación de turnos o notificaciones.

## Notas
- Usa Git para versionar cambios.
- El sitio está alojado y activo.
- Contacto: Formulario básico (sin envío real; agregar backend si se necesita).
- El proyecto de gestión de turnos es un ejemplo sólido del trabajo de EDEN SoftWork.

Fecha: Enero 11, 2026