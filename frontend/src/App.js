import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.js'
import RestDashboard from './pages/RestDashboard.js';
import RestRegistration from './pages/RestRegistration.js';
import RestLogin from './pages/RestLogin.js';
import ProtectedPages from './components/ProtectedPages.js';
import { Provider, useSelector } from 'react-redux';
import Spinner from './components/Spinner.js';
import store from './redux/store.js';

const App = () => {
  const { loading } = useSelector((state) => state.loader);
  return (
    
      <div>
        {loading && <Spinner />}
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurant-registration" element={<RestRegistration />} />
            <Route path="/restaurant-login" element={<RestLogin />} />
            <Route path="/restaurant-dashboard" element={<ProtectedPages><RestDashboard /></ProtectedPages>} />

          </Routes>
        </Router>
      </div>
  
  );
};

export default App;