document.addEventListener('DOMContentLoaded', () => {
    mostrarProductos()
    mostrarCarrito()
    document.getElementById('vaciar-carrito').addEventListener('click', async () => await vaciarCarrito())
    document.getElementById('comprar').addEventListener('click', async () => await comprar())
});

const productosDOM = document.getElementById('productos')
const carritoDOM = document.getElementById('carrito-items')
const totalCompraDOM = document.getElementById('total-compra')
const carrito = JSON.parse(localStorage.getItem('carrito')) || []

const productos = [
    { id: 1, nombre: 'Fideos Lucchetti', precio: 3500, imagen: 'img/fideos lucchetti.png' }, 
    { id: 2, nombre: 'Harina', precio: 2500, imagen: 'img/Harina.png' },
    { id: 3, nombre: 'Yerba Mate', precio: 4300, imagen: 'img/Yerba Mate.png' },
    { id: 4, nombre: 'Azúcar Marolio', precio: 3200, imagen: 'img/Azúcar marolio.png' },
    { id: 5, nombre: 'Aceite Natura', precio: 5450, imagen: 'img/Aceite Natura.png' },
    { id: 6, nombre: 'Sal', precio: 3000, imagen: 'img/Sal.png' },
    { id: 7, nombre: 'Leche Iloay', precio: 3200, imagen: 'img/Leche iloay.png' },
    { id: 8, nombre: 'Café La Virginia', precio: 3500, imagen: 'img/Café la virginia.png' }
];

const mostrarProductos = () => {
    productos.forEach(producto => {
        const productoDOM = crearCardProducto(producto);
        productosDOM.appendChild(productoDOM);
    });
};

const crearCardProducto = (producto) => {
    const contenedor = document.createElement('div')
    const nombre = document.createElement('h3')
    const imagen = document.createElement('img')
    const precio = document.createElement('p')
    const boton = document.createElement('button')

    contenedor.classList.add('contenedor')
    imagen.classList.add('imagen')
    boton.classList.add('boton')

    nombre.innerText = producto.nombre;
    precio.innerText = `$${producto.precio}`
    imagen.src = producto.imagen;
    boton.innerText = 'Agregar al Carrito'

    boton.addEventListener('click', () => agregarAlCarrito(producto))

    contenedor.appendChild(imagen)
    contenedor.appendChild(nombre)
    contenedor.appendChild(precio)
    contenedor.appendChild(boton)

    return contenedor;
};

const agregarAlCarrito = async (producto) => {
    try {
        const encontrado = carrito.find(item => item.id === producto.id)
        if (encontrado) {
            encontrado.cantidad += 1;
        } else {
            carrito.push({ ...producto, cantidad: 1 })
        }
        await new Promise(resolve => setTimeout(resolve, 100))
        localStorage.setItem('carrito', JSON.stringify(carrito))
        mostrarCarrito();
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        await Swal.fire('Error', 'No se pudo agregar el producto al carrito.', 'error');
    }
};

const mostrarCarrito = () => {
    carritoDOM.innerHTML = '';

    if (carrito.length === 0) {
        carritoDOM.innerHTML = '<p>El carrito está vacío.</p>';
        totalCompraDOM.innerText = 'Total: $0';
        return;
    }

    carrito.forEach(item => {
        const contenedor = document.createElement('div')
        const nombre = document.createElement('h3')
        const precio = document.createElement('p')
        const cantidad = document.createElement('p')
        const botonEliminar = document.createElement('button')

        contenedor.classList.add('contenedor')
        botonEliminar.classList.add('boton')
        botonEliminar.style.backgroundColor = '#ff5722'
        botonEliminar.innerText = 'Eliminar'

        nombre.innerText = item.nombre
        precio.innerText = `$${item.precio}`
        cantidad.innerText = `Cantidad: ${item.cantidad}`

        botonEliminar.addEventListener('click', () => eliminarDelCarrito(item.id))

        contenedor.appendChild(nombre)
        contenedor.appendChild(precio)
        contenedor.appendChild(cantidad)
        contenedor.appendChild(botonEliminar)

        carritoDOM.appendChild(contenedor)
    });

    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
    totalCompraDOM.innerText = `Total: $${total}`
};

const eliminarDelCarrito = async (id) => {
    try {
        const index = carrito.findIndex(item => item.id === id);
        if (index !== -1) {
            carrito.splice(index, 1);
        }
        await new Promise(resolve => setTimeout(resolve, 100)); 
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        await Swal.fire('Error', 'No se pudo eliminar el producto del carrito.', 'error');
    }
};

const vaciarCarrito = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 100));
        localStorage.removeItem('carrito');
        carrito.length = 0;
        mostrarCarrito();
        await Swal.fire('Carrito vacío', 'El carrito ha sido vaciado.', 'success');
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        await Swal.fire('Error', 'No se pudo vaciar el carrito.', 'error');
    }
};

const comprar = async () => {
    try {
        if (carrito.length === 0) {
            await Swal.fire('Advertencia', 'No hay productos en el carrito para comprar.', 'warning')
            return;
        }

        const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
        const detallesCompra = carrito.map(item => `${item.nombre} - $${item.precio} x ${item.cantidad}`).join('<br>')

        const result = await Swal.fire({
            title: 'Resumen de la Compra',
            html: `<div>${detallesCompra}<br><strong>Total: $${total}</strong></div>`,
            icon: 'info',
            confirmButtonText: 'Aceptar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            localStorage.removeItem('carrito')
            carrito.length = 0;
            mostrarCarrito()
            await Swal.fire('Compra realizada', 'Gracias por tu compra.', 'success')
        } else {
            await Swal.fire('Compra cancelada', 'La compra ha sido cancelada.', 'info')
        }
    } catch (error) {
        console.error('Error al realizar la compra:', error)
        await Swal.fire('Error', 'No se pudo completar la compra.', 'error')
    }
};