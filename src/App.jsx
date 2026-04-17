import { useState, useCallback } from 'react'
import HomePage from './components/cases/HomePage.jsx'
import CasePage from './components/cases/CasePage.jsx'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedCase, setSelectedCase] = useState(null)
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

  const goHome = useCallback(() => {
    setCurrentPage('home')
    setSelectedCase(null)
  }, [])

  return (
    <>
      {currentPage === 'home' ? (
        <HomePage onOpenCase={openCase} theme={theme} onToggleTheme={toggleTheme} />
      ) : (
        <CasePage
          caseId={selectedCase}
          onBack={goHome}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
    </>
  )
}
