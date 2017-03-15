// Cargar el modulo http
var http = require('http');
// Cargar el modulo fs
var fs = require('fs');
// Cargar el Modulo Path
var path = require('path');
// Cargando colors
var colors = require('colors');
// cargando e modulo mime
var mime = require('mime');

// -- Cargando configuraciones
var config = require("./config/config");

// Establecer el tema de colors
colors.setTheme(config.color_theme);

// Creando el server
var server = http.createServer(function(req, res){
    // Logenado la peticion
    console.log(`> Peticion entrante: ${req.url}`.data);
    // Variable que almacenara la ruta absoluta
    // del archivo a ser servido
    var resourcePath;
    if(req.url == "/"){
        // El cliente no especifica
        // recurso
        resourcePath = './static/index.html';
    }else{
        // El cliente si especifica
        // recurso
        resourcePath = config.STATIC_PATH + req.url;
    }

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
});

// Poniendo en ejecucion el server
server.listen(config.PORT,config.IP,function(){
    console.log(
    `> Server escuchando en http://${config.IP}:${config.PORT}`.info)
});