import { getSingleSchema, Result, useFetch, useQuery } from "@hazae41/xswr"
import { OppositeTextButton, OppositeTextButtonRounded } from "../components/buttons/button"

async function fetcher<T>(url: string) {
  const res = await fetch(url)

  if (!res.ok) {
    const error = new Error(await res.text())
    return { error }
  }

  const { data, error } = await res.json() as Result<T>
  return { data, error }
}

interface Log {
  time: string,
  ip: string,
  method: string,
  endpoint: string
}

function getLogsSchema() {
  return getSingleSchema<Log[]>(`/api/logs`, fetcher)
}

function useLogs() {
  const query = useQuery(getLogsSchema, [])
  useFetch(query)
  // useInterval(query, 1000)
  return query
}

export default function Home() {
  const logs = useLogs()

  const LogSubrow = (title: string, text: string, style = "") =>
    <div className="flex gap-2">
      <span className="text-gray-500">
        {title}
      </span>
      <span className={style}>
        {text}
      </span>
    </div>

  const ipArray = [
    "199.249.230.140",
    "2620:7:6001::140",
    "185.16.38.111",
    "104.244.73.85",
    "2605:6400:30:f71c:7d7a:8bf1:dead:beef",
    "5.45.106.207",
    "2a03:4000:6:16f9:b4d0:68ff:feeb:cf35",
    "107.189.12.148",
    "192.42.116.27",
    "2001:67c:6ec:203:218:33ff:fe44:5527",
    "51.15.250.93",
    "185.220.101.62",
    "2a0b:f4c2:2::62",
  ]

  const checkTorLog = (log: Log) => {
    if (ipArray.includes(log.ip)) return true
    return false
  }

  const checkOtherLog = (log: Log) => {
    if (!ipArray.includes(log.ip)) return true
    return false
  }

  const LogsDisplay =
    <div className="flex items-start justify-center gap-[100px]">
      <div className="flex flex-col items-center gap-2">
        <span className="text-3xl text-colored">
          Lunar request
        </span>
        <div className="my-2" />
        {logs.data?.filter(checkTorLog).map(log =>
          <div key={log.time} className="p-4 border rounded-xl bg-component border border-default w-[400px]">
            <a className="absolute left-[600px]"
              href="https://metrics.torproject.org/rs.html#details/A868303126987902D51F2B6F06DD90038C45B119"
              target="_blank" rel="noopener noreferrer">
              <OppositeTextButtonRounded>
                <img className="icon-md"
                  src="tor.svg" alt="tor-logo" />
              </OppositeTextButtonRounded>
            </a>
            {LogSubrow("Time", new Date(log.time).toLocaleString())}
            {LogSubrow("IP Address", log.ip, "text-green-500")}
            {LogSubrow("RPC Method", log.method)}
            {LogSubrow("RPC Endpoint", log.endpoint)}
          </div>)}
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-3xl text-colored">
          Other wallet request
        </span>
        <div className="my-2" />
        {logs.data?.filter(checkOtherLog).map(log =>
          <div key={log.time} className="p-4 border rounded-xl bg-component border border-default w-[400px]">
            <a className="absolute right-[300px]"
              href="https://www.iplocation.net/"
              target="_blank" rel="noopener noreferrer">
              <OppositeTextButtonRounded>
                <img className="icon-md"
                  src="ip.png" alt="My-ip" />
              </OppositeTextButtonRounded>
            </a>
            {LogSubrow("Time", new Date(log.time).toLocaleString())}
            {LogSubrow("IP Address", log.ip, "text-red-500")}
            {LogSubrow("RPC Method", log.method)}
            {LogSubrow("RPC Endpoint", log.endpoint)}
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
