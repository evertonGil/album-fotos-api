var mongoose = require('mongoose');
var schema = mongoose.Schema({
    nome: String,
    nomeExibicao: String,
    slots: [
        {
            id: String,
            position: {
                x: Number,
                y: Number
            },
            largura: Number,
            altura: Number
        }
    ]
});
mongoose.model('TipoAlbum', schema, 'tipoAlbum');
