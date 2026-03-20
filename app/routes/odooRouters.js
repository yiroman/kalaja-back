var express = require('express');
const router = express.Router();
const OdooProductoModel = require('../models/OdooProductoModel');
const { fetchOdooProducts, mapOdooProduct } = require('../services/odooService');
const { middlewareToken } = require('../config/middlewares');
const { respuestaHTTP } = require('../utils/errores');


// GET /api/v2/odoo/productos
// Devuelve los productos ya sincronizados en MongoDB
router.get('/productos', middlewareToken, async (req, res) => {
    try {
        const productos = await OdooProductoModel.find({}).sort({ name: 1 });
        res.json(productos);
    } catch (e) {
        respuestaHTTP(res, 500, 'Error al obtener productos de Odoo', e.message);
    }
});


// GET /api/v2/odoo/productos/:id
// Devuelve un producto por su odooTemplateId
router.get('/productos/:id', middlewareToken, async (req, res) => {
    try {
        const producto = await OdooProductoModel.findOne({ odooTemplateId: req.params.id });
        if (!producto) return respuestaHTTP(res, 404, 'Producto no encontrado');
        res.json(producto);
    } catch (e) {
        respuestaHTTP(res, 500, 'Error al obtener el producto', e.message);
    }
});


// POST /api/v2/odoo/sync
// Sincroniza productos desde Odoo y los guarda/actualiza en MongoDB
router.post('/sync', middlewareToken, async (req, res) => {
    try {
        const items   = await fetchOdooProducts();
        const mapped  = items.map(mapOdooProduct);

        let created = 0;
        let updated = 0;

        for (const producto of mapped) {
            const result = await OdooProductoModel.updateOne(
                { odooTemplateId: producto.odooTemplateId },
                { $set: producto },
                { upsert: true }
            );
            if (result.upsertedCount > 0) created++;
            else updated++;
        }

        respuestaHTTP(res, 200, 'Sincronización completada', {
            total:   mapped.length,
            created,
            updated
        });
    } catch (e) {
        respuestaHTTP(res, 500, 'Error al sincronizar con Odoo', e.message);
    }
});


module.exports = router;
