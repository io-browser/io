import { HashRouter, Routes, Route } from 'react-router-dom';
import History from './components/history';

import './index.css'
import Layout from './components/layout';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route index element={<Layout />} />
        <Route path="history" element={<History />} />
        <Route path="*" element={<div>Not Found 404</div>} />
      </Routes>
    </HashRouter>
  )
}

export default App