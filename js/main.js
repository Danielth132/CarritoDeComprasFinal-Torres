
//seleccion
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");


//funciones
function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;

        contenedorProductos.append(div);
    })

    actualizarBotonesAgregar();
}

async function actualizarBotonesAgregar() {
    const res = await fetch("./js/productos.JSON")
    const productos = await res.json()

    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", (e) =>{
            const idBoton = e.currentTarget.id;
            const productoAgregado = productos.find(producto => producto.id === idBoton);
            
            if(productosEnCarrito.some(producto => producto.id === idBoton)) {
                const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
                productosEnCarrito[index].cantidad++;

                const nom = productosEnCarrito[index].titulo
                tarjetas(nom)
            } else {
                productoAgregado.cantidad = 1;
                productosEnCarrito.push(productoAgregado);

                tarjetas(productoAgregado.titulo)
            }

            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        });
    });
}

function tarjetas(obj) {
    Toastify({
        text: `Se agrego ${obj}  al carrito`,
        duration: 3000,
        destination: "./carrito.html",
        newWindow: false,
        close: false,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #1e69ba, #523dc9)",
        },
        onClick: function(){} // Callback after click
        }).showToast();
}

function categorias(productos){
    botonesCategorias.forEach(boton => {
        boton.addEventListener("click", (e) => {

            if (e.currentTarget.id != "todos") {
                const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);

                tituloPrincipal.innerText = productoCategoria.categoria.nombre;

                const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
                cargarProductos(productosBoton);
            } else {
                tituloPrincipal.innerText = "Todos los productos";
                cargarProductos(productos);
            }

        })
    });
}

function cargarCarrito() {

    let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

    if (productosEnCarritoLS) {
        productosEnCarrito = JSON.parse(productosEnCarritoLS);
    } else {
        productosEnCarrito = [];
    }
}

//ejecucion
const fetchData = async () => {
    try {
        const res = await fetch("./js/productos.JSON")
        const productos = await res.json()

        cargarProductos(productos)
        categorias(productos)
        let productosEnCarrito
        cargarCarrito()

    } catch (error) {
        console.log(error)
    }
}
fetchData()


