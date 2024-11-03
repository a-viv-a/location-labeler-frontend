import { Title } from "@solidjs/meta";
import { createResource, Show, Suspense } from "solid-js";
import { useAuth } from "~/components/AuthProvider";

export default function Callback() {
  const auth = useAuth()

  const [init] = createResource(async () => auth.init)

  return (
    <>
      <Title>Callback</Title>
      <h1>Callback</h1>
      <Suspense fallback={
        <article>
          <p>Handling callback...</p>
        <progress />
        </article>
      }>
        <Show when={init() !== null && init !== undefined} fallback={<article>Something went very wrong...</article>}>
          <article><p>DID: {init()?.session.did}</p></article>
        </Show>
      </Suspense>
    </>
  );
}
