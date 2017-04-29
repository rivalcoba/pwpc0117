module.exports = {
    "IP" : '127.0.0.1' || process.env.IP,
    "PORT" : 3000 || process.env.PORT,
    "color_theme" : {
        "info" : "rainbow",
        "data" : "green",
        "error" : "red",
        "warning" : "yellow"
    },
    "STATIC_PATH" : "./static",
    "dbStringConnection" : process.env.DB || "mongodb://localhost:27017/bodega"
};