const mongoose = require('mongoose');

const LineaVentaSchema = new mongoose.Schema({
    codigo:         { type: String, required: true },   // default_code del producto
    nombre:         { type: String, required: true },   // name del producto
    odooProductId:  { type: Number, required: true },   // odooTemplateId
    cantidad:       { type: Number, required: true, min: 1 },
    precioUnitario: { type: Number, required: true, min: 0 },
    subtotal:       { type: Number, required: true }    // cantidad * precioUnitario
}, { _id: false });

const VentaOdooSchema = new mongoose.Schema({
    partnerNombre:    { type: String, required: true },  // Nombre del cliente (del Excel)
    partnerOdooId:    { type: Number, default: null },   // ID de res.partner en Odoo

    lineas:           { type: [LineaVentaSchema], required: true },
    total:            { type: Number, required: true },

    odooSaleOrderId:  { type: Number, default: null },   // ID del sale.order creado en Odoo
    estadoOdoo: {
        type: String,
        enum: ['pendiente', 'confirmado', 'error'],
        default: 'pendiente'
    },
    odooError:        { type: String, default: null },   // Detalle del error si falló

    creadoPor:        { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios', default: null }

}, { timestamps: true });

module.exports = mongoose.model('ventas_odoo', VentaOdooSchema);
