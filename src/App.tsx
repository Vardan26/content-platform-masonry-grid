import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { ErrorBoundary } from "./components/errorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ImageProvider } from "./contexts/ImageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Layout } from "./components/layout/Layout";
import { Gallery } from "./pages/Gallery";
import { Detailed } from "./pages/detailed";
import { SearchProvider } from "./contexts/SearchContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ImageProvider>
          <SearchProvider>
            <Router>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Layout>
                      <ErrorBoundary>
                        <Gallery />
                      </ErrorBoundary>
                    </Layout>
                  }
                />
                <Route
                  path="/detailed/:id"
                  element={
                    <Layout>
                      <ErrorBoundary>
                        <Detailed />
                      </ErrorBoundary>
                    </Layout>
                  }
                />
              </Routes>
            </Router>
          </SearchProvider>
        </ImageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
