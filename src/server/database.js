var redis = require("redis")
var REDIS_HOST = process.env.REDIS_PORT_6379_TCP_ADDR || "127.0.0.1"
var REDIS_PORT = process.env.REDIS_PORT_6379_TCP_PORT || "6379"

var client = redis.createClient(parseInt(REDIS_PORT), REDIS_HOST)

function getMessages(callback) {
  client.lrange("messages", 0, -1, onReply)

  function onReply(err, reply) {
    if(err) {
      return callback(err)
    }
    return callback(null, reply)
  }
}

function storeMessage(msg, callback) {
  client.rpush(["messages", msg], onReply)
  
  function onReply(err, reply) {
    if(err) {
      return callback(err)
    }
    return callback(null, reply)
  }
}

function init() {
  client.on("connect", onRedisConnect)
  client.del("messages", onDelete)
  client.rpush(["messages", "Hallo Dezernat16"], onReply)

  function onReply(err, reply) {
    console.log("Initial commit:", reply)
  }
  
  function onDelete(err, reply) {
    console.log("Initial delete:", reply)
  }
 
  
}

function onRedisConnect() {
  console.log("Redis channel opend to ", REDIS_HOST, "on port" , REDIS_PORT)
}


module.exports = {
  init: init,
  storeMessage: storeMessage,
  getMessages, getMessages
}
