import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { ErrorBoundary } from "./components/errorBoundary";
import { ThemeProvider } from "./theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Layout } from "./components/layout/Layout";
import { Gallery } from "./pages/Gallery";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Layout>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <ErrorBoundary>
                    <Gallery />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/detailed/:id"
                element={<ErrorBoundary>item</ErrorBoundary>}
              />
            </Routes>
          </Router>
        </Layout>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
