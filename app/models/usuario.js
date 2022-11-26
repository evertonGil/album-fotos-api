var mongoose = require('mongoose');
var schema = mongoose.Schema({
    nome: String,
    Albums: [
        {
            id: String,
            nome: String,
            nomeExibicao: String,
            tipoAlbumNome: String,
            tipoAlbumParRef: Number,
            slots: [
                {
                    id: String,
                    imagemParRef: String,
                    position: {
                        x: Number,
                        y: Number
                    },
                    largura: Number,
                    altura: Number
                }
            ]
        }
    ],
    imagensPreview: [
        {
            imagemParRef: Number
        }
    ]
});
mongoose.model('Usuario', schema, 'usuarios');

