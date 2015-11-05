import React from "react"
import io from "socket.io-client"
import {fromJS} from "immutable"
import TextInput from "./TextInput"
import NameInput from "./NameInput"
import MessagesList from "./MessagesList"

export default React.createClass({
  handleNewMsg: function(msg) {
    var props = this.props.data
    this.setProps(
      {data: props.updateIn(["messages"],
                         function(oldVal) {
                           return oldVal.push(fromJS(msg))
                            })
      })
  },
  loadMessages: function() {
    const socket = io("localhost:8090")
    var props = this.props.data
    this.setProps({data: props.setIn(["socket"], socket)})
    socket.on("messages", this.handleIncomingMessages)
    socket.emit("messages", {})
    socket.on("add", this.handleNewMsg)
  },
  setUser: function(name) {
    var props = this.props.data
    this.setProps({data: props.setIn(["name"], name)})   
  },
  handleIncomingMessages: function(data)  {
    var props = this.props.data
    this.setProps({data: props.setIn(["messages"], fromJS(data))})
  },
  componentDidMount: function() {
    this.loadMessages()
  },
  createInputElement: function() {
    var username = this.props.data.getIn(["name"])
    if(username === "") {
      return React.createElement(NameInput, {data: this.props.data.name,
                                             setUser: this.setUser})
    } else {
      return React.createElement(TextInput, {data: this.props.data})
    }
  },
  render: function() {
    var messagesList = React.createElement(MessagesList, {messages: this.props.data.get("messages")})
    var textinput = this.createInputElement();
    return React.DOM.div(null,  messagesList, textinput)
  }
});
