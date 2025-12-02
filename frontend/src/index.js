import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./AuthContext";
import { RecipientProvider } from "./RecipientContext";
import { OccasionProvider } from "./OccasionContext";
import { ActivityProvider } from "./ActivityContext";
import { SavedGiftsProvider } from "./SavedGiftsContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ActivityProvider>
        <RecipientProvider>
          <OccasionProvider>
            <SavedGiftsProvider>
              <App />
            </SavedGiftsProvider>
          </OccasionProvider>
        </RecipientProvider>
      </ActivityProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
