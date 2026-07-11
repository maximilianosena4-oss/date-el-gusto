/* ============================================================
   DATE EL GUSTO - script.js
   Proyecto Final: Fetch API + DOM + Carrito con localStorage
   ============================================================ */

// URL de la API REST vista en clase (Clases 12-14)
const API_URL = 'https://fakestoreapi.com/products';

// Clave con la que guardamos el carrito en localStorage
const CLAVE_CARRITO = 'carritoDateElGusto';

// Referencias a elementos del DOM que usamos en varias funciones
const contenedorProductos = document.getElementById('contenedor-productos');
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total-carrito');
const contadorCarrito = document.getElementById('contador-carrito');
const mensajeUsuario = document.getElementById('mensaje-usuario');

// Estado de la aplicación
let productos = [];   // productos traídos de la API
let carrito = [];     // items agregados: { id, title, price, image, cantidad }


/* ============================================================
   1. CONSUMO DE LA API REST CON FETCH (punto 7 de la consigna)
   ============================================================ */

function obtenerProductos() {
    // fetch devuelve una promesa: primero convertimos la respuesta a JSON
    fetch(API_URL)
        .then(function (respuesta) {
            if (!respuesta.ok) {
                throw new Error('La API respondió con error ' + respuesta.status);
            }
            return respuesta.json();
        })
        .then(function (datos) {
            // Filtramos categorías visualmente neutras: la API es de demostración,
            // no vende pollos al spiedo, así que evitamos mostrar ropa mezclada
            productos = datos.filter(function (p) {
                return p.category === 'electronics' || p.category === 'jewelery';
            });
            renderizarProductos(productos);
        })
        .catch(function (error) {
            // Si la API falla, avisamos al usuario en vez de dejar la sección vacía
            contenedorProductos.innerHTML =
                '<p class="mensaje-carga">⚠️ No pudimos cargar los productos. Probá recargar la página.</p>';
            console.error('Error al consultar la API:', error);
        });
}


/* ============================================================
   2. RENDERIZADO DINÁMICO DE CARDS (manipulación del DOM)
   ============================================================ */

function renderizarProductos(lista) {
    // Vaciamos el contenedor (saca el mensaje "Cargando productos...")
    contenedorProductos.innerHTML = '';

    lista.forEach(function (producto) {
        // Creamos la card con la misma estructura que tenía el HTML estático
        // Bootstrap: shadow-sm agrega sombra suave como utilidad visual complementaria
        const card = document.createElement('article');
        card.className = 'card-producto shadow-sm';

        card.innerHTML = `
            <img src="${producto.image}" alt="Imagen de ${producto.title}">
            <h3>${producto.title}</h3>
            <span class="badge-categoria">${producto.category.toUpperCase()}</span>
            <p class="precio">$${producto.price.toFixed(2)}</p>
            <button type="button" class="boton boton-agregar" data-id="${producto.id}">
                Agregar al carrito
            </button>
        `;

        contenedorProductos.appendChild(card);
    });
}

// Un solo listener en el contenedor atiende los clicks de todos los botones "Agregar"
contenedorProductos.addEventListener('click', function (evento) {
    if (evento.target.classList.contains('boton-agregar')) {
        const id = Number(evento.target.dataset.id);
        agregarAlCarrito(id);
    }
});


/* ============================================================
   3. CARRITO: ALTAS, BAJAS, CANTIDADES Y TOTAL (puntos 8 y 9)
   ============================================================ */

function agregarAlCarrito(id) {
    // Buscamos si el producto ya está en el carrito
    const itemExistente = carrito.find(function (item) {
        return item.id === id;
    });

    if (itemExistente) {
        // Si ya estaba, solo sumamos cantidad
        itemExistente.cantidad++;
    } else {
        // Si no estaba, lo buscamos en los productos de la API y lo agregamos
        const producto = productos.find(function (p) {
            return p.id === id;
        });
        carrito.push({
            id: producto.id,
            title: producto.title,
            price: producto.price,
            image: producto.image,
            cantidad: 1
        });
    }

    guardarCarrito();
    renderizarCarrito();
    mostrarMensaje('✅ Producto agregado al carrito');
}

function cambiarCantidad(id, cambio) {
    const item = carrito.find(function (i) {
        return i.id === id;
    });
    if (!item) return;

    item.cantidad += cambio;

    // Si la cantidad llega a 0, el producto se elimina del carrito
    if (item.cantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }

    guardarCarrito();
    renderizarCarrito();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(function (item) {
        return item.id !== id;
    });
    guardarCarrito();
    renderizarCarrito();
    mostrarMensaje('🗑️ Producto eliminado del carrito');
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    renderizarCarrito();
    mostrarMensaje('El carrito quedó vacío');
}

function calcularTotal() {
    return carrito.reduce(function (total, item) {
        return total + item.price * item.cantidad;
    }, 0);
}


/* ============================================================
   4. RENDERIZADO DEL CARRITO Y CONTADOR EN TIEMPO REAL
   ============================================================ */

function renderizarCarrito() {
    listaCarrito.innerHTML = '';

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío. ¡Agregá algún producto!</p>';
    }

    carrito.forEach(function (item) {
        const fila = document.createElement('div');
        fila.className = 'item-carrito';

        const subtotal = (item.price * item.cantidad).toFixed(2);

        fila.innerHTML = `
            <img src="${item.image}" alt="Imagen de ${item.title}">
            <p class="item-nombre">${item.title}</p>
            <div class="controles-cantidad">
                <button type="button" class="boton-cantidad" data-accion="restar" data-id="${item.id}" aria-label="Restar una unidad">-</button>
                <span>${item.cantidad}</span>
                <button type="button" class="boton-cantidad" data-accion="sumar" data-id="${item.id}" aria-label="Sumar una unidad">+</button>
            </div>
            <p class="item-subtotal">$${subtotal}</p>
            <button type="button" class="boton-eliminar" data-accion="eliminar" data-id="${item.id}" aria-label="Eliminar producto">✕</button>
        `;

        listaCarrito.appendChild(fila);
    });

    // Total dinámico: se recalcula en cada cambio del carrito
    totalCarrito.textContent = '$' + calcularTotal().toFixed(2);

    // Contador del nav: suma las cantidades de todos los items
    const totalUnidades = carrito.reduce(function (total, item) {
        return total + item.cantidad;
    }, 0);
    contadorCarrito.textContent = totalUnidades;
}

// Delegación de eventos: un listener atiende sumar, restar y eliminar
listaCarrito.addEventListener('click', function (evento) {
    const accion = evento.target.dataset.accion;
    if (!accion) return;

    const id = Number(evento.target.dataset.id);

    if (accion === 'sumar') cambiarCantidad(id, 1);
    if (accion === 'restar') cambiarCantidad(id, -1);
    if (accion === 'eliminar') eliminarDelCarrito(id);
});

// Botones de acciones generales del carrito
document.getElementById('boton-vaciar').addEventListener('click', vaciarCarrito);

document.getElementById('boton-comprar').addEventListener('click', function () {
    if (carrito.length === 0) {
        mostrarMensaje('⚠️ El carrito está vacío, agregá productos antes de comprar');
        return;
    }
    const total = calcularTotal().toFixed(2);
    vaciarCarrito();
    mostrarMensaje('🎉 ¡Gracias por tu compra! Total: $' + total);
});


/* ============================================================
   5. PERSISTENCIA CON localStorage (punto 8 de la consigna)
   ============================================================ */

function guardarCarrito() {
    // localStorage solo guarda texto: convertimos el array a JSON
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function cargarCarrito() {
    const guardado = localStorage.getItem(CLAVE_CARRITO);
    if (guardado) {
        try {
            carrito = JSON.parse(guardado);
        } catch (error) {
            // Si los datos están corruptos, empezamos con carrito vacío
            carrito = [];
            localStorage.removeItem(CLAVE_CARRITO);
        }
    }
}


/* ============================================================
   6. MENSAJES AL USUARIO
   ============================================================ */

let temporizadorMensaje;

function mostrarMensaje(texto) {
    mensajeUsuario.textContent = texto;
    mensajeUsuario.classList.add('visible');

    // Reiniciamos el temporizador para que mensajes seguidos no se pisen
    clearTimeout(temporizadorMensaje);
    temporizadorMensaje = setTimeout(function () {
        mensajeUsuario.classList.remove('visible');
    }, 2500);
}


/* ============================================================
   7. VALIDACIÓN DEL FORMULARIO DE CONTACTO (punto 7)
   ============================================================ */

const formulario = document.getElementById('formulario-contacto');

formulario.addEventListener('submit', function (evento) {
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const mensaje = document.getElementById('mensaje');

    let formularioValido = true;

    // Limpiamos errores de un intento anterior
    document.getElementById('error-nombre').textContent = '';
    document.getElementById('error-email').textContent = '';
    document.getElementById('error-mensaje').textContent = '';

    // Campo requerido: nombre
    if (nombre.value.trim() === '') {
        document.getElementById('error-nombre').textContent = 'Por favor, ingresá tu nombre.';
        formularioValido = false;
    }

    // Formato de correo: texto@texto.texto (sin espacios)
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoEmail.test(email.value.trim())) {
        document.getElementById('error-email').textContent = 'Ingresá un correo válido (ej: nombre@mail.com).';
        formularioValido = false;
    }

    // Campo requerido: mensaje
    if (mensaje.value.trim() === '') {
        document.getElementById('error-mensaje').textContent = 'Contanos qué necesitás.';
        formularioValido = false;
    }

    if (!formularioValido) {
        // Si hay errores, frenamos el envío a Formspree
        evento.preventDefault();
        mostrarMensaje('⚠️ Revisá los campos marcados en el formulario');
    }
});


/* ============================================================
   8. INICIALIZACIÓN
   ============================================================ */

// Al cargar la página: recuperamos el carrito guardado y pedimos los productos
cargarCarrito();
renderizarCarrito();
obtenerProductos();
