const express = require('express'),
    jwt = require('jsonwebtoken'),
    winston = require("../config/winston"),
    multer = require('multer')


const Producto3DModel = require ('../models/Producto3DModel');


const router = express.Router();
const fs = require("fs");
const { crearError, respuestaHTTP} = require('../utils/errores');


router.post('/', async (req, res) => {
    try {
        const data = req.body;

        // Validaciones mínimas (puedes hacer más detalladas si gustas)
        if (!data.nombre || !data.cantidad || data.cantidad <= 0) {
            return res.status(400).json({ error: 'Datos incompletos o inválidos' });
        }

        const nuevaProduccion = new Producto3DModel({
            nombre: data.nombre,
            cantidad: data.cantidad,
            gramos: data.gramos,
            precioFilamento: data.precioFilamento,
            horasImpresion: data.horasImpresion,
            horasHombre: data.horasHombre,
            costoExtra: data.costoExtra,
            extras: data.extras,
            precioVenta: data.precioVenta,

            plantillaTecnica: data.plantillaTecnica,

            costoLote: data.costoLote,
            precioCostoPieza: data.precioCostoPieza,
            utilidadPorPieza: data.utilidadPorPieza,
            totalVenta: data.totalVenta,
            utilidadReal: data.utilidadReal,

            operadorId: data.operadorId, // opcional si lo manejas por sesión
        });

        const resultado = await nuevaProduccion.save();
        res.status(201).json(resultado);

    } catch (error) {
        console.error('Error al guardar producción:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});





router.get('/', async (req, res) => {
    try {
        const productos = await Producto3DModel.find({});
        return respuestaHTTP(res, 200, "Lista de productos", productos);
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
                fs.unlink(`./uploads/producto/${nombre_anterior}`, (error) =>{
                    if(error){
                        res.send(error)
                    }
                })

            }
        }else{
            crearError(res, "no se pudo cargar la imagen")
        }

    });


router.put('/:id/stock', async (req, res) => {
    const { id } = req.params;
    const cambios = req.body; // arreglo de combinaciones { varianteId, opcionId, nuevoStock, nuevoPrecio }

    try {
        const producto = await ProductoModel.findById(id);

        cambios.forEach(cambio => {
            const variante = producto.variantes.id(cambio.varianteId);
            const opcion = variante.opciones.id(cambio.opcionId);

            if (opcion) {
                opcion.stock += parseInt(cambio.nuevoStock);
                if (opcion.precioCompra !== cambio.nuevoPrecio) {
                    opcion.precioCompra = cambio.nuevoPrecio;
                }
            }
        });

        await producto.save();
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});



module.exports = router;