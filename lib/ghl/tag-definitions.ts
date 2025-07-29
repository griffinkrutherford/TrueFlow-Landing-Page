/**
 * Predefined tag definitions for GoHighLevel
 * This ensures consistent tag usage across all form submissions
 */

export const TAG_DEFINITIONS = {
  // Form type tags
  FORM_TYPES: {
    ASSESSMENT: 'trueflow-assessment',
    GET_STARTED: 'trueflow-get-started'
  },
  
  // Source tags
  SOURCES: {
    WEB_LEAD: 'web-lead',
    API_LEAD: 'api-lead',
    MANUAL_ENTRY: 'manual-entry'
  },
  
  // Lead quality tags
  LEAD_QUALITY: {
    HOT: 'lead-quality-hot',
    WARM: 'lead-quality-warm',
    COLD: 'lead-quality-cold'
  },
  
  // Lead score ranges
  LEAD_SCORES: {
    EXCELLENT: 'lead-score-80-100',    // 80-100
    GOOD: 'lead-score-60-79',          // 60-79
    MODERATE: 'lead-score-40-59',      // 40-59
    LOW: 'lead-score-20-39',           // 20-39
    VERY_LOW: 'lead-score-0-19'        // 0-19
  },
  
  // Plan tags
  PLANS: {
    CONTENT_ENGINE: 'plan-content-engine',
    COMPLETE_SYSTEM: 'plan-complete-system',
    ENTERPRISE: 'plan-enterprise',
    STARTER: 'plan-starter',
    PROFESSIONAL: 'plan-professional',
    GROWTH: 'plan-growth',
    UNDECIDED: 'plan-undecided',
    OTHER: 'plan-other'
  },
  
  // Business type tags
  BUSINESS_TYPES: {
    CONTENT_CREATOR: 'business-content-creator',
    PODCASTER: 'business-podcaster',
    BUSINESS_OWNER: 'business-owner',
    COACH: 'business-coach',
    CONSULTANT: 'business-consultant',
    AGENCY: 'business-agency',
    OTHER: 'business-other'
  },
  
  // Timeline tags
  TIMELINES: {
    IMMEDIATE: 'timeline-immediate',
    THIS_MONTH: 'timeline-this-month',
    THIS_QUARTER: 'timeline-this-quarter',
    LATER: 'timeline-later'
  },
  
  // Budget range tags
  BUDGETS: {
    HIGH: 'budget-high',
    MEDIUM: 'budget-medium',
    LOW: 'budget-low',
    UNDISCLOSED: 'budget-undisclosed'
  }
}

/**
 * Helper function to get lead score tag based on numeric score
 */
export function getLeadScoreTag(score: number): string {
  if (score >= 80) return TAG_DEFINITIONS.LEAD_SCORES.EXCELLENT
  if (score >= 60) return TAG_DEFINITIONS.LEAD_SCORES.GOOD
  if (score >= 40) return TAG_DEFINITIONS.LEAD_SCORES.MODERATE
  if (score >= 20) return TAG_DEFINITIONS.LEAD_SCORES.LOW
  return TAG_DEFINITIONS.LEAD_SCORES.VERY_LOW
}

/**
 * Helper function to get lead quality tag based on qualification status
 */
export function getLeadQualityTag(status: string): string {
  switch (status.toLowerCase()) {
    case 'hot':
      return TAG_DEFINITIONS.LEAD_QUALITY.HOT
    case 'warm':
      return TAG_DEFINITIONS.LEAD_QUALITY.WARM
    case 'cold':
    default:
      return TAG_DEFINITIONS.LEAD_QUALITY.COLD
  }
}

/**
 * Helper function to get plan tag based on plan name
 */
export function getPlanTag(planName: string, formType: string): string {
  const normalizedPlan = planName.toLowerCase().replace(/\s+/g, '-')
  
  // Assessment form plans
  if (formType === 'assessment') {
    switch (normalizedPlan) {
      case 'content-engine':
        return TAG_DEFINITIONS.PLANS.CONTENT_ENGINE
      case 'complete-system':
        return TAG_DEFINITIONS.PLANS.COMPLETE_SYSTEM
      case 'custom':
      case 'custom-enterprise':
        return TAG_DEFINITIONS.PLANS.ENTERPRISE
      case 'not-sure':
      case 'not-sure-yet':
        return TAG_DEFINITIONS.PLANS.UNDECIDED
      default:
        return TAG_DEFINITIONS.PLANS.OTHER
    }
  }
  
  // Get Started form plans
  switch (normalizedPlan) {
    case 'starter':
      return TAG_DEFINITIONS.PLANS.STARTER
    case 'professional':
      return TAG_DEFINITIONS.PLANS.PROFESSIONAL
    case 'growth':
      return TAG_DEFINITIONS.PLANS.GROWTH
    case 'enterprise':
      return TAG_DEFINITIONS.PLANS.ENTERPRISE
    default:
      return TAG_DEFINITIONS.PLANS.OTHER
  }
}

/**
 * Helper function to get business type tag
 */
export function getBusinessTypeTag(businessType: string): string {
  const normalized = businessType.toLowerCase().replace(/[^a-z-]/g, '')
  
  switch (normalized) {
    case 'creator':
    case 'content-creator':
      return TAG_DEFINITIONS.BUSINESS_TYPES.CONTENT_CREATOR
    case 'podcaster':
    case 'podcast-host':
      return TAG_DEFINITIONS.BUSINESS_TYPES.PODCASTER
    case 'business':
    case 'business-owner':
      return TAG_DEFINITIONS.BUSINESS_TYPES.BUSINESS_OWNER
    case 'coach':
      return TAG_DEFINITIONS.BUSINESS_TYPES.COACH
    case 'consultant':
      return TAG_DEFINITIONS.BUSINESS_TYPES.CONSULTANT
    case 'agency':
    case 'marketing-agency':
      return TAG_DEFINITIONS.BUSINESS_TYPES.AGENCY
    default:
      return TAG_DEFINITIONS.BUSINESS_TYPES.OTHER
  }
}

/**
 * Get timeline tag based on assessment answers
 */
export function getTimelineTag(timeline?: string): string | null {
  if (!timeline) return null
  
  const normalized = timeline.toLowerCase()
  if (normalized.includes('immediate') || normalized.includes('now')) {
    return TAG_DEFINITIONS.TIMELINES.IMMEDIATE
  } else if (normalized.includes('month')) {
    return TAG_DEFINITIONS.TIMELINES.THIS_MONTH
  } else if (normalized.includes('quarter')) {
    return TAG_DEFINITIONS.TIMELINES.THIS_QUARTER
  } else {
    return TAG_DEFINITIONS.TIMELINES.LATER
  }
}

/**
 * Get budget tag based on assessment answers
 */
export function getBudgetTag(budget?: string): string {
  if (!budget) return TAG_DEFINITIONS.BUDGETS.UNDISCLOSED
  
  const normalized = budget.toLowerCase()
  if (normalized === 'high' || normalized.includes('enterprise')) {
    return TAG_DEFINITIONS.BUDGETS.HIGH
  } else if (normalized === 'medium' || normalized.includes('moderate')) {
    return TAG_DEFINITIONS.BUDGETS.MEDIUM
  } else if (normalized === 'low' || normalized.includes('budget')) {
    return TAG_DEFINITIONS.BUDGETS.LOW
  } else {
    return TAG_DEFINITIONS.BUDGETS.UNDISCLOSED
  }
}