import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { ErrorBoundary } from "./components/errorBoundary";
import { ThemeProvider } from "./theme";
import { Layout } from "./components/layout/Layout";

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Router>
          <Routes>
            <Route path="/" element={<ErrorBoundary>grid</ErrorBoundary>} />
            <Route
              path="/detailed/:id"
              element={<ErrorBoundary>item</ErrorBoundary>}
            />
          </Routes>
        </Router>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
