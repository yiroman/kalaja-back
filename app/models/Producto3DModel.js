const mongoose = require('mongoose');


const Produccion3DSchema = new mongoose.Schema({
    nombre: { type: String, required: true }, // nombre del producto
    cantidad: { type: Number, required: true },
    fallidas: {type: Number, default: 0},      // piezas defectuosas
    stock: {type: Number, default: 0},
    regalados: {type: Number, default: 0},

    // Datos técnicos de producción
    gramos: { type: Number, required: true },
    precioFilamento: { type: Number, required: true },
    horasImpresion: { type: Number, required: true },
    horasHombre: { type: Number, required: true },
    costoExtra: { type: Number, default: 0 },
    extras: { type: String },

    precioVenta: { type: Number, required: true }, // precio de venta por unidad

    // Plantilla técnica (impresora usada)
    plantillaTecnica: {
        nombre: String,
        consumoWatt: Number,
        precioKwh: Number,
        vidaUtilHoras: Number,
        precioRepuestos: Number,
        margenError: Number
    },

    // Cálculos finales (guardados para trazabilidad)
    costoLote: { type: Number },
    precioCostoPieza: { type: Number },
    utilidadPorPieza: { type: Number },
    totalVenta: { type: Number },
    utilidadReal: { type: Number },

    // Metadatos
    fecha: { type: Date, default: Date.now },
    // operadorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = Producto3DModel = mongoose.model('productos3d', Produccion3DSchema);
