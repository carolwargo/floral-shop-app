import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Welcome to Floral Shop</h1>} />
      </Routes>
    </Router>
  );
}

export default App;