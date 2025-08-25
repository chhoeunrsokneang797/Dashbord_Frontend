import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import DashbordSection from "./pages/dashbord/DashbordSection";
import ProrudctPage from "./pages/product/ProrudctPage";
import Customer from "./pages/customer/Customer";
import HomePage from "./pages/home-page/HomePage";
import AboutPage from "./pages/about-page/AboutPage";
import PageNotFound from "./pages/page-not-found/PageNotFound";
import MainLayoutLogin from "./layout/MainLayoutLogin";
import LoginPage from "./auth/LoginPage";
import ResginterPage from "./auth/ResginterPage";
import ProvincePage from "./pages/province/ProvincePage";
import CategoryPage from "./pages/category/CategoryPage";
import BrandPage from "./pages/category/BrandPage";

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
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/province" element={<ProvincePage />} />
            <Route path="/brand" element={<BrandPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
          <Route element={<MainLayoutLogin />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<ResginterPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
