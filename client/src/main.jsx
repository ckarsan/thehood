import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import './index.css'
import App from './App.jsx'
import client from './apolloClient.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ThemeProvider>
  </StrictMode>
)
