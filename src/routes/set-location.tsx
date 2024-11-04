import { Title } from "@solidjs/meta";
import { Accessor, batch, Component, createEffect, createResource, createSignal, Match, Show, Suspense, Switch } from "solid-js";
import { getJwtToken, useAuthInit } from "~/components/AuthProvider";
import { forever, narrow } from "~/util";


const ReadLocation: Component<{ onReadLocation: () => void }> = props => <>
  <p>yummy data</p>
  <button onClick={props.onReadLocation}>read location</button>
</>

const ShowError: Component<{ onReadLocation: () => void, error: Accessor<GeolocationPositionError> }> = props => {
  const [count, setCount] = createSignal(1)
  return <>
    <h2>Geolocation Error{count() > 1 ? ` ${count()}x` : ''}</h2>
    <Switch fallback={<p>Unknown error occoured, code <code>{props.error()?.code}</code> with message <code>{props.error()?.message}</code></p>}>
      <Match when={props.error()?.code === GeolocationPositionError['PERMISSION_DENIED']}>
        Location labeler needs permission to access your location to automatically assign you a label.
      </Match>
      <Match when={props.error()?.code === GeolocationPositionError['POSITION_UNAVAILABLE']}>
        Your position appears to be unavailable.
      </Match>
      <Match when={props.error()?.code === GeolocationPositionError['TIMEOUT']}>
        Timed out while trying to read your location.
      </Match>
    </Switch>
    <hr />
    <p>If you don't want to provide your precise location, or if your device does not support geolocation, you can also <a href="/set-location-manual">manually enter it</a>. Otherwise, grant the permission and try again:</p>
    <button class="secondary" onClick={() => {
      props.onReadLocation()
      setCount(c => c + 1)
    }}>try again</button>
  </>
}

// TODO: merge repos or make a package so these types don't drift
type LabelDefinition = {
  /** unique identifier for each label */
  identifier: string,
  /** english localized name */
  en_locale_name: string,
  /** english localized description */
  en_locale_desc: string
}

type RequestLabelErrorResponse = {
  error: string,
  estimatedDistanceMiles?: number
}
type RequestLabelSuccessResponse = {
  msg: string,
  labelDefinition: LabelDefinition,
  estimatedDistanceMiles: number
}
type RequestLabelResponseJson = RequestLabelErrorResponse | RequestLabelSuccessResponse

const ShowReqSuccess: Component<{ success: RequestLabelSuccessResponse }> = props => {
  return <>
    <h2>Success! ({props.success.msg})</h2>
    You have been assigned <code>{props.success.labelDefinition.en_locale_name}</code> which represents the location of {props.success.labelDefinition.en_locale_desc} and is identified by <code>{props.success.labelDefinition.identifier}</code>, an ascii encoding of the openstreetmaps <code>type-id-category</code>
    <br />
    Your estimated distance in miles based on IP from the location your device reported is {props.success.estimatedDistanceMiles}.
  </>
}
const ShowReqError: Component<{ error: RequestLabelErrorResponse }> = props => {
  return <>
    <h2>Error!</h2>
    Error: {props.error.error}
    <Show when={props.error.estimatedDistanceMiles}>{estimatedDistanceMiles =>
      <p>Your estimated distance in miles based on IP from the location your device reported is {estimatedDistanceMiles()}</p>
    }</Show>
  </>
}

export default function SetLocation() {
  const [error, setError] = createSignal<GeolocationPositionError | null>(null);
  const [position, setPosition] = createSignal<GeolocationPosition | null>(null);
  const authInit = useAuthInit();

  const [labelResult] = createResource(() => [authInit(), position()] as const, async ([authInit, position]) => {
    if (position === null || authInit === undefined) {
      return await forever()
    }
    let jwtToken = await getJwtToken(authInit)
    console.log({ jwtToken })
    let { latitude: lat, longitude: lon } = position.coords
    let resp = await fetch(`https://location-labeler.aviva.gay/api/request-label?lat=${lat}?lon=${lon}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${jwtToken}` }
    })
    return await resp.json() as RequestLabelResponseJson
  })

  const onReadLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      batch(() => {
        setError(null)
        setPosition(position);
      })
    }, (error) => {
      batch(() => {
        setError(error)
        setPosition(null);
      })
    }, {
      enableHighAccuracy: true
    });
  };

  return (
    <>
      <Title>Set Location</Title>
      <h1>Set Location</h1>
      <article>
        {/* this is... not a good way to handle it! assumes we only do suspense for a request*/}
        <Suspense fallback={<>
          <p>recieved <code>lat={position()?.coords.latitude}, lon={position()?.coords.longitude}</code>, forwarding with JWT token to labeler service...</p>
          <progress />
        </>}>
          <Switch fallback={<ReadLocation {...{ onReadLocation }} />}>
            <Match when={labelResult()}>{result =>
              <Switch fallback={<>Unknown response:<br /><pre><code>{JSON.stringify(result(), undefined, 4)}</code></pre></>}>
                <Match when={narrow(result, v => 'msg' in v)}>{success =>
                  <ShowReqSuccess success={success()} />
                }</Match>
                <Match when={narrow(result, v => 'error' in v)}>{error =>
                  <ShowReqError error={error()} />
                }</Match>
              </Switch>
            }</Match>
            <Match when={error()}>{error =>
              <ShowError {...{ onReadLocation, error }} />
            }</Match>
          </Switch>
        </Suspense>
      </article>
    </>
  );
}
