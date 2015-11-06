import React from "react"
import {Map, Set} from "immutable"
import App from "./components/App"

var data = {data: Map({
  messages: Set(),
   name: ""
  }
 )
}

React.render(
  React.createElement(App, data),
  document.getElementById("app")
)
