const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
    numeroPedido: { type: String, required: true, unique: true }, // Código único del pedido
    cliente: { type: String }, // Cliente del pedido
    productos: [{
        producto: { type: String, required: true }, // Nombre del producto
        variante: { type: String }, // 🔹 Nueva propiedad: Variante del producto
        opcion: { type: String }, // 🔹 Nueva propiedad: Opción seleccionada
        cantidad: { type: Number, required: true }, // Cantidad solicitada
        precioUnitario: { type: Number, required: true }, // Precio del producto en el momento de la compra
        subtotal: { type: Number, required: true }, // Calculado como cantidad * precioUnitario
        imagenDiseno: { type: String } // URL de la imagen del diseño
    }],
    total: { type: Number, required: true }, // Suma de subtotales de productos
    fechaCreacion: { type: Date, default: Date.now }, // Fecha automática de creación
    fechaEntrega: { type: Date }, // Fecha de entrega estimada
    estado: {
        type: String,
        enum: ['pendiente', 'en producción', 'finalizado', 'cancelado'],
        default: 'pendiente'
    }, // Estado del pedido
    metodoPago: {
        type: String,
        enum: ['Efectivo', 'transferencia', 'tarjeta', 'MSI'],
        required: true
    }, // Método de pago usado
    cuentaDestino: { type: mongoose.Schema.Types.ObjectId, ref: 'Cuenta' }, // Cuenta donde se recibió el pago
    notas: { type: String } // Notas adicionales sobre el pedido
}, { timestamps: true }); // timestamps agrega automáticamente `createdAt` y `updatedAt`

module.exports = PedidoModel = mongoose.model('pedidos', PedidoSchema);
