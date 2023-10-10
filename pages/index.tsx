/* eslint-disable @next/next/no-img-element */
import { getSchema, useFetch, useOnline, useQuery, useSchema, useVisible } from "@hazae41/xswr"
import { OppositeTextButton, OppositeTextButtonRounded } from "../src/libs/components/buttons/button"
import { fetchJsonResult } from "../src/libs/fetchers/json"
import { fetchText } from "../src/libs/fetchers/text"

interface Log {
  created_at: string,
  ip: string,
  method: string,
  tor: boolean
}

function getIpLogs(ip?: string) {
  if (!ip) return

  return getSchema<Log[]>(`/api/logs/ip?ip=${ip}`, fetchJsonResult)
}

function useIpLogs(ip?: string) {
  const query = useSchema(getIpLogs, [ip])
  useFetch(query)
  useOnline(query)
  useVisible(query)
  return query
}

function useTorLogs() {
  const query = useQuery<Log[]>(`/api/logs/tor`, fetchJsonResult)
  useFetch(query)
  useOnline(query)
  useVisible(query)
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
  const ipLogs = useIpLogs(myip.data?.trim())
  const torLogs = useTorLogs()

  const LogSubrow = (title: string, text: string, style = "") =>
    <div className="flex gap-2">
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
      {LogSubrow("IP Address", log.ip, log.tor ? "text-green-500 truncate" : "text-red-500 truncate")}
      {LogSubrow("RPC Method", log.method || "REDACTED")}
      <div className="h-2" />
      {log.tor
        ? <a className=""
          href={`https://metrics.torproject.org/rs.html#search/${log.ip}`}
          target="_blank" rel="noopener noreferrer">
          <OppositeTextButtonRounded>
            <img className="icon-sm"
              alt="Onion icon"
              src="/tor.svg" />
            Find IP address
          </OppositeTextButtonRounded>
        </a> : <a className=""
          href={`https://whatismyipaddress.com/ip/${log.ip}`}
          target="_blank" rel="noopener noreferrer">
          <OppositeTextButtonRounded>
            <img className="icon-sm"
              alt="IP icon"
              src="/ip.png" />
            Find IP address
          </OppositeTextButtonRounded>
        </a>}
    </div>

  const YourIpLogs =
    <div className="w-full max-w-[400px]">
      <div className="text-2xl font-medium text-colored">
        {`Requests coming from your IP`}
      </div>
      <div className="h-2" />
      <div className="text-contrast">
        {`When you use MetaMask and similar wallets, we can see your IP address and use it to get your location and link your different accounts.`}
      </div>
      <div className="h-4" />
      <div className="flex flex-col gap-2">
        <OppositeTextButton className="w-full"
          onClick={() => ipLogs.refetch()}>
          {ipLogs.loading
            ? `Loading...`
            : `Refresh`}
        </OppositeTextButton>
        {ipLogs.data?.map(LogRow)}
      </div>
    </div>

  const TorLogs =
    <div className="w-full max-w-[400px]">
      <div className="text-2xl font-medium text-colored">
        {`Requests coming from Tor`}
      </div>
      <div className="h-2" />
      <div className="text-contrast">
        {`When you use Brume, we can't see your IP address, we can only see the IP address of a Tor node, which is different for each of your accounts.`}
      </div>
      <div className="h-4" />
      <div className="flex flex-col gap-2">
        <OppositeTextButton className="w-full"
          onClick={() => torLogs.refetch()}>
          {torLogs.loading
            ? `Loading...`
            : `Refresh`}
        </OppositeTextButton>
        {torLogs.data?.map(LogRow)}
      </div>
    </div>

  const Body =
    <div className="flex flex-wrap justify-evenly gap-16">
      {YourIpLogs}
      {TorLogs}
    </div>

  const Header = <div className="max-w-[800px] m-auto">
    <div className="flex justify-center items-center gap-4">
      <img className="h-[96px] w-auto"
        alt="logo"
        src="/logo.png" />
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
    <div className="flex flex-wrap items-center gap-2">
      <div className="text-contrast">
        {`Just use the following RPC URL with chain ID 1:`}
      </div>
      <div className="border border-default p-2 rounded-xl grow">
        <input className="bg-transparent outline-none w-full text-center"
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
