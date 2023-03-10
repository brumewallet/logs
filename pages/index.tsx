import { ResultInit, useFetch, useQuery } from "@hazae41/xswr"
import { OppositeTextButton, OppositeTextButtonRounded } from "../components/buttons/button"

async function fetchJsonResult<T>(url: string) {
  const res = await fetch(url)

  if (!res.ok) {
    const error = new Error(await res.text())
    return { error }
  }

  const result = await res.json() as ResultInit<T>

  if ("error" in result) {
    return { error: result.error }
  }

  return { data: result.data }
}

interface Log {
  created_at: string,
  ip: string,
  method: string,
  endpoint: string
}

function useLogs() {
  const query = useQuery<Log[]>(`/api/logs`, fetchJsonResult)
  useFetch(query)
  // useInterval(query, 1000)
  return query
}

async function fetchText(url: string) {
  const res = await fetch(url)

  if (!res.ok) {
    const error = new Error(await res.text())
    return { error }
  }

  return { data: await res.text() }
}

function useMyIP() {
  const query = useQuery<string>(`https://icanhazip.com/`, fetchText)
  useFetch(query)
  return query
}

export default function Home() {
  const myip = useMyIP()
  const logs = useLogs()

  console.log(myip.data)

  const LogSubrow = (title: string, text: string, style = "") =>
    <div className="flex gap-2">
      <span className="text-gray-500">
        {title}
      </span>
      <span className={style}>
        {text}
      </span>
    </div>


  const checkTorLog = (log: Log) => {
    return log.ip !== myip.data
  }

  const checkOtherLog = (log: Log) => {
    return log.ip === myip.data
  }

  const LogsDisplay =
    <div className="flex items-start justify-center gap-[100px]">
      <div className="flex flex-col items-center gap-2">
        <span className="text-3xl text-colored">
          Lunar requests
        </span>
        <div className="my-2" />
        {logs.data?.filter(checkTorLog).map(log =>
          <div key={log.created_at} className="p-4 flex items-start border rounded-xl bg-component border border-default w-[400px]">
            <div className="flex flex-col">
              {LogSubrow("Time", new Date(log.created_at).toLocaleString())}
              {LogSubrow("IP Address", log.ip, "text-green-500")}
              {LogSubrow("RPC Method", log.method)}
              {LogSubrow("Endpoint", log.endpoint)}
            </div>
            <div className="grow" />
            <a
              href={`https://metrics.torproject.org/rs.html#search/${log.ip}`}
              target="_blank" rel="noopener noreferrer">
              <OppositeTextButtonRounded>
                <img className="icon-md"
                  src="tor.svg" alt="tor-logo" />
              </OppositeTextButtonRounded>
            </a>
          </div>)}
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-3xl text-colored">
          Other wallet requests
        </span>
        <div className="my-2" />
        {logs.data?.filter(checkOtherLog).map(log =>
          <div key={log.created_at} className="p-4 flex items-start border rounded-xl bg-component border border-default w-[400px]">
            <div className="flex flex-col">
              {LogSubrow("Time", new Date(log.created_at).toLocaleString())}
              {LogSubrow("IP Address", log.ip, "text-red-500")}
              {LogSubrow("RPC Method", log.method)}
              {LogSubrow("Endpoint", log.endpoint)}
            </div>
            <div className="grow" />
            <a
              href="https://www.iplocation.net/"
              target="_blank" rel="noopener noreferrer">
              <OppositeTextButtonRounded>
                <img className="icon-md"
                  src="ip.png" alt="My-ip" />
              </OppositeTextButtonRounded>
            </a>
          </div>)}
      </div>
    </div>


  const RefreshButton =
    <div className="flex items-center justify-center">
      <OppositeTextButton className="w-[200px]"
        onClick={() => logs.refetch()}>
        <span className="text-3xl">
          {logs.loading
            ? "Loading..."
            : "Refresh"}
        </span>
      </OppositeTextButton>
    </div>

  const Header = <div className="flex flex-col items-center">
    <div className="flex justify-center items-center gap-4">
      <span className="text-5xl text-center text-colored">
        Lunar Wallet
      </span>
      <img className="icon-3xl"
        src="logo.svg" alt="logo" />
    </div>
    <div className="h-2" />
    <span className="text-xl text-contrast">{"Don't trust, verify!"}</span>
  </div>


  return <div className="p-4 bg-default">
    {Header}
    <div className="h-10" />
    {RefreshButton}
    <div className="h-20" />
    {LogsDisplay}
  </div>
}
