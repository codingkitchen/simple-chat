import React from "react"

export default React.createClass({
  getInitialState: function() {
    return {inputText: ""}
  },
  onSendClick: function() {
    var props = this.props.data
    var socket = props.get("socket")
    var name = props.get("name")
    var text = this.state.inputText
    socket.emit("add", {name: name,
                        text: text})
    this.setState({inputText: ""})
  },
  onTextChange: function(e) {
    this.setState({inputText: e.target.value})
    console.log(React.keyCode);
  },
  handleKeyDown: function(event) {
    if(event.which === 13 || event.keyCode === 13) {
      return this.onSendClick()
    }
    return true
  },
  render: function() {
    var inputElement =  React.DOM.input({
      placeholder: "Schreibe eine Nachricht",
      value: this.state.inputText,
      onKeyDown: this.handleKeyDown,
      onChange: this.onTextChange
    })
    var sendBtn = React.DOM.button(
      {
        onClick: this.onSendClick
      },
      "Senden")
    return React.DOM.div({className: "input-container"}, inputElement, sendBtn)
  }
});