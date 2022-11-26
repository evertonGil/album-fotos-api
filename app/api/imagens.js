const mongoose = require('mongoose');
const model = mongoose.model('Imagem');
const fs = require('fs');
const root = './app/cocumentos/imagens';
const api = {};
const sharp = require('sharp');
const Async = require('async');


api.listarImagensPorUsuario = (req, res) => {
    const usuario = req.params.usuarioId;
    // console.log('requisicao', req);
    model.find({ usuarioParRef: usuario }).then(
        imagens => {
            res.json(imagens);
        },
        error => {
            res.status(500).json(error);
        }
    )

    // res.send(imagens);
};

api.carregaImagensPorPasta = (req, res) => {
    const usuario = req.params.usuarioId;
    const diretorio = req.headers.diretorio;

    fs.readdir(diretorio,
        (err, lista) => {
            if (lista) {
                const diretorioFim = `./app/documentos/imagens/${usuario}`;
                const diretorioPublico = `/imagens/${usuario}`;
                fs.mkdir(diretorioFim, err => {
                    if (err) {
                        console.log('[Diretorio ja existia]:', diretorioFim);
                    }
                });
                let indexArquivo = 0;

                // mapear a lista de arquivos para uma lista de parallels
                Async.map(lista, (arquivo, callback1) => {
                    indexArquivo++;
                    const _arquivo = diretorio + '\\' + arquivo;
                    const _extensao = `.jpg`;
                    const _nomeArquivo = `${indexArquivo}`;

                    const preview = {
                        path: `${diretorioFim}/preview_${_nomeArquivo}${_extensao}`,
                        pathPublic: `${diretorioPublico}/preview_${_nomeArquivo}${_extensao}`
                    };
                    const VWeb = {
                        path: `${diretorioFim}/vWeb_${_nomeArquivo}${_extensao}`,
                        pathPublic: `${diretorioPublico}/vWeb_${_nomeArquivo}${_extensao}`
                    };
                    const VImpressao = {
                        path: `${diretorioFim}/vImpressao_${_nomeArquivo}${_extensao}`,
                        pathPublic: `${diretorioPublico}/vImpressao_${_nomeArquivo}${_extensao}`
                    };

                    const imageSharp = sharp(_arquivo);

                    criarArquivos(imageSharp, usuario, _nomeArquivo, preview, VWeb, VImpressao, callback1);

                }, (err, results) => {
                    model.insertMany(results).then(
                        imagens => {
                            res.send(imagens);
                        },
                        error => {
                            console.log(error);
                            res.send(error);
                        }
                    )
                });
            }
            if (err) {
                res.send('erro');
                console.log(err);
            }
        })
};

api.detelarUmaImagemPorUsuario = (req, res) => {
    const usuario = req.params.usuarioId;
    const imagemId = req.params.imagemId;
    const caminhoRoot = './app/documentos/';
    console.log(imagemId);

    model.find({ "_id": imagemId },
        (err, imagem) => {
            console.log(imagem, err);

            if (err) {
                console.log(err)
                res.send('Aconteceu um erro')
            }
            if (imagem && imagem.length) {
                console.log('imagem Encontrada', imagem);
                deletaArquivos(caminhoRoot, imagem[0], (err, results) => {
                    if (err) {
                        console.log('[envia erro]')
                        res.send({ erro: err })
                    }
                    if (results) {
                        console.log('[envia Resultado]')
                        res.send({ resultados: results })
                    }
                });
            }
            else{
                res.sendStatus(404)
            }
        });

};

api.detelarImagensPorUsuario = (req, res) => {
    const usuario = req.params.usuarioId;
    const caminhoRoot = './app/documentos/';
    model.find({ usuarioParRef: usuario })
        .then(
            (imagens) => {
                Async.each(imagens,
                    (imagem, cb) => {
                        console.log(imagem)
                        deletaArquivos(caminhoRoot, imagem, (err, results) => {
                            if (results) {
                                cb()
                            }
                            if (err) {
                                cb(err)
                            }
                        });
                    },
                    (err) => {
                        if (err) res.send('arquivos não Deletados')
                        else res.send('Arquivos deletados')
                    });
            },
            (err) => res.send(err)
        );
};



api.postarImagemPorUsuario = (req, res) => {
    console.log("rota upload acessada");
    const usuario = req.params.usuarioId;
    const body = req.body;
    const arquivo = body.nome;

    const mkdirUrl = `./app/documentos/imagens/${usuario}`;

    const diretorioFim = `./app/documentos/imagens/${usuario}`;
    const diretorioPublico = `/imagens/${usuario}`;

    const _extensao = `.jpg`;
    const _nomeArquivo = `${arquivo}`;
    const preview = {
        path: `${diretorioFim}/preview_${_nomeArquivo}${_extensao}`,
        pathPublic: `${diretorioPublico}/preview_${_nomeArquivo}${_extensao}`
    };
    const VWeb = {
        path: `${diretorioFim}/vWeb_${_nomeArquivo}${_extensao}`,
        pathPublic: `${diretorioPublico}/vWeb_${_nomeArquivo}${_extensao}`
    };
    const VImpressao = {
        path: `${diretorioFim}/vImpressao_${_nomeArquivo}${_extensao}`,
        pathPublic: `${diretorioPublico}/vImpressao_${_nomeArquivo}${_extensao}`
    };

    // verifica se o arquivo ja existe na pasta

    fs.mkdir(mkdirUrl, err => {
        if (err) {
            pastaJaExistia = true;
            console.log('[Diretorio ja existia]:', diretorioFim);
        }
    });

    const stringUrl = body.dataUrl.split(',');
    const valor = stringUrl.slice(1, stringUrl.length).join(',');
    // console.log('string', valor, stringUrl.length);

    var buf = Buffer.from(valor, 'base64');

    const imageSharp = sharp(buf);

    criarArquivos(imageSharp, usuario, _nomeArquivo, preview, VWeb, VImpressao, (error, resultado) => {
        // res.send(resultado);
        model.create(resultado).then(
            (respostaDb) => {
                console.log(respostaDb);
                res.status(200).send({ "objeto": respostaDb });
            },
            (error) => {
                logger.log('error', error);
                res.status(500).json(error);
            });
    });

};

const transformInObjImage = (info, path) => {
    const objImagem = {
        largura: info.width,
        altura: info.height
    };
    objImagem.path = path;
    // console.log('', objImagem);
    return objImagem;
};

const criarArquivos = (imageSharp, usuario, nomeArquivoSemExtensao, preview, web, impressao, cb) => {
    Async.parallel({
        preview: (callback2) => {
            imageSharp.clone().resize(120, 120).max()
                .jpeg({ quality: 50, progressive: true })
                .toFile(preview.path, (err, info) => {
                    if (err) console.log(err);
                    if (info) {
                        const arquivo = transformInObjImage(info, preview.pathPublic);
                        callback2(null, arquivo);
                    };
                })
        },
        vWeb: (callback2) => {
            imageSharp.clone().resize(2000, 2000).max()
                .jpeg({ quality: 70, progressive: true })
                .toFile(web.path, (err, info) => {
                    if (err) console.log(err);
                    if (info) {
                        const arquivo = transformInObjImage(info, web.pathPublic);
                        callback2(null, arquivo);
                    }
                })
        },
        vImpressao: (callback2) => {
            imageSharp.clone()
                .jpeg()
                .toFile(impressao.path, (err, info) => {
                    if (err) console.log(err);
                    if (info) {
                        const arquivo = transformInObjImage(info, impressao.pathPublic);
                        callback2(null, arquivo);
                    }
                })
        }
    }, (error, results) => {
        const imagem = {
            titulo: nomeArquivoSemExtensao,
            usuarioParRef: usuario,
            preview: results.preview,
            vWeb: results.vWeb,
            vImpressao: results.vImpressao
        }
        cb(null, imagem);
    });
}

const deletaArquivos = (caminho, imagem, cb) => {
    Async.parallel({
        preview: (cb2) => {
            fs.unlink(caminho + imagem.preview.path, err => {
                if (err) {
                    cb2(err, ['[Arquivo Deletado]:', imagem.preview.path]);
                }
                cb2(null, ['[Arquivo Deletado]:', imagem.preview.path]);
            });
        },
        vWeb: (cb2) => {
            fs.unlink(caminho + imagem.vWeb.path, err => {
                if (err) {
                    cb2(err, ['[Arquivo Deletado]:', imagem.vImpressao.path]);
                }
                cb2(err, ['[Arquivo Deletado]:', imagem.vWeb.path]);
            });
        },
        vImpressao: (cb2) => {
            fs.unlink(caminho + imagem.vImpressao.path, err => {
                if (err) {
                    cb2(err, ['[Arquivo Deletado]:', imagem.vImpressao.path]);
                }
                cb2(null, ['[Arquivo Deletado]:', imagem.vImpressao.path]);
            });
        },
        deletarOne: (cb2) => {
            model.deleteOne({ _id: imagem._id }).then(
                sucesso => {
                    cb2(null, ['Delete DB sucesso', sucesso]);
                },
                err => {
                    cb2(err, ['Delete DB err', err]);
                }
            );
        }
    }, (err, results) => {
        if (err) {
            console.log('erro', err)
            cb(err, null)
        }
        if (results) {
            console.log('results', results)
            cb(null, results);
        }
    })
}

module.exports = api;