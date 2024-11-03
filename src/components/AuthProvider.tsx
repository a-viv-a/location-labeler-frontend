import { children, createContext, onMount, ParentComponent, Suspense, useContext } from "solid-js"
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
      prompt: 'none',
      // TODO: abort controller signal
    })

    throw new Error("unreachable")
  } catch (err) {
    // user went back!
  }
}

const AuthContext = createContext(auth)

export const AuthProvider: ParentComponent = (props) => {
  return <Suspense fallback={<progress />}><AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider></Suspense>
}

export const useAuth = () => useContext(AuthContext)
