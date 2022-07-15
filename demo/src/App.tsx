import React from 'react';
import QrScanner, { Nimiq } from '@Evellior/react-qr-scanner'
import './App.css';

function App() {
  const [url, setUrl] = React.useState<string>();
  
  const handleDecode = (result: Nimiq.ScanResult) => {
    setUrl(result.data)
  }

  return (
    <div className="App">
        <p>
          Result: {url ?? "No code found."}
        </p>
      <QrScanner containerStyle={{}} highlightScanRegion={true} highlightCodeOutline={true} onDecode={handleDecode} onDecodeError={() => setUrl(undefined)} />
    </div>
  );
}

export default App;
