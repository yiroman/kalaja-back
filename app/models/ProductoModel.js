const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    nombre: { type: String, required: true }, // Nombre del producto
    descripcion: { type: String }, // Descripción del producto
    precio: { type: Number, required: true }, // Precio base del producto
    categoria: { type: String, required: true }, // Ej: "Ropa", "Termos", "Tazas"
    imagen: { type: String }, // URL de la imagen del producto
    variantes: [{
        nombre: { type: String, required: true }, // Ej: "Color", "Talla", "Capacidad"
        opciones: [{
            valor: { type: String, required: true }, // Ej: "Negro", "M", "500ml"
            stock: { type: Number, required: true, default: 0 } // Stock de esta variante
        }]
    }],
    labels: [{ type: String }],
    categorias: [{ type: String }],
    subcategorias: [{ type: String }],
}, { timestamps: true });

module.exports = ProductoModel = mongoose.model('productos', ProductoSchema);
