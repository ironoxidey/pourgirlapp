import React, { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CocktailMenu from "./components/CocktailMenu";
import Login from "./components/Login";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cocktailmenu" element={<CocktailMenu />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
