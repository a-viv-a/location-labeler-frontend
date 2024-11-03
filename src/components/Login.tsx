import { Component, createSignal } from "solid-js";

// language copied from https://github.com/bluesky-social/cookbook/blob/main/python-oauth-web-app/
const SignIn: Component = () => {
  const [username, setUsername] = createSignal("")

  return <article>
    <h3>Login with atproto</h3>
    <form onSubmit={(e) => {
      e.preventDefault()

      console.log(username())
    }}>
      <p>Provide your handle or DID to authorize an existing account with PDS.
        <br />You can also supply a PDS/entryway URL (eg, <code>https://pds.example.com</code>).</p>
      <fieldset role="group">
        <input name="username" id="username" placeholder="handle.example.com" style="font-family: monospace,monospace;" required={true} onInput={(e) => setUsername(e.target.value)} />
        <input type="submit" value="Login" />
      </fieldset>
    </form>
  </article>
}
export default SignIn
