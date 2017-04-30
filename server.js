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
var IP = config.IP;
var PORT = config.PORT;

// Importando los Handlers
var handlers = require('./internals/handlers');

// Importo la funcionalidad del servidor estico
var staticServer = require('./internals/static-server');

// Establecer el tema de colors
colors.setTheme(config.color_theme);

// Creando el server
var server = http.createServer(function(req, res){
    // Logenado la peticion
    console.log(`> Peticion entrante: ${req.url}`.data);
    // Variable que almacenara la ruta absoluta
    // del archivo a ser servido
    
    // Verificando si la url corresponde
    // a un comando de mi API
    if(typeof(handlers[req.url]) == 'function'){
        // Existe el manejador en mi API
        // Entonces Mando a ejecutar el
        // Manejador con los parametros que pide
        handlers[req.url](req, res);
    }else{
        // No existe el Manejador en mi
        // API
        // Entonces Intento servir la url
        // como un recurso estatico
        staticServer.serve(req, res);
    }
});

// Poniendo en ejecucion el server
server.listen(PORT, IP, function(){
    console.log(
    `> Server escuchando en http://${IP}:${PORT}`.info)
});