import { Accessor } from "solid-js"

export const narrow = <A, B extends A>(accessor: Accessor<A>, guard: (v: A) => v is B): B | null => {
  const val = accessor()
  if (guard(val)) {
    return val
  }
  return null
}

/**
use `return await forever()` to tell TS reachability analysis that code beyond cannot be executed, but the function will not progress to return a value.

Only really useful in the context of canceling a promise... TODO: figure out if this "leaks" promises inside solidjs async handling 
*/
export const forever = async (): Promise<never> => {
  await new Promise(() => {})
  throw new Error('unreachable')
}
