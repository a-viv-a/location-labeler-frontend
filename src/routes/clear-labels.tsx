import { Title } from "@solidjs/meta";
import { Accessor, batch, Component, createEffect, createResource, createSignal, Match, Show, Suspense, Switch } from "solid-js";
import { getJwtToken, useAuthInit } from "~/components/AuthProvider";
import { narrow } from "~/util";

type ClearLabelsResponseJson = {
  msg: string,
  negatedCount: number
}

// const ShowReqSuccess: Component<{ success: RequestLabelSuccessResponse }> = props => {
//   return <>
//     <h2>Success! ({props.success.msg})</h2>
//     You have been assigned <code>{props.success.labelDefinition.en_locale_name}</code> which represents the location of {props.success.labelDefinition.en_locale_desc} and is identified by <code>{props.success.labelDefinition.identifier}</code>, an ascii encoding of the openstreetmaps <code>type-id-category</code>
//     <br />
//     Your estimated distance in miles based on IP from the location your device reported is {props.success.estimatedDistanceMiles}.
//   </>
// }
// const ShowReqError: Component<{ error: RequestLabelErrorResponse }> = props => {
//   return <>
//     <h2>Error!</h2>
//     Error: {props.error.error}
//     <Show when={props.error.estimatedDistanceMiles}>{estimatedDistanceMiles =>
//       <p>Your estimated distance in miles based on IP from the location your device reported is {estimatedDistanceMiles()}</p>
//     }</Show>
//   </>
// }

export default function ClearLabels() {
  const authInit = useAuthInit();
  const [clear, setClear] = createSignal(false)

  const [clearResult] = createResource(() => [authInit(), clear()] as const, async ([authInit, shouldClear]) => {
    if (shouldClear === false || authInit === undefined) {
      return undefined
    }
    let jwtToken = await getJwtToken(authInit)
    console.log({ jwtToken })
    let resp = await fetch(`https://location-labeler.aviva.gay/api/clear-labels`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${jwtToken}` }
    })
    return await resp.json() as ClearLabelsResponseJson
  })

  return (
    <>
      <Title>Clear Labels</Title>
      <h1>Clear Labels</h1>
      <article>
        {/* this is... not a good way to handle it! assumes we only do suspense for a request*/}
        <Suspense fallback={<>
          <p>forwarding clear request with JWT token to labeler service...</p>
          <progress />
        </>}>
        <Show when={clearResult()} fallback={
          <button onClick={() => {
            setClear(true)
          }}>clear all applied labels</button>
        }>{clearResult => <>
          <h2>Cleared!</h2>
          All {clearResult().negatedCount} labels have been cleared (negated).
          <br />
          <code>{clearResult().msg}</code>
        </>}</Show>
        </Suspense>
      </article>
    </>
  );
}
