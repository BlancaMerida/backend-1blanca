import express from 'express';


const app = express();

app.use(express.json());
app.use('/api/products', rutasProducts);
app.use('/api/carts', rutasCarts);

const PUERTO = 8080;
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en el puerto ${PUERTO}`);
});