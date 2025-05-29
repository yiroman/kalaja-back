const express = require('express'),
    jwt = require('jsonwebtoken'),
    winston = require("../config/winston"),
    multer = require('multer')


const Producto3DModel = require ('../models/Producto3DModel');
const Venta3D = require ('../models/VentasModel');


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
            fallidas: data.fallidas || 0,
            regalados: data.regalo || 0,
            stock: data.stock || data.cantidad,
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
        const productos = await Producto3DModel.find({}).sort({ nombre: 1 });
        return respuestaHTTP(res, 200, "Lista de productos", productos);
    } catch (e) {
        return res.status(500).json({ code: 500, message: `No se pudo obtener los productos: ${e.message}` });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const producto = await Producto3DModel.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ code: 404, message: "Producto no encontrado" });
        }

        const { nombre, cantidad, gramos, stock, precioFilamento, horasImpresion, horasHombre, costoExtra, extras, precioVenta, plantillaTecnica } = req.body;
        producto.nombre = nombre;
        producto.cantidad = cantidad;
        producto.gramos = gramos;
        producto.stock = stock;
        producto.precioFilamento = precioFilamento;
        producto.horasImpresion = horasImpresion;
        producto.horasHombre = horasHombre;
        producto.costoExtra = costoExtra;
        producto.extras = extras;
        producto.precioVenta = precioVenta;
        producto.plantillaTecnica = plantillaTecnica;
        producto.fallidas = req.body.fallidas || 0;
        producto.regalados = req.body.regalo || 0;
        producto.costoLote = req.body.costoLote || 0;
        producto.precioCostoPieza = req.body.precioCostoPieza || 0;
        producto.utilidadPorPieza = req.body.utilidadPorPieza || 0;
        producto.totalVenta = req.body.totalVenta || 0;
        producto.utilidadReal = req.body.utilidadReal || 0;
        await producto.save();

        return respuestaHTTP(res, 200, "Producto actualizado", producto);
    } catch (e) {
        return respuestaHTTP(res, 500, "Error al actualizar el producto", e);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const producto = await Producto3DModel.findById(req.params.id);
        const ventasProducto = await Venta3D.find({ produccionId: req.params.id });
        if (!producto) {
            return res.status(404).json({ code: 404, message: "Producto no encontrado" });
        }
        const productoConVentas = {
            ...producto.toObject(),
            ventas: ventasProducto.map(venta => ({
                _id: venta._id,
                cantidad: venta.cantidad,
                precioUnitario: venta.precioUnitario,
                total: venta.total,
                fecha: venta.fecha
            }))
        }
        return respuestaHTTP(res, 200, "Producto encontrado", productoConVentas)
    } catch (e) {
        return res.status(500).json({ code: 500, message: `No se pudo obtener el producto: ${e.message}` });
    }
} );

router.delete('/:id', async (req, res) => {
    try {
        const producto = await Producto3DModel.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ code: 404, message: "Producto no encontrado" });
        }
        await producto.remove();
        return res.json({ code: 200, message: "Producto eliminado" });
    } catch (e) {
        return res.status(500).json({ code: 500, message: `No se pudo eliminar el producto: ${e.message}` });
    }
});


router.patch('/:id/fallidas', async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;

        if (!cantidad || cantidad <= 0) {
            return res.status(400).json({ error: 'Cantidad inválida' });
        }

        const produccion = await Producto3DModel.findById(id);
        if (!produccion) {
            return res.status(404).json({ error: 'Producción no encontrada' });
        }

        if (produccion.stock < cantidad) {
            return res.status(400).json({ error: 'Stock insuficiente para descontar' });
        }

        // Actualizar valores
        produccion.fallidas += cantidad;
        produccion.stock -= cantidad;
        await produccion.save();

        respuestaHTTP(res, 200, "Lista de productos", produccion)

    } catch (error) {
        console.error('Error al registrar fallidas:', error);
        respuestaHTTP(res, 500, "Error al registrar fallidas", error);
    }
});


router.patch('/:id/regalo', async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;

        if (!cantidad || cantidad <= 0) {
            return res.status(400).json({ error: 'Cantidad inválida' });
        }

        const produccion = await Producto3DModel.findById(id);
        if (!produccion) {
            return res.status(404).json({ error: 'Producción no encontrada' });
        }

        if (produccion.stock < cantidad) {
            return res.status(400).json({ error: 'Stock insuficiente para descontar' });
        }

        // Actualizar valores
        produccion.regalados += cantidad;
        produccion.stock -= cantidad;
        await produccion.save();

        respuestaHTTP(res, 200, "Lista de productos", produccion)

    } catch (error) {
        console.error('Error al registrar fallidas:', error);
        respuestaHTTP(res, 500, "Error al registrar fallidas", error);
    }
});


router.patch('/:id/stock', async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;

        if (!cantidad || cantidad <= 0) {
            return res.status(400).json({ error: 'Cantidad inválida' });
        }

        const produccion = await Producto3DModel.findById(id);
        if (!produccion) {
            return res.status(404).json({ error: 'Producción no encontrada' });
        }
        // Actualizar valores
        produccion.stock += cantidad;
        await produccion.save();

        respuestaHTTP(res, 200, "Lista de productos", produccion)

    } catch (error) {
        console.error('Error al registrar stock:', error);
        respuestaHTTP(res, 500, "Error al registrar stock", error);
    }
});

router.post('/venta', async (req, res) => {
    const { _id, cantidad, precioVenta } = req.body;

    // 1) Validación básica
    if (!_id || !cantidad || cantidad <= 0 || !precioVenta) {
        return respuestaHTTP(res, 400, "Datos incompletos o inválidos", null);
    }

    // 2) Calcula total
    const total = cantidad * precioVenta;

    let produccion;
    try {
        // 3) Ajusta stock de forma atómica (solo si hay suficiente)
        produccion = await Producto3DModel.findOneAndUpdate(
            { _id: _id, stock: { $gte: cantidad } },
            { $inc: { stock: -cantidad } },
            { new: true, runValidators: true }
        );
        if (!produccion) {
            return respuestaHTTP(res, 400, "Stock insuficiente o producción no encontrada", null);
        }
    } catch (err) {
        console.error('Error ajustando stock:', err);
        return respuestaHTTP(res, 500, "Error al registrar stock", err);
    }

    try {
        // 4) Registra la venta
        const venta = await Venta3D.create({
            produccionId: _id,
            cantidad,
            precioUnitario: precioVenta,
            total
        });
        // 5) Responde con el nuevo estado y el registro de venta
        return respuestaHTTP(res, 200, "Lista de productos", venta);
    } catch (err) {
        console.error('Error al crear venta:', err);
        // 6) (Opcional) Revertir el stock si falla la creación de la venta
        await Producto3DModel.findByIdAndUpdate(
            _id,
            { $inc: { stock: cantidad } }
        );
        return respuestaHTTP(res, 500, "Error al registrar venta", err);
    }
});


router.get('/reporte/ventas', async (req, res) => {
    try {
        const ventas = await Venta3D.find({}).populate('produccionId');
        const ventasMes = ventas
            .filter(venta => {
                const fechaVenta = new Date(venta.fecha);
                const fechaActual = new Date();
                return (
                    fechaVenta.getFullYear() === fechaActual.getFullYear() &&
                    fechaVenta.getMonth() === fechaActual.getMonth()
                );
            })
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        const totalVentasMes = ventasMes.reduce((acum, venta) => acum + venta.total, 0);
        const ventasTotales = ventas.reduce((acum, venta) => acum + venta.total, 0);
        const top5 = await Venta3D.aggregate([
            // 1) Agrupo por producto, sumo unidades y tomo un precio unitario
            {
                $group: {
                    _id: "$produccionId",
                    totalUnidades:  { $sum: "$cantidad" },
                    precioUnitario: { $first: "$precioUnitario" }
                }
            },
            // 2) Orden descendente
            { $sort:  { totalUnidades: -1 } },
            // 3) Solo los 5 primeros
            { $limit: 5 },
            // 4) Hago lookup para obtener nombre u otros datos del producto
            {
                $lookup: {
                    from:         "productos3ds",
                    localField:   "_id",
                    foreignField: "_id",
                    as:           "producto"
                }
            },
            { $unwind: "$producto" },
            // 5) Proyecto los campos que quiero en la salida
            {
                $project: {
                    _id:            0,
                    productoId:     "$_id",
                    nombre:         "$producto.nombre",
                    totalUnidades:  1,
                    precioUnitario: 1,
                    // opcional: calculo el total (€) de esa línea
                    total:          { $multiply: ["$precioUnitario", "$totalUnidades"] }
                }
            }
        ]);

        const reporte = {
            totalVentas: ventas.length,
            ventasTotales,
            totalVentasMes: totalVentasMes,
            ventasMes,

            top5
        };
        return respuestaHTTP(res, 200, "Lista de ventas", reporte);
    } catch (e) {
        return res.status(500).json({ code: 500, message: `No se pudo obtener las ventas: ${e.message}` });
    }
});

module.exports = router;