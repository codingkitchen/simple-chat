var express = require("express")
var app = express()
var db = require("./database")

/**
 * Starts all server services
 * @param port server port
 * @param staticPath server static path
 */
function startServer(port, staticPath) {
  var server = require('http').createServer(app);
  var io = require("socket.io")(server)
  
  io.on("connection", onSocketConnection)
  
  app.use(express.static(staticPath))
  server.listen(port, onServerStart)
  
  function onServerStart() {
    var host = server.address().address
    var port = server.address().port
    
    console.log('Server listening at http://%s:%s', host, port)
  }

  function onSocketConnection(socket) {
    console.log("Socket opened!")
    
    socket.on("messages", onSocketMessages)
    socket.on("add", onSocketAdd)
    socket.on("disconnect", onSocketDisconnect)

    function onSocketMessages() {
      db.getMessages(onMsgRetrieved)

      function onMsgRetrieved(err, reply) {
        if(err) {
          socket.emit("messages", err)
        } else {
          socket.emit("messages", reply)
        }
      }
    }

    function onSocketAdd(msg) {
      db.storeMessage(msg, onMsgStored)
      
      function onMsgStored(err, reply) {
        if(err) {
          socket.emit("add", err)
        } else {
          socket.emit("add", msg)
          socket.broadcast.emit("add", msg)
        }
      }
    }

    function onSocketDisconnect() {
      console.log("Socket closed!")
    }
  }
}

module.exports = {
  startServer: startServer
}
