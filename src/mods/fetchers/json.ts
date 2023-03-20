import { DataInit, ErrorInit, Result, ResultInit } from "@hazae41/xswr"

export async function fetchJson<T>(url: string) {
  const res = await fetch(url)

  if (!res.ok) {
    const error = new Error(await res.text())
    return { error } as ErrorInit
  }

  return { data: await res.json() as T } as DataInit<T>
}

export async function fetchJsonResult<T>(url: string) {
  const result = Result.from(await fetchJson<ResultInit<T>>(url))
  return result.tryMapSync(inner => Result.from(inner).unwrap())
}