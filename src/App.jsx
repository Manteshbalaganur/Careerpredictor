// App.jsx
import React from 'react';
import CareerForm from './components/CareerForm';

function App() {
  return (
    <div className="App">
      <header className="p-4 bg-blue-800 text-white text-center">
        <h1 className="text-2xl font-bold">My Career Prediction App</h1>
      </header>
      <main>
        <CareerForm/>
      </main>
    </div>
  );
}

export default App;