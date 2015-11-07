var redis = require("redis")
var REDIS_URL = process.env.REDIS_URL
var REDIS_HOST = process.env.REDIS_PORT_6379_TCP_ADDR || "127.0.0.1"
var REDIS_PORT = process.env.REDIS_PORT_6379_TCP_PORT || "6379"


/*
 * Connects to Redis server
 * depending on host system
 */
function createRedisClient() {

  if(REDIS_URL) {
    return redis.createClient(REDIS_URL)
  } else {
    return redis.createClient(parseInt(REDIS_PORT), REDIS_HOST)
  }
}

var client = createRedisClient()

/*
 * Retrieves messages from Redis database
 * @param callback callback-fn is retrieve succeeds
 * @return callback applied to reply from database
 */
function getMessages(callback) {
  client.lrange("messages", 0, -1, onReply)

  function onReply(err, reply) {
    if(err) {
      return callback(err)
    }
    return callback(null, reply)
  }
}

/*
 * Stores message in Redis database
 * @param msg: Message to be stored
 * @param callback: callback applied to database reply
 * @return: callback return
 */
function storeMessage(msg, callback) {
  client.rpush(["messages", msg], onReply)

  function onReply(err, reply) {
    if(err) {
      return callback(err)
    }
    return callback(null, reply)
  }
}

/*
 * Initializes Redis database
 */
function init() {
  client.on("connect", onRedisConnect)
  client.del("messages", onDelete)
  client.rpush(["messages", '{"name": "LivelyCode", "text": "Hallo Dezernat16!"}'], onReply)

  function onReply(err, reply) {
    console.log("Initial commit:", reply)
  }

  function onDelete(err, reply) {
    console.log("Initial delete:", reply)
  }


}

/*
 * Displays Redis connecting info
 */
function onRedisConnect() {
  if(REDIS_URL) {
    console.log("Redis channel opened on to HEROKU REDIS ", REDIS_URL)
  } else {
    console.log("Redis channel opened to local ", REDIS_HOST, "on port" , REDIS_PORT)
  }
}


module.exports = {
  init: init,
  storeMessage: storeMessage,
  getMessages: getMessages
}
