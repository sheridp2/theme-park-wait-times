import React, { Component } from "react";
import Parks from "./components/Parks";
import Container from "@material-ui/core/Container";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Container>
          <Parks />
        </Container>
      </div>
    );
  }
}

export default App;
