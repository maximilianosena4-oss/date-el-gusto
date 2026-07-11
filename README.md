# 🍗 Date el Gusto - Pollos al Spiedo

Sitio web responsive de la rotisería **"Date el Gusto"**, especializada en pollos al spiedo y guarniciones, ubicada en Quilmes, Buenos Aires.

Proyecto realizado como **entrega final del curso de Frontend en TalentoTech**: un e-commerce dinámico e interactivo que consume productos desde una **API REST (Fake Store API)**, los renderiza como cards en el DOM y permite gestionar un **carrito de compras con persistencia en localStorage**. Aplica los conceptos de HTML5 semántico, CSS3, Flexbox, Grid, Bootstrap 5, diseño responsive y JavaScript vistos a lo largo del curso.

---

## 🌐 Demo

- **Sitio publicado:** [pendiente — pegar URL de GitHub Pages]
- **Repositorio:** [pendiente — pegar URL del repo]

---

## 📋 Descripción del proyecto

Sitio e-commerce de la rotisería que permite:

- Ver el catálogo de productos **cargado dinámicamente desde la Fake Store API** (imagen, título y precio en cada card).
- **Agregar productos al carrito**, editar cantidades, eliminar items y vaciar el carrito, con **total y contador actualizados en tiempo real**.
- **Persistencia del carrito en localStorage**: el pedido se mantiene aunque se cierre o actualice la página.
- Simular la compra con el botón "Finalizar compra".
- Ver un video del proceso de cocción al spiedo.
- Leer reseñas de clientes.
- Contactar al negocio mediante un formulario **validado con JavaScript** (campos requeridos y formato de email) que envía por Formspree, o directamente por WhatsApp.

---

## 🛠 Tecnologías y conceptos aplicados

### HTML5
- Estructura semántica: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Encabezados jerárquicos (`<h1>` a `<h3>`)
- Lista de navegación desordenada (`<ul>` + `<li>` + `<a>`)
- Multimedia: `<img>` con `alt` y `<video>` con `controls`
- Formulario de contacto: `<input>`, `<label>`, `<textarea>`, `<button>`

### CSS3
- Archivo CSS externo (`styles.css`)
- Selectores: universal (`*`), de etiqueta, de clase, descendientes
- Modelo de caja: `box-sizing: border-box`, `margin`, `padding`, `border`, `border-radius`
- Tipografía: `font-family`, `font-size`, `font-weight`, `letter-spacing`, `text-align`
- Pseudoclases: `:hover`, `:focus`
- Background: `background-color`, `background-image`, `background-size`, `background-position`
- Colores: hex (`#c1121f`) y `rgba()` con transparencia
- **Bootstrap 5** (CDN): clases utilitarias `shadow-sm` en cards de productos, reseñas y formulario, complementando la maquetación propia con Flexbox y Grid

### Layout
- **Flexbox** en sección de Productos (cards adaptables)
- **Flexbox** en navegación, hero y contacto
- **CSS Grid** en sección de Reseñas (3 columnas en desktop)
- **Media Queries** para diseño responsive (tablets 992px, móvil 768px y 480px)

### JavaScript (script.js)
- **Fetch API**: consumo de la API REST `https://fakestoreapi.com/products` con promesas (`.then` / `.catch`) y manejo de errores
- **Manipulación del DOM**: renderizado dinámico de las cards de productos y de los items del carrito (`createElement`, `innerHTML`, `appendChild`)
- **Eventos**: `addEventListener` con delegación de eventos para los botones de agregar, sumar, restar y eliminar
- **Carrito de compras**: altas, bajas, modificación de cantidades, subtotales y total dinámico
- **localStorage**: persistencia del carrito con `JSON.stringify` / `JSON.parse` y protección ante datos corruptos con `try/catch`
- **Validación de formulario**: campos requeridos y formato de correo con expresión regular, mostrando mensajes de error por campo
- **Mensajes al usuario**: aviso flotante (`role="status"`) al agregar/eliminar productos y al finalizar la compra

### SEO y accesibilidad
- Metaetiquetas `description`, `keywords`, `author` y Open Graph en el `<head>`
- Atributos `alt` en todas las imágenes (incluidas las generadas dinámicamente)
- `aria-label` en los botones de control del carrito y navegación por teclado con elementos nativos (`<button>`, `<a>`)

### Tipografías
- **Google Fonts**: Bebas Neue (títulos) y Open Sans (cuerpo)

### Formulario
- Integración con **Formspree** para recibir los mensajes en email

---

## 📁 Estructura de archivos

```
Date-el-Gusto/
├── index.html           ← Estructura HTML semántica + metadatos SEO
├── styles.css           ← Estilos CSS con responsive
├── script.js            ← Fetch API, DOM, carrito con localStorage y validaciones
├── README.md            ← Este archivo
├── img/
│   ├── hero-pollo-papas.jpg
│   ├── pollo-clasico.jpg
│   ├── pollo-dorado.jpg
│   ├── pollo-limon.jpg
│   └── papas-fritas.jpg
└── video/
    └── spiedo-en-vivo.mp4
```

---

## 🚀 Cómo verlo localmente

1. Cloná o descargá el repositorio
2. Abrí `index.html` con doble clic en cualquier navegador moderno
3. (Opcional) Si usás VS Code, instalá la extensión **Live Server** y abrilo con clic derecho → "Open with Live Server"

---

## 🔧 Configuración del formulario (Formspree)

El formulario de contacto ya está conectado a Formspree y listo para recibir mensajes:

```html
<form class="formulario shadow-sm" id="formulario-contacto" action="https://formspree.io/f/xbdvneqp" method="POST" novalidate>
```

Si en algún momento necesitás asociarlo a otra cuenta, entrá a [https://formspree.io](https://formspree.io), creá un nuevo formulario y reemplazá `xbdvneqp` por el ID nuevo en el atributo `action` de `index.html`.

---

## 📤 Cómo subir a GitHub Pages

1. Crear un repositorio público en GitHub (por ejemplo: `date-el-gusto`)
2. Subir todos los archivos del proyecto al repositorio
3. Ir a `Settings → Pages`
4. En "Source" elegir la rama `main` y la carpeta `/ (root)`
5. Hacer clic en "Save"
6. Esperar 1-2 minutos. La URL será:
   ```
   https://[tu-usuario].github.io/date-el-gusto/
   ```

---

## 📱 Responsive - puntos de quiebre

| Dispositivo | Breakpoint | Comportamiento |
|---|---|---|
| Desktop | > 992px | Grid 3 columnas, navegación horizontal |
| Tablet | 768px - 992px | Grid 2 columnas, ajustes de tipografía |
| Mobile | 480px - 768px | Una columna, navegación vertical |
| Mobile chico | < 480px | Tipografía más chica, padding reducido |

---

## ✅ Cumplimiento de requisitos del proyecto final

1. **Estructura básica de HTML**
   - ✅ Estructura semántica (header, nav, main, section, footer)
   - ✅ README.md explicando el proyecto
2. **Formulario de contacto**
   - ✅ Campos de nombre, correo y mensaje con envío por Formspree
3. **Estilos básicos con CSS**
   - ✅ Archivo styles.css externo con estilos en header, footer y navegación
   - ✅ Google Fonts (Bebas Neue + Open Sans)
   - ✅ Background con imagen en la sección hero
4. **Diseño responsivo con Flexbox y Grid**
   - ✅ Productos con Flexbox · Reseñas con Grid · Contacto con Media Queries
5. **Contenido multimedia y navegación**
   - ✅ Video integrado y lista de navegación desordenada con enlaces internos
6. **Subida del proyecto**
   - ⏳ Pendiente: pegar URL de GitHub Pages y URL del repositorio en la sección Demo
7. **JavaScript**
   - ✅ script.js enlazado en el HTML
   - ✅ Validación de formulario (campos requeridos + formato de correo)
   - ✅ Consumo de API REST con fetch (Fake Store API)
   - ✅ Productos renderizados como cards con imagen, título y precio
8. **Carrito de compras dinámico**
   - ✅ Agregar productos desde las cards
   - ✅ Persistencia en localStorage
   - ✅ Contador dinámico en la navegación, actualizado en tiempo real
9. **Edición y visualización del carrito**
   - ✅ Lista de items con cantidad, subtotal y total
   - ✅ Editar cantidades (+/-), eliminar productos, vaciar carrito y simular compra
10. **SEO y accesibilidad**
    - ✅ Metaetiquetas description, keywords, author y Open Graph
    - ✅ alt en todas las imágenes y aria-label en los controles del carrito

---

## 👤 Autor

**Maximiliano A. Sena**
Curso de Frontend - TalentoTech 2026

---

## 📄 Licencia

Proyecto educativo. Las imágenes pertenecen al negocio "Date el Gusto".
