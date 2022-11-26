const crypto = require('crypto');
const isObjectEmpty = require('../services/isObjectEmpty');

class Hash{
    constructor(){
    }

    gerar(app, senha){
        return crypto.createHash(app.get('hashType'), app.get('secretHash'))
        .update(senha)
        .digest('base64')
    }
}

module.exports = new Hash()



