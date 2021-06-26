import React from 'react'
import ReactDom from 'react-dom'
import './index.css'

function Greeting() {
  return (
    <React.Fragment>
      hello
    </React.Fragment>
  );
}

ReactDom.render(<Greeting/>, document.getElementById('root'));