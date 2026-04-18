import { useState, useCallback } from 'react'
import HomePage from './components/cases/HomePage.jsx'
import CasePage from './components/cases/CasePage.jsx'
import DynamicCasePage from './components/cases/DynamicCasePage.jsx'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedCase, setSelectedCase] = useState(null)
  const [dynamicTopic, setDynamicTopic] = useState('')
  const [theme, setTheme] = useState('dark')

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      document.body.classList.toggle('light-mode', next === 'light')
      return next
    })
  }, [])

  const openCase = useCallback((caseId) => {
    setSelectedCase(caseId)
    setCurrentPage('case')
  }, [])

  const openDynamic = useCallback((topic) => {
    setDynamicTopic(topic)
    setCurrentPage('dynamic')
  }, [])

  const goHome = useCallback(() => {
    setCurrentPage('home')
    setSelectedCase(null)
    setDynamicTopic('')
  }, [])

  return (
    <>
      {currentPage === 'home' && (
        <HomePage onOpenCase={openCase} onOpenDynamic={openDynamic} theme={theme} onToggleTheme={toggleTheme} />
      )}
      {currentPage === 'case' && (
        <CasePage
          caseId={selectedCase}
          onBack={goHome}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      {currentPage === 'dynamic' && (
        <DynamicCasePage
          topic={dynamicTopic}
          onBack={goHome}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
    </>
  )
}
