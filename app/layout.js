"use client";
import "react-toastify/dist/ReactToastify.css";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/themes/light.css";
import "react-svg-map/lib/index.css";
import "leaflet/dist/leaflet.css";
import "./scss/app.scss";
import "./ntl.css";
import { Provider } from "react-redux";
import store from "../store";
import { SessionProvider } from "next-auth/react";
export default function RootLayout({ children, session }) {
  return (
    <>
      <html lang="en">
        <head>
          <title>Mượn thiết bị</title>
          <meta name="description" content="Code vui vẻ" />
        </head>
        <body className="font-inter  custom-tippy dashcode-app">
          <SessionProvider session={session}>
            <Provider store={store}>{children}</Provider>
          </SessionProvider>
        </body>
      </html>
    </>
  );
}
