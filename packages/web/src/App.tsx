import { useState, useEffect } from 'react'
import { APIResponse } from 'shared-types';

function App() {
  const [data, setData] = useState<APIResponse | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/api')
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div>
      <h1>{data?.message}</h1>
    </div>
  )
}

export default App
