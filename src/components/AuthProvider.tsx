import { children, createContext, onMount, ParentComponent, Suspense, useContext } from "solid-js"
import type { BrowserOAuthClient } from "@atproto/oauth-client-browser";
import clientMetadata from "../../public/client-metadata.json"
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
    // @ts-expect-error weird type issue, whatever
    clientMetadata
  })
  setAuth({
    init: client.init()
  })
}

const AuthContext = createContext(auth)

export const AuthProvider: ParentComponent = (props) => {
  return <Suspense fallback={<progress />}><AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider></Suspense>
}

export const useAuth = () => useContext(AuthContext)
