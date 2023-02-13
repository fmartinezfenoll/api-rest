'use strict'
const port = process.env.PORT || 3000;

const express = require('express');
const logger = require('morgan');

const app = express();

//middleware
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//declarar el API

app.get('/api/producto', (req, res) => {
    res.status(200);
    res.send({ productos: []});
});

app.get('/api/producto/:productID', (req, res) => {
    const productID = req.params.productID;
    
    res.status(200);
    res.send({ producto: productID });
});

app.post('/api/producto', (req, res) => {
    const queProducto = req.body;
    console.log(queProducto);

    res.status(200);
    res.send({
        mensaje: 'Producto creado',
        producto: queProducto
    });
});

app.put('/api/producto/:productID', (req, res) => {
        const queProducto = req.body;
        const productID = req.params.productID;
        res.status(200);
        res.send({
        mensaje: `Producto ${productID} modificado`,
        producto: queProducto
    });
});
app.delete('/api/producto/:productID', (req, res) => {
    const productID = req.params.productID;
    res.status(200);
    res.send( { mensaje: `Producto ${productID} eliminado` } );
});

app.listen(port, () => {
    console.log(`API REST ejecutándose en http://localhost:${port}/api/producto`);
});