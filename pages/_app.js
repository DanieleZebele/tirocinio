import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'
import { useEffect } from 'react'

import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap")
  },[])
  //import("bootstrap/dist/js/bootstrap") //document is not defined
  return (<>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <Component {...pageProps} />
  </>)
}

export default MyApp
