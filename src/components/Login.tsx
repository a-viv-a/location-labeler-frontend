import { Component, createSignal } from "solid-js";
import { triggerSignIn } from "./AuthProvider";

// language copied from https://github.com/bluesky-social/cookbook/blob/main/python-oauth-web-app/
const SignIn: Component = () => {
  const [username, setUsername] = createSignal("")
  const [inProgress, setInProgress] = createSignal(false)
  let input: HTMLInputElement | undefined

  return <article>
    <h3>Login with atproto</h3>
    <form onSubmit={async (e) => {
      e.preventDefault()
      setInProgress(true)
      console.log({ username: username() })
      // this function only returns if something goes wrong
      let error = await triggerSignIn(username())
      setInProgress(false)
      console.error(error)
      if (input !== undefined) {
        input.setCustomValidity(error.message)
        input.reportValidity()
      }
    }}>
      <p>Provide your handle or DID to authorize an existing account with PDS.
        <br />You can also supply a PDS/entryway URL (eg, <code>https://pds.example.com</code>).</p>
      <fieldset role="group" disabled={inProgress()}>
        <input name="username" id="username" placeholder="handle.example.com" style="font-family: monospace,monospace;" required={true} onInput={(e) => {
          if (input !== undefined) {
            input.setCustomValidity('')
          }
          setUsername(e.target.value)
        }} ref={input} />
        <input type="submit" value="Login" />
      </fieldset>
    </form>
  </article>
}
export default SignIn
