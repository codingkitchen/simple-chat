var server = require("./src/server/core")
var db = require("./src/server/database")

var STATIC_PATH = __dirname + "/dist"
var SERVER_PORT = 8090

db.init()
server.startServer(SERVER_PORT, STATIC_PATH)
