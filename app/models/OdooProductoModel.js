const mongoose = require('mongoose');

const OdooProductoSchema = new mongoose.Schema({
    odooTemplateId: { type: Number, required: true, unique: true }, // ID de product.template en Odoo
    code:           { type: String, default: null },                // default_code (ej: KL-POK-001)
    name:           { type: String, required: true },               // Nombre del producto
    salePrice:      { type: Number, default: 0 },                   // lst_price
    availableInPos: { type: Boolean, default: false },              // available_in_pos
    active:         { type: Boolean, default: true },               // active
    saleOk:         { type: Boolean, default: true },               // sale_ok
    category: {
        id:   { type: Number, default: null },                      // categ_id[0]
        name: { type: String, default: null }                       // categ_id[1]
    },
    barcode:        { type: String, default: null },                // barcode
    odooWriteDate:  { type: String, default: null },                // write_date de Odoo
    syncedAt:       { type: Date, default: Date.now }               // Fecha de última sincronización
}, { timestamps: true });

module.exports = mongoose.model('odoo_productos', OdooProductoSchema);
