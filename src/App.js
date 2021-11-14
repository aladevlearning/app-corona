import Amplify from 'aws-amplify';
import './App.css';
import awsconfig from './aws-exports';
import CoronaCentresMap from './components/CoronaCentresMap';
Amplify.configure(awsconfig);

function App() {


  return (
    <div className="App">
      <CoronaCentresMap />
    </div>
  );
}

export default App;
