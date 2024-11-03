import { Title } from "@solidjs/meta";
import Login from "~/components/Login";

export default function Home() {
  return (
    <main>
      <Title>Bluesky Location Labeler</Title>
      <h1>Location Labeler</h1>
      <p>
        words about things
      </p>
      <Login />
    </main>
  );
}
