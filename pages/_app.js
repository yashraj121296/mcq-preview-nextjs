import '../styles/globals.css'
import '@contentful/live-preview/style.css';
import { ChakraProvider } from '@chakra-ui/react'



function MyApp({ Component, pageProps }) {
  return (
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
  )
}

export default MyApp
