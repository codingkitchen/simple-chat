import React from "react"

export default React.createClass({
  render: function() {
    var messages = this.props.messages
    var msgElements = messages.map(createListElement)

    function createListElement(msg) {

      return React.DOM.li({className: "msg-element"}, msg.get("name")+ " : " + msg.get("text"))
    }

    return React.DOM.ol({className: "msg-list"}, msgElements)
  }
})
