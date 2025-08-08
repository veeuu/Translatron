import './App.css';
import Form from './components/Form';
import Convert from './components/Convert';
import Home from './components/Home';
import About from './components/About';
import Navbar from './components/Navbar';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Footer from './components/Footer';

function App() {
  return (
    <> 
    
      <Router>
        <Navbar title="Translator" val1="Home" val2="Convertor" val3="Form" val4="About"/>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/convert" element={<Convert />} />
          <Route path="/form" element={<Form />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} /> {/* Default route */}
        </Routes>
        <Footer/>
      </Router>
    </>
  );
}

export default App;