import Layout from './components/Layout/Layout'
import { AppProvider } from './context/AppContext'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <AppProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </AppProvider>
  )
}

export default App
