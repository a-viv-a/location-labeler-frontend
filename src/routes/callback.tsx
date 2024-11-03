import { Title } from "@solidjs/meta";
import { createResource, Show, Suspense } from "solid-js";
import { useAuthInit } from "~/components/AuthProvider";

export default function Callback() {
  const init = useAuthInit();

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
        <article>oauth did is {init()?.session.did}</article>
      </Suspense>
    </>
  );
}
