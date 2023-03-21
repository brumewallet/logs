/* eslint-disable @next/next/no-img-element */
import { useFetch, useQuery } from "@hazae41/xswr"
import { OppositeTextButton, OppositeTextButtonRounded } from "../components/buttons/button"
import { fetchJsonResult } from "../src/mods/fetchers/json"
import { fetchText } from "../src/mods/fetchers/text"

interface Log {
  created_at: string,
  ip: string,
  method: string,
  tor: boolean
}

function useLogs() {
  const query = useQuery<Log[]>(`/api/logs`, fetchJsonResult)
  useFetch(query)
  // useInterval(query, 1000)
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
    <div className="flex gap-2 overflow-hidden text-ellipsis">
      <span className="shrink-0 text-gray-500">
        {title}
      </span>
      <span className={style}>
        {text}
      </span>
    </div>

  const LogRow = (log: Log) =>
    <div key={log.created_at} className="p-4 border rounded-xl bg-component border-default w-full max-w-[800px]">
      {LogSubrow("Time", new Date(log.created_at).toLocaleString())}
      {LogSubrow("IP Address", log.ip, log.tor ? "text-green-500" : "text-red-500")}
      {LogSubrow("RPC Method", log.method)}
      <div className="h-2" />
      <div className="flex gap-2">
        <a className=""
          href={`https://whatismyipaddress.com/ip/${log.ip}`}
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
    </div>

  const YourIpLogs =
    <div className="flex flex-col items-center gap-2">
      <span className="text-3xl text-colored">
        {`Requests coming from your IP`}
      </span>
      <div className="my-2" />
      {logs.data
        ?.filter(it => it.ip === myip.data?.trim())
        ?.map(LogRow)}
    </div>

  const OtherIpLogs =
    <div className="flex flex-col items-center gap-2">
      <span className="text-3xl text-colored">
        {`Requests coming from Tor`}
      </span>
      <div className="my-2" />
      {logs.data
        ?.filter(it => it.tor)
        ?.map(LogRow)}
    </div>

  const Body =
    <div className="flex flex-wrap justify-evenly gap-[100px]">
      {YourIpLogs}
      {OtherIpLogs}
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
