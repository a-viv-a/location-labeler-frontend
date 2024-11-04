import { children, createContext, createResource, onMount, ParentComponent, Suspense, useContext } from "solid-js"
import type { BrowserOAuthClient } from "@atproto/oauth-client-browser";
import clientMetadata from "./client-metadata.json"
import { createStore } from "solid-js/store";
import { createServiceJwt } from "@atproto/xrpc-server";
import { Agent } from "@atproto/api";
import { forever } from "~/util";

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

export const getJwtToken = async (from: NonNullable<Awaited<ReturnType<InstanceType<typeof BrowserOAuthClient>['init']>>>) => {
  if (client === null) {
    throw new Error("can't create jwt when client is not initalized")
  }
  const session = await client.restore(from.session.did)

  const agent = new Agent(session)
  // plc:jp6khwtiduqw7y5hm75vh6ve is locate.aviva.gay
  const token = (await agent.call('com.atproto.server.getServiceAuth', {aud: 'did:plc:jp6khwtiduqw7y5hm75vh6ve'})).data.token as string
  return token
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
      return await forever()
    }
    console.log(init)
    console.log("awaiting init...")
    return await init
  })

  return initResource
}
