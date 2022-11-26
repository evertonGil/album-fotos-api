var app = require('./config/express')();
require('./config/connectionFactory')('localhost/album');

var porta = process.env.PORT || 3000;

app.listen(porta, function() {
    console.log(`servidor rodando em modo: ${process.env.NODE_ENV}`);
})