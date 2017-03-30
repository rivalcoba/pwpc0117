// Funcionalidad de servidor estatico

// Cargando dependecias
var fs = require('fs'),
    mime = require('mime'),
    path = require('path'),
    config = require('../config/config');

// Exportado funcionalidad de
// servidor estatico
exports.serve = function(req, res){
    var resourcePath;
    if(req.url == "/"){
        // El cliente no especifica
        // recurso
        resourcePath = path.resolve('./static/index.html');
    }else{
        // Obteniendo la ruta
        // absoluta del recurso que se desea
        // servir
        resourcePath = 
        path.resolve(config.STATIC_PATH + req.url);
    }
    console.log(`> Recurso solicitado: ${resourcePath}`.data);
    // Extrayendo la extension de la url solicitada
    var extName = path.extname(resourcePath);
    // Creando la variable content-type
    var contentType = mime.lookup(extName);
    // todo: verificar la exitencia del recurso
    fs.exists(resourcePath, function(exists){
        if(exists){
            console.log('> Recursos existe...'.info);
            // El recurso existe y se 
            // intentara leer
            fs.readFile(resourcePath, function(err, content){
                // Verficio si hubo un error
                // en la lectura del archivo
                if(err){
                    console.log('> Error en lectura de recurso'.error);
                    // Hubo error de lectura
                    res.writeHead(500,{
                        'Content-Type':'text/html'
                    });
                    res.end('<h1>500: Error Interno<h1>');
                }else{
                    console.log(`> Se despacha recurso: ${resourcePath}`.info);
                    // No hubo error
                    // Se envia el contenido al cliente
                    res.writeHead(200,{
                        'Content-Type': contentType,
                        'Server' : 'ITGAM@0.0.1'
                    });
                    res.end(content,'utf-8');
                }
            });
        }else{
            // El recurso no existe
            console.log('> El recurso solicitado no fue encontrado...'.info);
            res.writeHead(404,{
                'Content-Type' : 'text/html',
                'Server' : 'ITGAM@0.0.1'
            });
            res.end('<h1>404: Not Found</h1>');
        }
    });    
};
