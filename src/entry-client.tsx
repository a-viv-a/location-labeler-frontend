// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";
import { asyncClientEntryHook } from "./components/AuthProvider";

asyncClientEntryHook()

mount(() => <StartClient />, document.getElementById("app")!);
