import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./components/DarkMode/DarkToggle.css";
import { FavouritesProvider } from "./context/FavouritesContext";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>   
            <FavouritesProvider>
                <App />
            </FavouritesProvider>
        </BrowserRouter>    
    </React.StrictMode>
);
