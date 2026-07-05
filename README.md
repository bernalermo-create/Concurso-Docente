# Bootcamp Concurso Docente V2.1
Proyecto HTML dinámico conectado a Google Sheets mediante Google Apps Script.

## Configuración actual
- Sheet ID: `1UhYVKzGJkA_QtDwWkpI2oFfTO8-QNgujPbZ7kRdYuVI`
- Web App: `https://script.google.com/macros/s/AKfycbx8kP0YY2hBF7eg6OVvrW1NrIz2iraUrKoZ9PCgfhKJNwUhGTGD1rrZoz9eNXZVlOpQDg/exec`

## Hojas esperadas (se crean solas si no existen)
- `QuizResults`
- `ErrorLog`

## Despliegue

### 1. Apps Script
1. Abre la Hoja de Cálculo → Extensiones → Apps Script.
2. Pega el contenido de `apps-script.gs` (reemplaza todo).
3. Implementar → Nueva implementación → Tipo: **Aplicación web**.
   - Ejecutar como: **Yo (tu cuenta)**
   - Quién tiene acceso: **Cualquier usuario**
4. Copia la URL `/exec` generada. Si ya tenías una implementación, usa
   "Gestionar implementaciones" → editar → **Nueva versión** para que los
   cambios del script se apliquen sin cambiar la URL.
5. Prueba abriendo la URL `/exec` directamente en el navegador: debe
   responder `{"ok":true,"status":"Apps Script activo"}`. Si ves un error
   de permisos, vuelve a autorizar el script.

### 2. Sitio estático (GitHub Pages / Vercel)
1. Sube esta carpeta a un repositorio de GitHub.
2. Si usas GitHub Pages: Settings → Pages → Deploy from branch → selecciona
   la rama y la carpeta raíz.
3. Si cambiaste la URL del Web App, actualízala en
   `assets/js/app.js` (constante `WEB_APP_URL`).
4. Abre `index.html` (o la URL publicada).

## Notas técnicas
- Las peticiones a Apps Script se hacen con `mode: "no-cors"` porque Google
  Apps Script no permite leer la respuesta desde otro dominio (como GitHub
  Pages). El guardado en la hoja sí ocurre correctamente; solo no podemos
  leer la confirmación de vuelta desde el navegador.
- El Apps Script usa `LockService` para evitar que dos envíos simultáneos
  se sobrescriban en la hoja.
- Todo el texto dinámico se escapa antes de insertarse en el DOM para
  evitar inyección de HTML/JS a través del campo de nombre del docente.
