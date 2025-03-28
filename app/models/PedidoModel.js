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
        imagenDiseno: { type: String },// URL de la imagen del diseño


        // CALCULO DE COSTOS
        tipo: { type: String, enum: ['Imprenta', '3D'], required: true },

        costoProducto: { type: Number },
        costoImpresion: { type: Number },

        gramosUsados: { type: Number },
        costoFilamento: { type: Number },
        horasProduccion: { type: Number },
        costoPorHora: { type: Number },
        desgasteMaquina: { type: Number },
        costoExtra: { type: Number },

        precioCosto: { type: Number },         // Calculado por tipo
        totalCosto: { type: Number },
        comision: { type: Number },
        totalComision: { type: Number },
        utilidadReal: { type: Number }
    }],
    total: { type: Number, required: true }, // Suma de subtotales de productos
    fechaCreacion: { type: Date, default: Date.now }, // Fecha automática de creación
    fechaEntrega: { type: Date }, // Fecha de entrega estimada
    estado: {
        type: String,
        enum: ['Pendiente', 'En Producción', 'Finalizado', 'Entrega Pendiente', 'Cancelado'],
        default: 'Pendiente'
    }, // Estado del pedido
    metodoPago: {
        type: String,
        enum: ['Efectivo', 'Transferencia', 'Tarjeta', 'MSI'],
        required: true
    }, // Método de pago usado
    cuentaDestino: { type: mongoose.Schema.Types.ObjectId, ref: 'Cuenta' }, // Cuenta donde se recibió el pago
    notas: { type: String }, // Notas adicionales sobre el pedido



    // DATOS DE COSTOS
    totalCosto: { type: Number },       // Opcional
    totalComision: { type: Number },    // Opcional
    utilidadReal: { type: Number },     // Opcional
    tipoGeneral: {
        type: String,
        enum: ['Imprenta', '3D', 'Mixto'],
    },

}, { timestamps: true }); // timestamps agrega automáticamente `createdAt` y `updatedAt`

module.exports = PedidoModel = mongoose.model('pedidos', PedidoSchema);
