
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import TopHeader from './pages/TopHeader';
import MatchDetails from './pages/MatchDetails';



function App() {
  return (


    <BrowserRouter>
      <TopHeader />
      <Routes>
        <Route path='' element={<Home />} />

        <Route path='/match-details/:Match' element={<MatchDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
