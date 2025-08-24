import logo from './logo.svg';
import './App.css';
import MovieDetails from './moviesDetails';
import Index from './movies';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <Router >
    <div >
      <Routes>
   <Route path="/" element={<Index />} />
   <Route path="/movie/:id" element={<MovieDetails />} />
    </Routes>
    </div>
    </Router>
  );
}

export default App;
