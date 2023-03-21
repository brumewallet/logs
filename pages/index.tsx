/* eslint-disable @next/next/no-img-element */
import { useFetch, useOnline, useQuery, useVisible } from "@hazae41/xswr"
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
  useOnline(query)
  useVisible(query)
  // useInterval(query, 1000)
  return query
}

function useMyIP() {
  const query = useQuery<string>(`https://icanhazip.com/`, fetchText)
  useFetch(query)
  useOnline(query)
  useVisible(query)
  return query
}

export default function Home() {
  const myip = useMyIP()
  const logs = useLogs()

  const RefreshButton =
    <OppositeTextButton className="w-full"
      onClick={() => logs.refetch()}>
      {logs.loading
        ? `Loading...`
        : `Refresh`}
    </OppositeTextButton>

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
    <div key={log.created_at} className="p-4 rounded-xl border border-default w-full">
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
    <div className="max-w-[400px]">
      <div className="text-2xl font-medium text-colored">
        {`Requests coming from your IP`}
      </div>
      <div className="h-2" />
      <div className="text-contrast">
        {`When you use MetaMask and similar wallets, we can see your IP address and use it to get your location and link your different accounts.`}
      </div>
      <div className="h-4" />
      <div className="flex flex-col gap-2">
        {RefreshButton}
        {logs.data
          ?.filter(it => it.ip === myip.data?.trim())
          ?.map(LogRow)}
      </div>
    </div>

  const OtherIpLogs =
    <div className="max-w-[400px]">
      <div className="text-2xl font-medium text-colored">
        {`Requests coming from Tor`}
      </div>
      <div className="h-2" />
      <div className="text-contrast">
        {`When you use Brume, we can't see your IP address, we can only see the IP address of a Tor node, which is different for each of your accounts.`}
      </div>
      <div className="h-4" />
      <div className="flex flex-col gap-2">
        {RefreshButton}
        {logs.data
          ?.filter(it => it.tor)
          ?.map(LogRow)}
      </div>
    </div>

  const Body =
    <div className="flex flex-wrap justify-evenly gap-[100px]">
      {YourIpLogs}
      {OtherIpLogs}
    </div>

  const Header = <div className="max-w-[800px] m-auto">
    <div className="flex justify-center items-center gap-4">
      <img className="h-[50px] w-auto"
        alt="logo"
        src="/logo.svg" />
      <span className="text-4xl font-bold text-colored">
        {`Brume Logs`}
      </span>
    </div>
    <div className="h-8" />
    <div className="text-contrast">
      {`Don't trust, verify! This website will show you all Ethereum requests being made, by separating those coming from your IP address from those coming from the Tor network.`}
    </div>
    <div className="h-8" />
    <div className="text-2xl font-medium text-colored">
      {`Setting up`}
    </div>
    <div className="h-2" />
    <div className="text-contrast">
      {`If you don't use Brume, you can setup logging on your wallet by using our proxy RPC, which will send all Ethereum requests to Cloudflare's Ethereum RPC and log the IP address the request is coming from.`}
    </div>
    <div className="h-2" />
    <div className="flex flex-wrap items-center gap-1">
      <div className="text-contrast">
        {`Just use the following RPC URL:`}
      </div>
      <div className="border border-default p-2 rounded-xl">
        <input className="outline-none w-[21ch] text-center"
          readOnly
          onClick={e => e.currentTarget.select()}
          value="https://proxy.haz.workers.dev" />
      </div>
    </div>
    <div className="h-2" />
    <div className="text-contrast">
      {`You won't need to make an Ethereum transaction, your wallet already makes RPC requests when fetching your account balance.`}
    </div>
  </div>

  return <div className="p-8 bg-default">
    {Header}
    <div className="h-16" />
    {Body}
  </div>
}
