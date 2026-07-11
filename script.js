// Consumo de la API, renderizado dinámico de productos, carrito de
// compras con persistencia en localStorage y validación del formulario.

const API_URL = 'https://dummyjson.com/products/category/groceries';

// Clave con la que guardamos el carrito en localStorage
const CLAVE_CARRITO = 'carritoDateElGusto';

// Catálogo real del negocio: ids negativos para no chocar con los ids de la API
const productosEstaticos = [
    { id: -1, title: 'Pollo al Spiedo Clásico', price: 25000, image: 'img/pollo-clasico.jpg' },
    { id: -2, title: 'Pollo al Spiedo Dorado', price: 30000, image: 'img/pollo-dorado.jpg' },
    { id: -3, title: 'Pollo al Limón', price: 31000, image: 'img/pollo-limon.jpg' },
    { id: -4, title: 'Papas Fritas', price: 5000, image: 'img/papas-fritas.jpg' }
];

// Referencias a elementos del DOM que usamos en varias funciones
const contenedorMenu = document.getElementById('contenedor-menu');
const contenedorProductos = document.getElementById('contenedor-productos');
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total-carrito');
const contadorCarrito = document.getElementById('contador-carrito');
const mensajeUsuario = document.getElementById('mensaje-usuario');

// Formato de precios en pesos argentinos, sin decimales (ej: $25.000)
function formatearPrecio(precio) {
    return '$' + precio.toLocaleString('es-AR', { maximumFractionDigits: 0 });
}

// Arranca con el menú propio disponible de inmediato; el fetch a la API
// agrega el catálogo de demostración cuando llega
let productos = [...productosEstaticos];
let carrito = [];     // items agregados: { id, title, price, image, cantidad }


// Consumo de la API con Fetch

function obtenerProductos() {
    fetch(API_URL)
        .then(function (respuesta) {
            if (!respuesta.ok) {
                throw new Error('La API respondió con error ' + respuesta.status);
            }
            return respuesta.json();
        })
        .then(function (datos) {
            // DummyJSON devuelve { products: [...] }, no un array directo.
            // Nos quedamos solo con bebidas y postres (coherentes con el rubro)
            // y excluimos comida de mascotas por las dudas
            const filtrados = datos.products
                .filter(function (p) {
                    return /juice|water|soft.drink/i.test(p.title);
                })
                .slice(0, 3)
                .map(function (p) {
                    return {
                        // id + 1000 evita choque con los ids del menú propio;
                        // el precio USD se convierte a un valor tipo ARS
                        id: p.id + 1000,
                        title: p.title,
                        price: Math.round(p.price * 1500),
                        image: p.thumbnail,
                        category: p.category
                    };
                });
            // Se suman al menú propio (no lo reemplazan) para que el carrito
            // siga encontrando por id los productos de ambas fuentes
            productos = [...productosEstaticos, ...filtrados];
            renderizarProductos(filtrados);
        })
        .catch(function (error) {
            // Si la API falla, avisamos al usuario en vez de dejar la sección vacía
            contenedorProductos.innerHTML =
                '<p class="mensaje-carga">⚠️ No pudimos cargar los productos. Probá recargar la página.</p>';
            console.error('Error al consultar la API:', error);
        });
}


// Renderizado dinámico de las cards de producto

function renderizarProductos(lista) {
    // innerHTML='' también borra el mensaje "Cargando productos..." del HTML inicial
    contenedorProductos.innerHTML = '';

    lista.forEach(function (producto) {
        const card = document.createElement('article');
        // shadow-sm es una utilidad de Bootstrap que agrega sombra suave a la card
        card.className = 'card-producto shadow-sm';

        card.innerHTML = `
            <img src="${producto.image}" alt="Imagen de ${producto.title}">
            <h3>${producto.title}</h3>
            <span class="badge-categoria">${producto.category.toUpperCase()}</span>
            <p class="precio">${formatearPrecio(producto.price)}</p>
            <button type="button" class="boton boton-agregar" data-id="${producto.id}">
                Agregar al carrito
            </button>
        `;

        contenedorProductos.appendChild(card);
    });
}

// Delegación de eventos: un listener por contenedor atiende los clicks
// de todos sus botones "Agregar" (menú propio y catálogo de la API)
function manejarClickAgregar(evento) {
    if (evento.target.classList.contains('boton-agregar')) {
        const id = Number(evento.target.dataset.id);
        agregarAlCarrito(id);
    }
}
contenedorMenu.addEventListener('click', manejarClickAgregar);
contenedorProductos.addEventListener('click', manejarClickAgregar);


// Carrito: altas, bajas, cantidades y total

function agregarAlCarrito(id) {
    const itemExistente = carrito.find(function (item) {
        return item.id === id;
    });

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
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


// Renderizado del carrito y el contador

function renderizarCarrito() {
    listaCarrito.innerHTML = '';

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío. ¡Agregá algún producto!</p>';
    }

    carrito.forEach(function (item) {
        const fila = document.createElement('div');
        fila.className = 'item-carrito';

        const subtotal = formatearPrecio(item.price * item.cantidad);

        fila.innerHTML = `
            <img src="${item.image}" alt="Imagen de ${item.title}">
            <p class="item-nombre">${item.title}</p>
            <div class="controles-cantidad">
                <button type="button" class="boton-cantidad" data-accion="restar" data-id="${item.id}" aria-label="Restar una unidad">-</button>
                <span>${item.cantidad}</span>
                <button type="button" class="boton-cantidad" data-accion="sumar" data-id="${item.id}" aria-label="Sumar una unidad">+</button>
            </div>
            <p class="item-subtotal">${subtotal}</p>
            <button type="button" class="boton-eliminar" data-accion="eliminar" data-id="${item.id}" aria-label="Eliminar producto">✕</button>
        `;

        listaCarrito.appendChild(fila);
    });

    totalCarrito.textContent = formatearPrecio(calcularTotal());

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

document.getElementById('boton-vaciar').addEventListener('click', vaciarCarrito);

document.getElementById('boton-comprar').addEventListener('click', function () {
    if (carrito.length === 0) {
        mostrarMensaje('⚠️ El carrito está vacío, agregá productos antes de comprar');
        return;
    }
    const total = formatearPrecio(calcularTotal());
    vaciarCarrito();
    mostrarMensaje('🎉 ¡Gracias por tu compra! Total: ' + total);
});


// Persistencia en localStorage

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


// Mensajes al usuario

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


// Validación del formulario de contacto

const formulario = document.getElementById('formulario-contacto');

formulario.addEventListener('submit', function (evento) {
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const mensaje = document.getElementById('mensaje');

    let formularioValido = true;

    document.getElementById('error-nombre').textContent = '';
    document.getElementById('error-email').textContent = '';
    document.getElementById('error-mensaje').textContent = '';

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


// Inicialización: recuperar carrito y cargar productos
cargarCarrito();
renderizarCarrito();
obtenerProductos();
