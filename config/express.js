const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');


module.exports = function () {

	const app = express();


	// configura os body parser pra funcionar com json (parseia as respostas)
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json({limit: '50mb'}));
	
	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
		next();
	});

	app.use(express.static('./app/documentos'));

	// Puxa os modulos atraves do consign
	// A primeira Rota é a de Login
	consign({ cwd: 'app' })
		.include('models')
		.then('api')
		.then('routes')
		.into(app);

	return app;
}