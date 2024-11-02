import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import "./pico.violet.min.css"

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
              <li><a href="/about">About</a></li>
              <li><a href="/set-location">Set Location</a></li>
              <li><a href="#">Github</a></li>
            </ul>
          </nav>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
