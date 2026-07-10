import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import "./index.css";
import App from "./App.tsx";

// Vi retter tit i appen lige nu op til turen, så tjek for en ny version ofte
// (i stedet for kun ved næste normale browser-check), og opdatér automatisk.
const updateSW = registerSW({
  immediate: true,
  onRegisteredSW(_url, registration) {
    if (!registration) return;
    setInterval(() => registration.update(), 60 * 1000);
  },
});
void updateSW;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
