import Amplify from 'aws-amplify';
import './App.css';
import awsconfig from './aws-exports';
import Map from './components/Map';
Amplify.configure(awsconfig);

function App() {


  return (
    <div className="App">
      <Map />
    </div>
  );
}

export default App;
