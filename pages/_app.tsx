import { XSWR } from '@hazae41/xswr'
import type { AppProps } from 'next/app'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return <XSWR.CoreProvider>
    <Component {...pageProps} />
  </XSWR.CoreProvider>
}
