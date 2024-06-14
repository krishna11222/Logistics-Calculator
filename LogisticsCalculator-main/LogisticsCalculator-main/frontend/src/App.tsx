import React from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { BrowserRouter as Router } from 'react-router-dom';
import Routing from './routes/Routing';

const App = () => {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routing />
        <Footer />
      </Router>
    </div>
  );
}

export default App;