import React from "react"

export default React.createClass({
  render: function() {
    var messages = this.props.messages.reverse()
    var msgElements = messages.map(createListElement)

    function createListElement(msg) {
      var nameElement = React.DOM.small({className: "msg-name"}, msg.get("name"))
      var textElement = React.DOM.p({className: "msg-text"}, nameElement, " : " + msg.get("text"))
      return React.DOM.li({className: "msg"}, textElement)
    }

    return React.DOM.ol({id: "msg-list"}, msgElements)
  }
})
