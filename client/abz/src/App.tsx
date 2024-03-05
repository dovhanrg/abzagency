import React, {useEffect, useState} from 'react';

import './App.css';

function App() {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    fetch('/api/v1/positions').then(data => data.json()).then(console.log);
  }, []);

  return (
    <div className="App">

    </div>
  );
}

export default App;
