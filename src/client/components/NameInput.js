import React from "react"

export default React.createClass({
  getInitialState: function() {
    return {nameText: ""}
  },
  onSetClick: function() {
    var name = this.state.nameText
    this.props.setUser(name)
    this.setState({nameText: ""})
  },
  handleKeyDown: function(e) {
    if(e.which === 13 || e.keyCode === 13) {
      this.onSetClick()
    }
  },
  onTextChange: function(e) {
    this.setState({nameText: e.target.value})
  },
  render: function() {
    var inputElement =  React.DOM.input({
      placeholder: "Wie heißt Du?",
      value: this.state.nameText,
      onKeyDown: this.handleKeyDown,
      onChange: this.onTextChange
    })
    var sendBtn = React.DOM.button(
      {
        onClick: this.onSetClick
      },
      "Setzen")
    return React.DOM.div({className: "input-container"}, inputElement, sendBtn)
  }
});
