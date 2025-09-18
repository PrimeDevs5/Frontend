import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { DocumentViewer } from './pages/DocumentViewer';
import { Layout } from './components/layout/Layout';
export function App() {
  return <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout>
              <Landing />
            </Layout>} />
        <Route path="/dashboard" element={<Layout>
              <Dashboard />
            </Layout>} />
        <Route path="/document/:id" element={<Layout>
              <DocumentViewer />
            </Layout>} />
      </Routes>
    </BrowserRouter>;
}