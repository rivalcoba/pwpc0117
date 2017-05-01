module.exports = {
    "IP" :  process.env.IP || '0.0.0.0',
    "PORT" : process.env.PORT || 3000,
    "color_theme" : {
        "info" : "rainbow",
        "data" : "green",
        "error" : "red",
        "warning" : "yellow"
    },
    "STATIC_PATH" : "./static",
    "dbStringConnection" : process.env.DB || "mongodb://localhost:27017/bodega"
};
// $env:MyTestVariable = "My temporary test variable."