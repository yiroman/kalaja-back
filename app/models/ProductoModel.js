const mongoose = require('mongoose');

const VarianteSchema = new mongoose.Schema({
    genero: { type: String, required: true }, // Hombre, Mujer, Unisex
    tipoManga: { type: String, required: true }, // Corta, Larga
    colores: [{
        color: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 }
    }]
}, { _id: false });

const ProductoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true },
    imagen: { type: String },
    variantes: [VarianteSchema] // Lista de variantes disponibles
}, { timestamps: true });


module.exports = ProductoModel =  mongoose.model('productos', ProductoSchema);
