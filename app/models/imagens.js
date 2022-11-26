var mongoose = require('mongoose');
var schema = mongoose.Schema({
	titulo: String,
	usuarioParRef: {
		type: String,
		required: true
	},
	preview:{
		type: Object,
		required: true
	},
	vWeb:{
		type: Object,
		required: true
	},
	vImpressao:{
		type: Object,
		required: true
	}
});
mongoose.model('Imagem', schema, 'imagens');

