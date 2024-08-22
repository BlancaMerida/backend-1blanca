import express from 'express';
import CartManager from '../manager/CartManager.js';

const router = express.Router();
const cartManager = new CartManager();


router.post('/', (req, res) => {
    const nuevoCarrito = cartManager.crearCarrito();
    res.status(201).json(nuevoCarrito);
});


router.get('/:cid', (req, res) => {
    const cart = cartManager.obtenerCarritoPorId(parseInt(req.params.cid));
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart.products);
});


router.post('/:cid/product/:pid', (req, res) => {
    const cart = cartManager.agregarProductoACarrito(parseInt(req.params.cid), parseInt(req.params.pid));
    if (!cart) {
        return res.status(404).json({ error: ' producto no encontrado' });
    }
    res.status(201).json(cart);
});

export default router;