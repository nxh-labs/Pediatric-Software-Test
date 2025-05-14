import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { EventProvider } from "domain-eventrix/react";

createRoot(document.getElementById("root")!).render(
   <>
      <EventProvider eventBusKey={"PediatricAppEventBus"}>
         <App />
      </EventProvider>
   </>
);
