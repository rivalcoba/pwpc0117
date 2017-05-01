var config = require("../config/config");
var MongoClient = require("mongodb").MongoClient;

var stringConnection = config.dbStringConnection;
console.log(`> BD: ${stringConnection}`);
// Exportando ES6
exports.saveItem = function(item, cb){
    //Conectando a la base de datos
    MongoClient.connect(stringConnection, function(err, db){
        if(err){
            cb(err, null);
            return;
        }
        // Obteniendo la coleccion
        var itemsCollection = db.collection('items');
        // Inserta el Articulo
        itemsCollection.insertOne(item, function(err, result){
            cb(err, result);
        });
    });
};