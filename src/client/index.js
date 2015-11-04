import React from 'react'
import io from "socket.io-client"
import {Map, Set, fromJS} from "immutable"

var data = {data: Map({messages: Set()})}

var MessagesList = React.createClass({
  render: function() {
    var messages = this.props.messages
    var msgElements = messages.map(createListElement)

    function createListElement(msg) {
      return React.DOM.li({className: "msg-element"}, msg)
    }

    return React.DOM.ul({className: "msg-list"}, msgElements)
  }
})

var TextInput = React.createClass({
  getInitialState: function() {
    return {inputText: ""}
  },
  onSendClick: function() {
    var props = this.props.data
    var socket = props.get("socket")
    socket.emit("add", this.state.inputText)
    this.setState({inputText: ""})
  },
  onTextChange: function(e) {
    this.setState({inputText: e.target.value})
  },
  render: function() {
    var inputElement =  React.DOM.input({
      placeholder: "Write message",
      value: this.state.inputText,
      onChange: this.onTextChange
    })
    var sendBtn = React.DOM.button(
      {
        onClick: this.onSendClick
      },
      "Send")
    return React.DOM.div({className: "input-container"}, inputElement, sendBtn)
  }
});

var simpleChat = React.createClass({
  handleNewMsg: function(msg) {
    var props = this.props.data
    this.setProps(
      {data: props.updateIn(["messages"],
                         function(oldVal) {
                           return oldVal.push(msg)
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
  handleIncomingMessages: function(data)  {
    var props = this.props.data
    this.setProps({data: props.setIn(["messages"], fromJS(data))})
  },
  componentDidMount: function() {
    this.loadMessages()
  },
  render: function() {
    var messagesList = React.createElement(MessagesList, {messages: this.props.data.get("messages")})
    var textinput = React.createElement(TextInput, {data: this.props.data})
    return React.DOM.div(null, messagesList, textinput)
  }
});

React.render(
  React.createElement(simpleChat, data),
  document.getElementById("app")
)

