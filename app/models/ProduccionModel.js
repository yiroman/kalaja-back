const mongoose = require('mongoose');
const HistorialProduccionSchema = new mongoose.Schema({
    productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto3D', required: true },
    nombreProducto: { type: String, required: true },
    cantidad: { type: Number, required: true },
    fechaProduccion: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = HistorialProduccionModel = mongoose.model('historialProduccion', HistorialProduccionSchema);
