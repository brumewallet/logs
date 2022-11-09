import { getSingleSchema, Result, useFetch, useQuery } from "@hazae41/xswr"

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

  const LogSubrow = (title: string, text: string) =>
    <div className="flex gap-2">
      <span className="text-gray-500">
        {title}
      </span>
      <span className="">
        {text}
      </span>
    </div>

  const LogRow = (log: Log) =>
    <div key={log.time} className="p-4 border rounded-xl">
      {LogSubrow("Time", new Date(log.time).toLocaleString())}
      {LogSubrow("IP Address", log.ip)}
      {LogSubrow("RPC Method", log.method)}
      {LogSubrow("RPC Endpoint", log.endpoint)}
    </div>

  const LogsDisplay =
    <div className="flex flex-col gap-2">
      {logs.data?.map(LogRow)}
    </div>

  const RefreshButton =
    <button className="p-4 border rounded-xl"
      onClick={() => logs.refetch()}>
      {logs.loading
        ? "Loading..."
        : "Refresh"}
    </button>

  return <div className="p-4">
    {RefreshButton}
    <div className="h-2" />
    {LogsDisplay}
  </div>
}
