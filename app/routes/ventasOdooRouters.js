var express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const { middlewareToken } = require('../config/middlewares');
const { respuestaHTTP } = require('../utils/errores');
const OdooProductoModel = require('../models/OdooProductoModel');
const VentaOdooModel = require('../models/VentaOdooModel');
const { resolvePartner, createAndConfirmSaleOrder } = require('../services/odooService');

const storageExcel = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads/ventas_excel'),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + '.xlsx');
    }
});

const uploadExcel = multer({
    storage: storageExcel,
    fileFilter: (req, file, cb) => {
        const allowed = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];
        allowed.includes(file.mimetype)
            ? cb(null, true)
            : cb(new Error('Solo se permiten archivos Excel (.xlsx, .xls)'));
    },
    limits: { fileSize: 5 * 1024 * 1024 }
});

function escapeRegex(value = '') {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function mapProductoOption(producto) {
    return {
        odooProductId: producto.odooTemplateId,
        code: producto.code,
        name: producto.name,
        salePrice: producto.salePrice
    };
}

async function resolveProducto(referencia) {
    const texto = String(referencia ?? '').trim();
    if (!texto) return null;

    const code = texto.toUpperCase();
    let producto = await OdooProductoModel.findOne({ code });
    if (producto) return producto;

    producto = await OdooProductoModel.findOne({
        name: { $regex: `^${escapeRegex(texto)}$`, $options: 'i' }
    });
    if (producto) return producto;

    producto = await OdooProductoModel.findOne({
        $or: [
            { name: { $regex: `^${escapeRegex(texto)}`, $options: 'i' } },
            { code: { $regex: `^${escapeRegex(code)}`, $options: 'i' } }
        ]
    });

    return producto;
}

async function findProductSuggestions(referencia, limit = 8) {
    const texto = String(referencia ?? '').trim();
    if (!texto) return [];

    return OdooProductoModel
        .find({
            $or: [
                { name: { $regex: escapeRegex(texto), $options: 'i' } },
                { code: { $regex: escapeRegex(texto.toUpperCase()), $options: 'i' } }
            ]
        })
        .limit(limit)
        .select('code name salePrice odooTemplateId');
}

router.get('/plantilla', middlewareToken, async (req, res) => {
    try {
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Ventas');

        sheet.columns = [
            { header: 'partner', key: 'partner', width: 30 },
            { header: 'producto', key: 'producto', width: 30 },
            { header: 'cantidad', key: 'cantidad', width: 15 },
            { header: 'precio_unitario', key: 'precio_unitario', width: 20 }
        ];

        sheet.addRow({ partner: 'Publico General', producto: 'KL-POK-001' , cantidad: 2, precio_unitario: '' });
        sheet.addRow({ partner: 'Publico General', producto: 'Nombre del producto', cantidad: 1, precio_unitario: '' });

        const headerRow = sheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1565C0' } };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="plantilla_ventas.xlsx"');
        await workbook.xlsx.write(res);
        res.end();
    } catch (e) {
        respuestaHTTP(res, 500, 'Error al generar la plantilla', e.message);
    }
});

router.get('/productos/buscar', middlewareToken, async (req, res) => {
    try {
        const query = String(req.query.query ?? '').trim();
        if (query.length < 2) {
            return respuestaHTTP(res, 200, 'Búsqueda vacía', []);
        }

        const productos = await findProductSuggestions(query, 12);
        respuestaHTTP(res, 200, 'Productos encontrados', productos.map(mapProductoOption));
    } catch (e) {
        respuestaHTTP(res, 500, 'Error al buscar productos', e.message);
    }
});

router.post('/validar', middlewareToken, uploadExcel.single('archivo'), async (req, res) => {
    try {
        if (!req.file) return respuestaHTTP(res, 400, 'No se recibió ningún archivo');

        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(req.file.path);
        fs.unlink(req.file.path, () => {});

        const sheet = workbook.worksheets[0];
        const validas = [];
        const invalidas = [];

        const rows = [];
        sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return;
            rows.push({
                rowNumber,
                partner: String(row.getCell(1).value ?? '').trim(),
                referencia: String(row.getCell(2).value ?? '').trim(),
                cantidad: parseInt(String(row.getCell(3).value ?? '0')),
                precioUnitario: row.getCell(4).value != null ? parseFloat(row.getCell(4).value) : null
            });
        });

        for (const { rowNumber, partner, referencia, cantidad, precioUnitario } of rows) {
            if (!partner || !referencia || cantidad < 1) {
                invalidas.push({
                    rowNumber,
                    partner,
                    referencia,
                    codigo: '',
                    cantidad,
                    precioUnitario,
                    error: 'Campos obligatorios faltantes o cantidad inválida',
                    sugerencias: []
                });
                continue;
            }

            const producto = await resolveProducto(referencia);

            if (producto) {
                validas.push({
                    rowNumber,
                    partner,
                    referencia,
                    codigo: producto.code,
                    nombre: producto.name,
                    odooProductId: producto.odooTemplateId,
                    cantidad,
                    precioUnitario: precioUnitario ?? producto.salePrice
                });
                continue;
            }

            const sugerencias = await findProductSuggestions(referencia, 8);
            invalidas.push({
                rowNumber,
                partner,
                referencia,
                codigo: '',
                cantidad,
                precioUnitario,
                error: `Producto "${referencia}" no encontrado en el catálogo`,
                sugerencias: sugerencias.map(mapProductoOption)
            });
        }

        respuestaHTTP(res, 200, 'Validación completada', { validas, invalidas });
    } catch (e) {
        respuestaHTTP(res, 500, 'Error al procesar el archivo', e.message);
    }
});

router.post('/confirmar', middlewareToken, async (req, res) => {
    try {
        const { validas } = req.body;
        if (!validas || validas.length === 0) {
            return respuestaHTTP(res, 400, 'No hay líneas válidas para confirmar');
        }

        const byPartner = {};
        for (const linea of validas) {
            if (!byPartner[linea.partner]) byPartner[linea.partner] = [];
            byPartner[linea.partner].push(linea);
        }

        const resultados = [];

        for (const [partnerNombre, lineas] of Object.entries(byPartner)) {
            const lineasMapeadas = lineas.map(l => ({
                codigo: l.codigo,
                nombre: l.nombre,
                odooProductId: l.odooProductId,
                cantidad: l.cantidad,
                precioUnitario: l.precioUnitario,
                subtotal: l.cantidad * l.precioUnitario
            }));
            const total = lineasMapeadas.reduce((s, l) => s + l.subtotal, 0);

            const partner = await resolvePartner(partnerNombre);
            if (!partner) {
                const venta = new VentaOdooModel({
                    partnerNombre,
                    partnerOdooId: null,
                    lineas: lineasMapeadas,
                    total,
                    estadoOdoo: 'error',
                    odooError: `Partner "${partnerNombre}" no encontrado en Odoo`,
                    creadoPor: req.token?.id || null
                });
                await venta.save();
                resultados.push({ partner: partnerNombre, status: 'error', error: 'Partner no encontrado en Odoo' });
                continue;
            }

            let odooSaleOrderId = null;
            let estadoOdoo = 'confirmado';
            let odooError = null;

            try {
                const { saleOrderId } = await createAndConfirmSaleOrder(partner.id, lineas);
                odooSaleOrderId = saleOrderId;
            } catch (err) {
                estadoOdoo = 'error';
                odooError = err.message;
                console.log(odooError);
            }

            const venta = new VentaOdooModel({
                partnerNombre,
                partnerOdooId: partner.id,
                lineas: lineasMapeadas,
                total,
                odooSaleOrderId,
                estadoOdoo,
                odooError,
                creadoPor: req.token?.id || null
            });
            await venta.save();

            resultados.push({
                partner: partnerNombre,
                status: estadoOdoo,
                odooSaleOrderId,
                mongoId: venta._id
            });
        }

        const todosOk = resultados.every(r => r.status === 'confirmado');
        respuestaHTTP(
            res,
            todosOk ? 201 : 207,
            todosOk ? 'Todas las ventas confirmadas' : 'Ventas procesadas con errores parciales',
            resultados
        );
    } catch (e) {
        respuestaHTTP(res, 500, 'Error al confirmar ventas', e.message);
    }
});

router.get('/', middlewareToken, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const ventas = await VentaOdooModel
            .find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('partnerNombre lineas total estadoOdoo odooSaleOrderId createdAt');

        respuestaHTTP(res, 200, 'Ventas obtenidas', ventas);
    } catch (e) {
        respuestaHTTP(res, 500, 'Error al obtener ventas', e.message);
    }
});

module.exports = router;
