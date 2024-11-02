import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";

export default function NotFound() {
  return (
    <>
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <h1>Page Not Found</h1>
      <p>
        If this seems like a bug, please open an issue on github or mention me (aviva.gay) on bluesky.
      </p>
    </>
  );
}
