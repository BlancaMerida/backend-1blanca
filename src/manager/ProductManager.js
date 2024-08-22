import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductManager {
    constructor() {
        this.products = [];
        this.cargarProductos();
    }

    cargarProductos() {
        const rutaArchivo = path.join(__dirname, '../data/products.json');
        if (fs.existsSync(rutaArchivo)) {
            const data = fs.readFileSync(rutaArchivo, 'utf-8');
            this.products = JSON.parse(data);
        } else {
            this.products = [];
            this.inicializarProductos();  
        }
    }

    guardarProductos() {
        const rutaArchivo = path.join(__dirname, '../data/products.js');
        fs.writeFileSync(rutaArchivo, JSON.stringify(this.products, null, 5));
    }

    inicializarProductos() {
        this.addProduct("Kit de Cogantes", "Cadena regulable de 45 a 50cm más dije de estrella con cubic", 15000, 14,"de01", "cadenas");
        this.addProduct("Collar Men","Cadena de plata 925 40cm + dije de piedra natural con diamante",3500, 10,"de02","cadenas");
        this.addProduct( "Kit de yojas","Set completo aretes/pulsera/collar acero blanco", 1840, 5,"de03","aros");
        this.addProduct("Anillo Flower","Plata Rose con micropave",1300, 8,"de04","anillos");
        this.addProduct( "Aretes Diana","Aros con cierre huggies de acero dorado, micropave y cubic", 5200, 9,"de05","aros");
        this.addProduct("Anillo de anne","Anillo de acero 925 y cubic",2500, 11, "de06","anillos");
        this.addProduct( "Collas Kids","Cadena con unicornio y arcoiris - largo 50cm ",2500, 11,"de07","cadenas",);
        this.addProduct( "Collares Surtidas","Cadena con surtidas de acero dorado - largo 50cm ",3800, 15,"de08","cadenas");
        this.addProduct( "Dijes Kids","Dijes kids de acero dorado",4300, 12,"de09","cadenas");
        this.addProduct( "Kit de Pulseras","Kit de pulseras especial para regalar acero blanco",6000, 11,"de10","anillos");
        this.addProduct( "Pulsera de hombre","Pulsera de plata 925",4900, 8,"de11","anillos");

        this.guardarProductos();
    }

    addProduct(title, description, price, stock, code, category) {
        if (!title || !description || !price || !stock || !code || !category) {
            console.log('Todos los campos son obligatorios');
            return;
        }

        let productoExistente = this.products.find(producto => producto.code === code);
        if (productoExistente) {
            console.log(`El producto con el codigo ${code} ya existe.`);
            return;
        }

        let id = 1;
        if (this.products.length > 0) {
            id = this.products[this.products.length - 1].id + 1;
        }

        let nuevoProducto = {
            id,
            title,
            description,
            price,
            code,
            stock,
            category,
        };

        this.products.push(nuevoProducto);
        this.guardarProductos();
        return nuevoProducto;
    }

    obtenerProductos() {
        return this.products;
    }

    obtenerProductoPorId(id) {
        let product = this.products.find(producto => producto.id === id);
        if (!product) {
            return null;
        }
        return product;
    }

    actualizarProducto(id, actualizaciones) {
        const product = this.obtenerProductoPorId(id);
        if (!product) return null;
        Object.assign(product, actualizaciones);
        this.guardarProductos();
        return product;
    }

    eliminarProducto(id) {
        const indiceProducto = this.products.findIndex(producto => producto.id === id);
        if (indiceProducto === -1) return null;
        this.products.splice(indiceProducto, 1);
        this.guardarProductos();
        return true;
    }
}

export default ProductManager;