import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./route/MainLayout";
import DashbordSection from "./pages/dashbord/DashbordSection";
import ProrudctPage from "./pages/product/ProrudctPage";
import Customer from "./pages/customer/Customer";
import HomePage from "./pages/home-page/HomePage";
import AboutPage from "./pages/about-page/AboutPage";
import PageNotFound from "./pages/page-not-found/PageNotFound";
import RolePage from "./pages/role/RolePage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/dashbord" element={<DashbordSection />} />
            <Route path="/proudct" element={<ProrudctPage />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/role" element={<RolePage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
