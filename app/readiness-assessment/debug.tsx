'use client'

import { useEffect } from 'react'

export function DebugComponent({ 
  currentStep, 
  answers, 
  showResults, 
  showContactForm,
  isSubmitting,
  submitError 
}: {
  currentStep: number
  answers: Record<string, string>
  showResults: boolean
  showContactForm: boolean
  isSubmitting: boolean
  submitError: string
}) {
  useEffect(() => {
    console.log('Debug State:', {
      currentStep,
      answersCount: Object.keys(answers).length,
      showResults,
      showContactForm,
      isSubmitting,
      submitError,
      timestamp: new Date().toISOString()
    })
  }, [currentStep, answers, showResults, showContactForm, isSubmitting, submitError])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono max-w-md">
      <div className="mb-2 font-bold text-yellow-400">Debug Info</div>
      <div>Step: {currentStep}</div>
      <div>Answers: {Object.keys(answers).length}</div>
      <div>ShowResults: {showResults ? 'true' : 'false'}</div>
      <div>ShowContact: {showContactForm ? 'true' : 'false'}</div>
      <div>Submitting: {isSubmitting ? 'true' : 'false'}</div>
      {submitError && <div className="text-red-400">Error: {submitError}</div>}
    </div>
  )
}