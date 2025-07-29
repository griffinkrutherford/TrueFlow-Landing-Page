// Key fixes for the assessment form

// 1. Add proper validation helper
const isValidString = (value: string | undefined): boolean => {
  return !!(value && value.trim().length > 0);
};

// 2. Update validation checks
const canProceedStep1 = 
  isValidString(contactInfo.firstName) && 
  isValidString(contactInfo.lastName) && 
  isValidString(contactInfo.email) && 
  isValidString(contactInfo.businessName);

// 3. Add client-side validation before submission
const validateFormData = () => {
  const errors: string[] = [];
  
  if (!isValidString(contactInfo.firstName)) {
    errors.push('First name is required');
  }
  if (!isValidString(contactInfo.lastName)) {
    errors.push('Last name is required');
  }
  if (!isValidString(contactInfo.email)) {
    errors.push('Email is required');
  }
  if (!isValidString(contactInfo.businessName)) {
    errors.push('Business name is required');
  }
  
  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (contactInfo.email && !emailRegex.test(contactInfo.email.trim())) {
    errors.push('Please enter a valid email address');
  }
  
  return errors;
};

// 4. Update handleSubmit with better error handling
const handleSubmit = async () => {
  setIsSubmitting(true);
  setSubmitError('');

  // Validate form data
  const validationErrors = validateFormData();
  if (validationErrors.length > 0) {
    setSubmitError(validationErrors.join('. '));
    setIsSubmitting(false);
    return;
  }

  try {
    const score = calculateScore();
    const recommendation = getRecommendation(score);
    const businessType = businessTypes.find(type => type.id === selectedBusinessType)?.title || selectedBusinessType;
    const planName = selectedPlan === 'not-sure' 
      ? 'Not Sure Yet' 
      : plans.find(plan => plan.id === selectedPlan)?.name || selectedPlan;

    // Prepare lead data with trimmed values
    const leadData = {
      firstName: contactInfo.firstName.trim(),
      lastName: contactInfo.lastName.trim(),
      email: contactInfo.email.trim(),
      phone: contactInfo.phone?.trim() || '',
      businessName: contactInfo.businessName?.trim() || '',
      businessType,
      score: score,
      recommendation: recommendation.recommendation,
      answers: answers,
      selectedPlan: planName,
      contentGoals: contentGoals || [],
      integrations: integrations || [],
      timestamp: new Date().toISOString()
    };

    console.log('Submitting assessment data:', leadData);

    // Send to GHL API
    const response = await fetch('/api/ghl/create-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(leadData)
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('API Error Response:', result);
      
      // Provide more specific error messages
      if (response.status === 400 && result.message?.includes('Missing required fields')) {
        throw new Error('Please fill in all required fields (First Name, Last Name, Email, and Business Name)');
      } else if (response.status === 500) {
        throw new Error('Server error. Please try again in a moment.');
      } else {
        throw new Error(result.message || 'Failed to submit assessment');
      }
    }

    console.log('Assessment submitted successfully:', result);
    setShowSuccess(true);
    
  } catch (error) {
    console.error('Error submitting assessment:', error);
    
    // Better error messages for users
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        setSubmitError('Network error. Please check your connection and try again.');
      } else {
        setSubmitError(error.message);
      }
    } else {
      setSubmitError('An unexpected error occurred. Please try again.');
    }
  } finally {
    setIsSubmitting(false);
  }
};

// 5. Add input sanitization to prevent whitespace-only submissions
const handleInputChange = (field: keyof ContactInfo, value: string) => {
  // Don't trim while typing to avoid cursor jump, but prevent leading spaces
  if (value.length === 1 && value === ' ') {
    return; // Don't allow starting with space
  }
  
  setContactInfo(prev => ({ 
    ...prev, 
    [field]: value 
  }));
};

// 6. Add visual feedback for required fields
const inputClassName = (value: string) => {
  const baseClasses = "w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none transition-colors";
  
  if (!value || value.trim().length === 0) {
    return `${baseClasses} border-white/20 focus:border-blue-500`;
  }
  
  return `${baseClasses} border-green-500/50 focus:border-green-500`;
};

// 7. Update the API route to handle edge cases better
// In route.ts, update validation:
if (!data.firstName?.trim() || !data.lastName?.trim() || !data.email?.trim()) {
  console.error('[API] Missing or empty required fields:', {
    firstName: !!data.firstName?.trim(),
    lastName: !!data.lastName?.trim(),
    email: !!data.email?.trim()
  });
  return NextResponse.json({ 
    success: false, 
    message: 'Missing required fields: firstName, lastName, or email cannot be empty' 
  }, { status: 400 });
}