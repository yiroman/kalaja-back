const mongoose = require('mongoose');

const RolSchema = mongoose.Schema({
    clave_rol: { type: Number,
        enum: []
     },
    nombre_rol: { type: String,
        enum: []
     }
});

module.exports = RolModel =  mongoose.model('roles', RolSchema);