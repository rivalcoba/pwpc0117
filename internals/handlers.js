var staticServer = require("./static-server");
// Cargando una libreria que
// permite parsear la informacion
// de fomrularios
var querystring = require('querystring');

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
        req.on("end",function(){
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
            res.write('<ul>');
            for(var key in data){
                if(data.hasOwnProperty(key)){
                    res.write(
                        `<li>${key.toString().toUpperCase()} : ${data[key]}</li>`
                    );
                }
            }
            // cierro la ul y la conexion
            res.end('</ul>');
        });

    }else{
        // Se sirve el index.html
        staticServer.serve(req, res);
    }
}

// Exportando Manejadores
var handlers = {};

handlers["/"] = getPostRoot;
handlers["/getauthorinfo"] = getAuthorInfo;
handlers["/getservername"] = getServerName;

module.exports = handlers;