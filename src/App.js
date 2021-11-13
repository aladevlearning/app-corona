import './App.css';
import { useState} from "react";
import Map from './components/Map'
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

function App() {


  return (
    <div className="App">
      <header className="App-header">
        Map
      </header>
      <Map/>
    </div>
  );
}

export default App;
