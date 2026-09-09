import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { AuthProvider } from "./app/providers/AuthProvider";
import ChatbotWidget from "./shared/components/ChatbotWidget";
import { sprint } from "./shared/constants/sprint";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      {!sprint && <ChatbotWidget />}
    </AuthProvider>
  </React.StrictMode>,
);
 