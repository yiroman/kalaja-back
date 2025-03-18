const express = require('express'),
    jwt = require('jsonwebtoken'),
    winston = require("../config/winston"),
    multer = require('multer')


const ProductoModel = require ('../models/ProductoModel');


const router = express.Router();
const fs = require("fs");
const { crearError } = require('../utils/errores');


router.post('/', async (req, res) => {
    try {
        const { nombre, descripcion, precio, categoria, imagen, atributosEspecificos, variantes, labels, categorias, subcategorias } = req.body;

        if (!nombre || !precio || !categoria) {
            return res.status(400).json({ code: 400, message: "Faltan datos obligatorios" });
        }

        const nuevoProducto = new ProductoModel({
            nombre,
            descripcion,
            precio,
            categoria,
            imagen,
            atributosEspecificos,
            variantes,
            labels,
            categorias,
            subcategorias
        });

        await nuevoProducto.save();
        return res.status(201).json(nuevoProducto);
    } catch (e) {
        return res.status(500).json({ code: 500, message: `No se pudo crear el producto: ${e.message}` });
    }
});

router.get('/', async (req, res) => {
    try {
        const productos = await ProductoModel.find({});
        return res.json(productos);
    } catch (e) {
        return res.status(500).json({ code: 500, message: `No se pudo obtener los productos: ${e.message}` });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const producto = await ProductoModel.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ code: 404, message: "Producto no encontrado" });
        }

        const { nombre, descripcion, precio, categoria, imagen, atributosEspecificos, variantes, etiquetas, categorias, subcategorias } = req.body;

        producto.nombre = nombre;
        producto.descripcion = descripcion;
        producto.precio = precio;
        producto.categoria = categoria;
        producto.imagen = imagen;
        producto.atributosEspecificos = atributosEspecificos;
        producto.variantes = variantes;
        producto.labels = etiquetas;
        producto.categorias = categorias;
        producto.subcategorias = subcategorias;

        await producto.save();
        return res.json(producto);
    } catch (e) {
        return res.status(500).json({ code: 500, message: `No se pudo actualizar el producto: ${e.message}` });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const producto = await ProductoModel.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ code: 404, message: "Producto no encontrado" });
        }
        return res.json(producto);
    } catch (e) {
        return res.status(500).json({ code: 500, message: `No se pudo obtener el producto: ${e.message}` });
    }
} );




module.exports = router;