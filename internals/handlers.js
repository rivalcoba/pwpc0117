var staticServer = require("./static-server");
// Cargando una libreria que
// permite parsear la informacion
// de fomrularios
var querystring = require('querystring');

// Base de datos
var bodega = require('./bodega.js');
//import {bodega} from './bodega.js';


// Arhivo que contiene los
// manejadores correspondiente
// al "api" de mi aplicacion
var author = {
    "name" : "Ivan Rivalcoba",
    "department" : "Computers and Systems",
    "university" : "TecNM - ITGAM"
};

// Declaracion de Manejadores
var getAuthorInfo = function (req, res) {
    // Estableciendo el mime apropiado
    // para dar a conocer al navegador
    // que se enviara un json
    res.writeHead(200, {
        "Content-Type" : "application/json"
    });
    
    // Serializar la respuesta
    var jsonResponse = JSON.stringify(author);
    res.end(jsonResponse);
}

var getServerName = function (req, res) {
    console.log('> Respondiendo nombre del server ...');
    res.end('> Servidor Halcones Peregrinos');
}

var getPostRoot = function(req, res){
    // Viendo el tipo de peticion
    if(req.method === "POST")
    {
        // Procesar un formulario
        var postData = "";

        // Create a listener
        // event driven programming
        // Creando un listener ante 
        // la llegada de datos
        req.on("data", function(dataChunk){
            postData += dataChunk;
            // Agregando seguridad al asunto
            if(postData.length > 1e6){
                // Destruir la conexion
                console.log("> Actividad maliciosa detectada por parte de un cliente");
                req.connection.destroy();
            }
        });

        // Registrando otro listener ante un cierre
        // de conexion
        req.on("end", function(){
            // Rescatar los datos recibidos
            // del cliente
            console.log(`> Data Received: ${postData}`.data);
            var data = querystring.parse(postData);

            // Replicar los datos recibidos
            res.writeHead(200,{
                'Content-Type':'text/html'
            });

            // Respondiendo con una replica de los
            // Datos recibidos
            res.write("<h1>Datos Recibidos</h1>");
            res.write("<h2>Datos Crudos</h2>");
            res.write(`<p>Datos sin parsear: ${postData}</p>`);
            res.write("<h2>Datos como Objeto</h2>");
            res.write(`<p>${typeof(data)}</p>`);
            res.write(`<p>${typeof(data.hasOwnProperty)}</p>`);
            res.write("<h2>Datos Parseados</h2>");
            res.write('<ul>');
            for(var key in data){
                // if(data.hasOwnProperty(key)){
                // }
                    res.write(
                        `<li>${key.toString().toUpperCase()} : ${data[key]}</li>`
                    );
            }
            // cierro la ul y la conexion
            res.end('</ul>');
        });

    }else{
        console.log("> Se solicita raiz con GET".red);
        // Se sirve el index.html
        staticServer.serve(req, res);
    }
}

var saveItem = (req, res)=>{
    if(req.method == "POST"){
        console.log("> Peticion POST");
        var postData = "";

        req.on("data", (dataChunk)=>{
            postData += dataChunk;

            if(postData.length > 1e6){
                console.log("> Se supera maxima cantidad de envio en POST...");
                req.connection.destroy();
            }
        });

        req.on("end",()=>{
            console.log(`> Datos Recibidos: ${postData}`.data);
            // Parseando postData
            var data = querystring.parse(postData);
            var item = {
                "_id" : data.sku,
                "name" : data.prodname,
                "brand" : data.brand
            };
            // Salvando Datos en la DB
            bodega.saveItem(item,(err, result)=>{
                if(err){
                    console.log("> Error en la bd");
                    res.end("> ERROR en la base de Datos");
                    throw err;
                }
                console.log(`> resultado: ${JSON.stringify(result)}`.data);
                res.end(JSON.stringify(result));
            });
        });
    }else{
        // Se Asume GET
        console.log("> Se solicita /saveitem".red);
        req.url += '.html';
        // Se sirve el index.html
        staticServer.serve(req, res);
    }
}

// Exportando Manejadores
var handlers = {};

handlers["/"] = getPostRoot;
handlers["/getauthorinfo"] = getAuthorInfo;
handlers["/getservername"] = getServerName;
handlers["/saveitem"] = saveItem;

module.exports = handlers;