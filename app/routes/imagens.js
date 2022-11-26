var multer  = require('multer');

module.exports = function(app){
    // console.log(app);
    var api = app.api.imagens;

    app.get("/v1/imagens/:usuarioId", api.listarImagensPorUsuario);
    app.post("/v1/imagens/:usuarioId", api.postarImagemPorUsuario);
    app.get("/v1/imagens/listadir/:usuarioId", api.carregaImagensPorPasta);
    app.delete('/v1/imagens/:usuarioId', api.detelarImagensPorUsuario);
    app.delete('/v1/imagens/:usuarioId/:imagemId', api.detelarUmaImagemPorUsuario);
}