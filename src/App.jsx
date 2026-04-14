import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CustomersPage from './pages/CustomersPage';
import TrainingsPage from './pages/TrainingsPage';

function App() {
  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/customers" />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/trainings" element={<TrainingsPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;