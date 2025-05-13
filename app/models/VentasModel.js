// models/Venta3D.js
const mongoose = require('mongoose');

const Venta3DSchema = new mongoose.Schema({
    produccionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productos3d',
        required: true
    },
    cantidad: {
        type: Number,
        required: true,
        min: 1
    },
    precioUnitario: {
        type: Number,
        required: true,
        min: 0
    },
    total: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('ventas3d', Venta3DSchema);
