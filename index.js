'use strict';
const port = process.env.PORT || 3000;

const express = require('express');
const logger = require('morgan');
const mongojs = require('mongojs');

const app = express();

var db = mongojs("SD"); // Enlazamos con la DB "SD"
var id = mongojs.ObjectID;
// Función para convertir un id textual en un objectID

// middleware
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// añadimos un trigger previo a las rutas para dar soporte a múltiples colecciones
app.param("coleccion", (req, res, next, coleccion) => {
    console.log('param /api/:coleccion');
    console.log('colección: ', coleccion);
    req.collection = db.collection(coleccion);
    return next();
});
// Routes
app.get('/api', (req, res, next) => {
    console.log('GET /api');
    console.log(req.params);
    console.log(req.collection);
    db.getCollectionNames((err, colecciones) => {
        if (err)
            return next(err);
        res.json(colecciones);
    });
});

app.get('/api/:coleccion', (req, res, next) => {
    req.collection.find((err, coleccion) => {
        if (err)
            return next(err);
        res.json(coleccion);
    });
});
app.get('/api/:coleccion/:id', (req, res, next) => {
    req.collection.findOne({
        _id: id(req.params.id)
    }, (err, elemento) => {
        if (err)
            return next(err);
        res.json(elemento);
    });
});
app.post('/api/:coleccion', (req, res, next) => {
    const elemento = req.body;
    if (!elemento.nombre) {
        res.status(400).json({ error: 'Bad data', description: 'Se precisa al menos un campo <nombre>' });
    } else {
        req.collection.save(elemento, (err, coleccionGuardada) => {
            if (err)
                return next(err);
            res.json(coleccionGuardada);
        });
    }
});
app.put('/api/:coleccion/:id', (req, res, next) => {
    let elementoId = req.params.id;
    let elementoNuevo = req.body;
    req.collection.update({
        _id: id(elementoId)
    }, {
        $set: elementoNuevo
    }, {
        safe: true,
        multi: false
    }, (err, elementoModif) => {
        if (err)
            return next(err);
        res.json(elementoModif);
    });
});
app.delete('/api/:coleccion/:id', (req, res, next) => {
    let elementoId = req.params.id;
    req.collection.remove({
        _id: id(elementoId)
    }, (err, resultado) => {
        if (err)
            return next(err);
        res.json(resultado);
    });
});
app.listen(port, () => {
    console.log(`API REST ejecutándose en http://localhost:${port}/api/:coleccion/:id`);
});
