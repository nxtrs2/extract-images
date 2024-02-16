import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ImageGallery from "./pages/ImageGallery";
import AboutPage from "./pages/AboutPage";
import AppLayout from "./components/layout/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="images" element={<ImageGallery />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
