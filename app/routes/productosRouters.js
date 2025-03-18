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

router.delete('/:id', async (req, res) => {
    try {
        const producto = await ProductoModel.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ code: 404, message: "Producto no encontrado" });
        }
        await producto.remove();
        return res.json({ code: 200, message: "Producto eliminado" });
    } catch (e) {
        return res.status(500).json({ code: 500, message: `No se pudo eliminar el producto: ${e.message}` });
    }
});



// //*****************************************************
// //***************** FOTOS DE PERFIL *******************
const storageImageProducto = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/producto");
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const partes = file.mimetype.split("/");
        cb(null, uniqueName + "." + partes[1]);
    }
});


const uploadImageProducto = multer({
    storage: storageImageProducto,
    fileFilter: (req, file, cb) => {
        const extensiones =['jpeg','jpg','png'];
        const partes = file.mimetype.split("/");
        const resultado = extensiones.includes(partes[1]);
        if(resultado){
            cb(null, true);
        }
        else{
            cb("El archivo cargado no es un archivo compatible extensiones validas: jpeg, jpg y png");
        }
    }
});


router.post('/upload',
    uploadImageProducto.single('imagenProducto'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No se cargó la imagen del producto" });
            }

            // Obtener los índices de variante y opción desde la URL
            const { varianteIndex, opcionIndex } = req.params;

            res.json({
                message: "Imagen del producto subida correctamente",
                filename: req.file.filename,
                path: req.file.path,
                varianteIndex,
                opcionIndex
            });
        } catch (e) {
            res.status(500).json({ error: `Error al subir imagen: ${e}` });
        }
    }
);



router.post('/editar_foto_producto',
    // middleware_token,
    uploadImageProducto.single('imagenProducto'), (req, res) => {
        const { nombre_anterior } = req.body;

        if (!req.file) {
            res.status(400).json({ message: "No se pudo cargar la imagen" });
        }

        if(req.file){
            if(nombre_anterior){
                fs.unlink(`./uploads/imagenProducto/${nombre_anterior}`, (error) =>{
                    if(error){
                        res.send(error)
                    }
                })

            }
        }else{
            crearError(res, "nose pudo cargar la imagen")
        }

    });

module.exports = router;