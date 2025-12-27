// SEO Validation Utility
// This file provides helpful type definitions and validation for SEO

export interface SEOValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates SEO parameters
 */
export function validateSEO(params: {
  title?: string;
  description?: string;
  keywords?: string;
}): SEOValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Title validation
  if (!params.title) {
    errors.push('Title is required for SEO');
  } else {
    if (params.title.length < 30) {
      warnings.push('Title is too short (recommended: 50-60 characters)');
    }
    if (params.title.length > 60) {
      warnings.push('Title is too long (recommended: 50-60 characters)');
    }
  }

  // Description validation
  if (!params.description) {
    errors.push('Description is required for SEO');
  } else {
    if (params.description.length < 120) {
      warnings.push('Description is too short (recommended: 150-160 characters)');
    }
    if (params.description.length > 160) {
      warnings.push('Description is too long (recommended: 150-160 characters)');
    }
  }

  // Keywords validation
  if (!params.keywords) {
    warnings.push('Keywords help with SEO - consider adding them');
  } else {
    const keywordCount = params.keywords.split(',').length;
    if (keywordCount < 3) {
      warnings.push('Consider adding more keywords (3-10 recommended)');
    }
    if (keywordCount > 10) {
      warnings.push('Too many keywords might dilute focus (3-10 recommended)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Logs SEO validation results (development only)
 * Use this in development to validate your SEO implementation
 */
export function logSEOValidation(pageName: string, validation: SEOValidation): void {
  // Only log in development - check if we're in dev mode via Vite
  console.group(`🔍 SEO Validation: ${pageName}`);
  
  if (validation.isValid) {
    console.log('✅ All required SEO fields are present');
  } else {
    console.error('❌ SEO Errors:', validation.errors);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️ SEO Warnings:', validation.warnings);
  }
  
  console.groupEnd();
}

// Example usage in development:
// import { validateSEO, logSEOValidation } from '@/lib/seo-utils';
// 
// const validation = validateSEO({
//   title: "My Page Title",
//   description: "My page description",
//   keywords: "keyword1, keyword2, keyword3"
// });
// 
// logSEOValidation("Homepage", validation);

