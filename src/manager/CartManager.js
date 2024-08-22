import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ProductManager from './ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CartManager {
    constructor() {
        this.rutaArchivo = path.join(__dirname, '../data/carts.json');
        this.carts = [];
        this.productManager = new ProductManager();
        this.cargarCarritos();
    }

    cargarCarritos() {
        if (fs.existsSync(this.rutaArchivo)) {
            const data = fs.readFileSync(this.rutaArchivo, 'utf-8');
            this.carts = JSON.parse(data);
        } else {
            this.carts = [];
        }
    }

    guardarCarritos() {
        fs.writeFileSync(this.rutaArchivo, JSON.stringify(this.carts, null, 5));
    }

    crearCarrito() {
        const nuevoCarrito = {
            id: this.generarId(),
            products: []
        };
        this.carts.push(nuevoCarrito);
        this.guardarCarritos();
        return nuevoCarrito;
    }

    obtenerCarritoPorId(id) {
        return this.carts.find(carrito => carrito.id === id);
    }

    agregarProductoAlCarrito(cid, pid) {
        const cart = this.obtenerCarritoPorId(cid);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const productoExistente = cart.products.find(p => p.product === pid);
        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            cart.products.push({ product: pid, cantidad: 1 });
        }

        this.guardarCarritos();
    }

    generarId() {
        let id = 1;
        if (this.carts.length > 0) {
            id = this.carts[this.carts.length - 1].id + 1;
        }
        return id;
    }
}

export default CartManager;