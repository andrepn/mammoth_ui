import React from "react";
import logo from "./logo.svg";
import { Counter } from "./features/counter/Counter";
import "./App.css";
import { Pool } from "./features/pool/pool";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Pool />
      </header>
    </div>
  );
}

export default App;
