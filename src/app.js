import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import exphbs from 'express-handlebars';
import productsRouter from '../src/routes/products.router.js';
import cartsRouter from '../src/routes/carts.router.js';
import viewsRouter from '../src/routes/views.router.js';
import methodOverride from 'method-override';
import { Server } from 'socket.io';


const io =new Server;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));
app.use(methodOverride('_method'));

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use('/home', productsRouter)
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter)


app.use(methodOverride('_method'));

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('validarProducto', async (code) => {
        try {
            const existe = await productsManager.getProductBy({ code });
            socket.emit('productoExiste', !!existe);
        } catch (error) {
            console.error('Error al validar el producto:', error);
            socket.emit('productoExiste', false);
        }
    });

    socket.on('crearProducto', async (producto) => {
        try {
            const nuevoProducto = await productsManager.addproduct(producto);            
            io.emit('agregarProducto', nuevoProducto);
        } catch (error) {
            console.log("Error ", error)
            socket.emit('error', 'Error al agregar producto');
        }
    });

    socket.on('modificarProducto', async (producto) => {
        try {
            const { _id, ...dataToUpdate } = producto;
            const aModificarProducto = await productsManager.updateproduct(_id, dataToUpdate);
            io.emit('productoModificado', producto);
        } catch (error) {
            console.log("Error ", error)
            socket.emit('error', 'Error al modificar producto');
        }
    });

    socket.on('eliminarProducto', async (idProducto) => {
        try {
            await productsManager.deleteproduct(idProducto);
            io.emit('eliminarProducto', idProducto);
        } catch (error) {
            socket.emit('error', 'Error al eliminar producto');
        }
    });


    socket.on('agregarProductoAlCart', async ({ cart, idProducto }) => {
        try {
            await CartsManager.addProductToCart(cart, idProducto);
            socket.emit('productoAgregado', { success: true, message: 'Producto agregado al carrito' });
            io.emit('CarritoActualizado', cart);
        } catch (error) {
            socket.emit('productoAgregado', { success: false, message: error.message });
        }
    });

    socket.on('realTimeProductsRequest', async (data) => {
        try {
            const { skip = 0, limit = 10 } = data;
            const productosPaginados = await productsManager.getproductsPaginate(skip, limit);
            socket.emit('realTimeProductsResponse', productosPaginados);
        } catch (error) {
            socket.emit('error', 'Error al paginar Producto');
        }
    });

    socket.on('productsPaginatedRequest', async (data) => {
        try {
            const { skip = 0, limit = 10 } = data;
            const productosPaginados = await productsManager.getproductsPaginate(skip, limit);
            socket.emit('productsPaginatedResponse', productosPaginados);
        } catch (error) {
            socket.emit('error', 'Error al paginar Producto');
        }
    });
});




mongoose.connect('mongodb+srv://proyecto1:proyect@cluster0.dc0ws.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err.message);
    });

export {io};