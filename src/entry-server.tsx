// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="color-scheme" content="light dark" />
          <link rel="icon" href="/favicon.ico" />
          {assets}
        </head>
        <body>
          <main class="container-fluid" id="app">
            {children}
          </main>
          {scripts}
        </body>
      </html>
    )}
  />
));
