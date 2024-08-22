import {Router} from 'express';
import ProductManager from '../managers/ProductManager.js';


const router = Router();
const productManager= new ProductManager();


router.get('/', (req, res) => {
    const products = productManager.obtenerProductos();
    res.json(products);
});


router.get('/:pid', (req, res) => {
    const product = productManager.obtenerProductoPorId(parseInt(req.params.pid));
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
});


router.post('/', (req, res) => {
    const { title, description, price, code, stock, category } = req.body;
    const nuevoProducto = productManager.agregarProducto(title, description, price, code, stock, category);
    res.status(201).json(nuevoProducto);
});


router.put('/:pid', (req, res) => {
    const productoActualizado = productManager.actualizarProducto(parseInt(req.params.pid), req.body);
    if (!productoActualizado) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(productoActualizado);
});


router.delete('/:pid', (req, res) => {
    const productoEliminado = productManager.eliminarProducto(parseInt(req.params.pid));
    if (!productoEliminado) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(204).send();
});

export default router;