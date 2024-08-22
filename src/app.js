import express from 'express';
import rutasProducts from './routes/products.js';
import rutasCarts from './routes/carts.js';


const app = express();

app.use(express.json());
app.use('/api/products', rutasProducts);
app.use('/api/carts', rutasCarts);

const PUERTO = 8080;
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en el puerto ${PUERTO}`);
});