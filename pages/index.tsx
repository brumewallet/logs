/* eslint-disable @next/next/no-img-element */
import { useFetch, useInterval, useQuery } from "@hazae41/xswr"
import { OppositeTextButton, OppositeTextButtonRounded } from "../components/buttons/button"
import { fetchJsonResult } from "../src/mods/fetchers/json"
import { fetchText } from "../src/mods/fetchers/text"

export const trimString = (name: string, n: number) => {
  if (name.length <= n) return name
  return name.substring(0, n) + '...'
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
  useInterval(query, 1000)
  return query
}


function useMyIP() {
  const query = useQuery<string>(`https://icanhazip.com/`, fetchText)
  useFetch(query)
  return query
}

export default function Home() {
  const myip = useMyIP()
  const logs = useLogs()

  const LogSubrow = (title: string, text: string, style = "") =>
    <div className="flex gap-2">
      <span className="text-gray-500">
        {title}
      </span>
      <span className={style}>
        {trimString(text, 25)}
      </span>
    </div>

  const LogRow = (log: Log) =>
    <div key={log.created_at} className="p-4 flex items-start border rounded-xl bg-component border-default w-[400px]">
      {LogSubrow("Time", new Date(log.created_at).toLocaleString())}
      {LogSubrow("IP Address", log.ip, "text-red-500")}
      {LogSubrow("RPC Method", log.method)}
      {LogSubrow("Endpoint", log.endpoint)}
      <a className=""
        href="https://www.iplocation.net/"
        target="_blank" rel="noopener noreferrer">
        <OppositeTextButtonRounded>
          <img className="icon-md"
            alt="IP icon"
            src="/ip.png" />
        </OppositeTextButtonRounded>
      </a>
      <a className=""
        href={`https://metrics.torproject.org/rs.html#search/${log.ip}`}
        target="_blank" rel="noopener noreferrer">
        <OppositeTextButtonRounded>
          <img className="icon-md"
            alt="Onion icon"
            src="/tor.svg" />
        </OppositeTextButtonRounded>
      </a>
    </div>

  const Body =
    <div className="flex flex-wrap justify-evenly gap-[100px]">
      <div className="flex flex-col items-center gap-2">
        <span className="text-3xl text-colored">
          {`Requests coming from your IP`}
        </span>
        <div className="my-2" />
        {logs.data
          ?.filter(it => it.ip === myip.data?.trim())
          ?.map(LogRow)}
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-3xl text-colored">
          {`Requests not coming from your IP`}
        </span>
        <div className="my-2" />
        {logs.data
          ?.filter(it => it.ip !== myip.data?.trim())
          ?.map(LogRow)}
      </div>
    </div>

  const RefreshButton =
    <OppositeTextButton className="w-[200px]"
      onClick={() => logs.refetch()}>
      <span className="text-3xl">
        {logs.loading
          ? `Loading...`
          : `Refresh`}
      </span>
    </OppositeTextButton>

  const Toolbar =
    <div className="flex items-center justify-center">
      {RefreshButton}
    </div>

  const Header = <div className="max-w-[600px] m-auto flex flex-col items-center gap-2">
    <div className="flex items-center gap-4">
      <img className="h-[50px] w-auto"
        alt="logo"
        src="/logo.svg" />
      <span className="text-5xl text-colored">
        {`Brume Logs`}
      </span>
    </div>
    <span className="text-xl text-contrast">
      {`Don't trust, verify!`}
    </span>
  </div>

  return <div className="p-4 bg-default">
    {Header}
    <div className="h-10" />
    {Toolbar}
    <div className="h-20" />
    {Body}
  </div>
}
