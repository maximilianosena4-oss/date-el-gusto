# Date el Gusto — Sitio web con menú dinámico y carrito de compras

Sitio web para una rotisería de pollos al spiedo (Quilmes, Buenos Aires), con
catálogo de productos, carrito de compras funcional y contacto directo por
WhatsApp.

**Demo:** https://maximilianosena4-oss.github.io/date-el-gusto/

## Qué hace

- Menú del negocio (productos propios) más una sección de bebidas cargada
  dinámicamente desde una API REST (fetch + render de cards en el DOM).
- Carrito de compras con alta/baja de productos, edición de cantidades y
  total actualizado en tiempo real, con **persistencia en localStorage** (el
  pedido se mantiene aunque se cierre o recargue la página).
- Formulario de contacto validado en JavaScript, con envío por Formspree y
  contacto directo por WhatsApp.
- Diseño responsive (Flexbox + Grid + media queries) y metaetiquetas SEO/Open
  Graph.

## Stack

HTML5 semántico + CSS3 (Bootstrap 5 como utilitario) + JavaScript vanilla
(Fetch API, manipulación de DOM, localStorage). Sin build ni dependencias de
servidor — se sirve como sitio estático (GitHub Pages).

## Cómo verlo localmente

Abrir `index.html` directamente en el navegador, o servirlo con la extensión
Live Server de VS Code.

## Estado del proyecto

Publicado y en uso (GitHub Pages). Sitio de un solo negocio, sin panel de
administración: los productos del menú están en el HTML y la sección de
bebidas consume un catálogo de demostración (DummyJSON) a modo de ejemplo de
integración con API.
