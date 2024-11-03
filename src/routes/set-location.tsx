import { Title } from "@solidjs/meta";
import { batch, createSignal, Match, Show, Switch } from "solid-js";


export default function SetLocation() {
  const [error, setError] = createSignal<GeolocationPositionError | null>(null);
  const [position, setPosition] = createSignal<GeolocationPosition | null>(null);

  const onClick = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      batch(() => {
        setError(null)
        setPosition(position);
      })
    }, (error) => {
      setError(error);
    }, {
      enableHighAccuracy: true
    });
  };

  return (
    <>
      <Title>Set Location</Title>
      <h1>Set Location</h1>
      <Show when={error()}>
        <article>
          <h2>Geolocation Error</h2>
          <Switch fallback={<p>Unknown error occoured, code <code>{error()?.code}</code> with message <code>{error()?.message}</code></p>}>
            <Match when={error()?.code === GeolocationPositionError['PERMISSION_DENIED']}>
              Location labeler needs permission to access your location to automatically assign you a label.
            </Match>
            <Match when={error()?.code === GeolocationPositionError['POSITION_UNAVAILABLE']}>
              Your position appears to be unavailable.
            </Match>
            <Match when={error()?.code === GeolocationPositionError['TIMEOUT']}>
              Timed out while trying to read your location.
            </Match>
          </Switch>
        <hr/>
          If you don't want to provide your precise location, or if your device does not support geolocation, you can also <a href="/set-location-manual">manually enter it</a>.
        </article>
      </Show>
      <Show when={position()}>
        <article><p>recieved {position()?.coords.latitude} lat, {position()?.coords.longitude} lon, forwarding with JWT token to labeler service...</p><progress/></article>
      </Show>
      <article>
        <p>yummy data</p>
        <button style="width: 100%" onClick={onClick}>read location</button>
      </article>
    </>
  );
}
