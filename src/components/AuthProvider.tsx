import { children, createContext, createResource, onMount, ParentComponent, Suspense, useContext } from "solid-js"
import type { BrowserOAuthClient } from "@atproto/oauth-client-browser";
import clientMetadata from "./client-metadata.json"
import { createStore } from "solid-js/store";

const [auth, setAuth] = createStore<{
  init: ReturnType<InstanceType<typeof BrowserOAuthClient>['init']> | null
}>({
  init: null
})

let client: BrowserOAuthClient | null = null

export const asyncClientEntryHook = async () => {
  if (client !== null) {
    throw new Error("client entry hook called twice")
  }
  const BrowserOAuthClient = (await import("@atproto/oauth-client-browser")).BrowserOAuthClient
  client = new BrowserOAuthClient({
    // @ts-expect-error some weird typing issue...
    clientMetadata,
    // TODO: explore hosting something for this in a worker function within this repo?
    handleResolver: "https://bsky.social"
  })
  setAuth({
    init: client.init()
  })
}

export const triggerSignIn = async (handle: string) => {
  if (client === null) {
    throw new Error('tried to trigger sign in before the client was initialized')
  }

  try {
    await client.signIn(handle, {
      /**
       * copied from atproto source:
       *
       * - "none" will only be allowed if the user already allowed the client on the same device
       * - "login" will force the user to login again, unless he very recently logged in
       * - "consent" will force the user to consent again
       * - "select_account" will force the user to select an account
       */
      prompt: 'login',
      // TODO: abort controller signal
    })
  } catch (err) {
    if (err instanceof Error) {
      return err
    }
    throw err
  }
  throw new Error("unreachable")
}

const AuthContext = createContext(auth)

export const AuthProvider: ParentComponent = (props) => {
  return <Suspense fallback={<progress />}><AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider></Suspense>
}

export const useAuth = () => useContext(AuthContext)

export const useAuthInit = () => {
  const auth = useAuth()
  const [initResource] = createResource(() => auth.init, async (init) => {
    if (init === null) {
      // don't do anything, wait for init to not be null
      console.log("init was null, stalling...")
      await new Promise(() => {})
      throw new Error('unreachable')
    }
    console.log(init)
    console.log("awaiting init...")
    return await init
  })

  return initResource
}
