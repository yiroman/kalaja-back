const express = require('express'),
    jwt = require('jsonwebtoken'),
    winston = require("../config/winston"),
    multer = require('multer')

const ProductoModel = require('../models/ProductoModel');



const router = express.Router();
const fs = require("fs");
const { crearError } = require('../utils/errores');


router.post('/', async (req, res) => {
    try {
        const { nombre, descripcion, precio, categoria, imagen, variantes } = req.body;

        if (!nombre || !precio || !categoria || !variantes || variantes.length === 0) {
            return res.status(400).json({ code: 400, message: "Faltan datos obligatorios" });
        }

        const nuevoProducto = new ProductoModel({
            nombre,
            descripcion,
            precio,
            categoria,
            imagen,
            variantes
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




module.exports = router;