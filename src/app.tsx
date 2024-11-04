import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./pico.violet.min.css"
import { AuthProvider } from "./components/AuthProvider";

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <nav>
            <ul>
              <li><strong>Locate</strong></li>
            </ul>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/set-location">Set Location</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="https://github.com/a-viv-a/location-labeler-frontend">Github</a></li>
            </ul>
          </nav>
          <AuthProvider>{props.children}</AuthProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
