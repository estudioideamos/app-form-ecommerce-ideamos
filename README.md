# Brief Ecommerce | Ideamos

Aplicacion web multipaso para relevar materiales, contenidos y definiciones necesarias para disenar y desarrollar una tienda online para clientes de Ideamos.

## URL

- GitHub Pages: pendiente de publicar

## Que hace

- Releva contacto, contexto del negocio y restricciones del proyecto.
- Ordena identidad de marca, referencias visuales y lineamientos esteticos.
- Reune categorias, catalogo, fotos de producto e imagenes generales.
- Releva contenidos para Home, Nosotros, FAQ, Contacto y politicas.
- Organiza medios de pago, envios, integraciones y datos tecnicos.
- Guarda el avance en `localStorage`.
- Valida los campos clave antes de avanzar.
- Acepta webs escritas con o sin `http://` o `https://`.
- Procesa el brief con FormSubmit.
- Abre un `mailto:` de respaldo si el envio automatico falla.

## Stack

- HTML estatico
- CSS custom
- JavaScript vanilla
- FormSubmit para procesar el brief
- GitHub Pages para hosting

## Estructura

```text
.
|-- assets/
|   |-- ideamos-favicon.png
|   `-- ideamos-logo-hero.png
|-- src/
|   `-- main.js
|-- index.html
|-- styles.css
`-- README.md
```

## Envio del formulario

La logica de envio vive en `src/main.js`.

Comportamiento actual:

- arma un asunto dinamico con el nombre de la empresa
- usa el email del contacto como `reply-to`
- construye un unico `MENSAJE` con todo el resumen del brief
- evita pedir contrasenas o codigos sensibles en el formulario
- abre un mail de respaldo si falla el envio automatico

## Desarrollo local

Como es un sitio estatico, alcanza con abrir `index.html` o servir la carpeta con cualquier servidor simple.

## Mantenimiento

- contenido y estructura: `index.html`
- estilos y responsive: `styles.css`
- navegacion, validacion, guardado y envio: `src/main.js`
