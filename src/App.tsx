/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddLead from './pages/AddLead';
import LeadDetails from './pages/LeadDetails';
import SetupInstructions from './pages/SetupInstructions';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddLead />} />
        <Route path="/lead/:id" element={<LeadDetails />} />
        <Route path="/setup" element={<SetupInstructions />} />
      </Routes>
    </Router>
  );
}
