import {
  CitizenProfile,
  EvaluatedSchemeMatch,
  GovernmentScheme,
  ServiceCenterOffice,
} from '../types/schemes';
import { VERIFIED_SERVICE_CENTERS } from '../data/schemesCatalog';

/**
 * Calculates the completeness percentage (0 to 100) of a CitizenProfile.
 */
export function calculateProfileCompleteness(profile: CitizenProfile): number {
  let filled = 0;
  let total = 8;

  if (profile.age !== null && profile.age > 0) filled++;
  if (profile.gender && profile.gender !== 'Unknown') filled++;
  if (profile.state && profile.state.trim().length > 0) filled++;
  if (profile.residence_type && profile.residence_type !== 'Unknown') filled++;
  if (profile.social_category && profile.social_category !== 'Unknown') filled++;
  if (profile.annual_family_income_inr !== null || profile.income_known === 'dont_know') filled++;
  if (profile.occupation && profile.occupation.trim().length > 0) filled++;
  if (profile.is_bpl !== null || profile.is_pwd !== null) filled++;

  if (profile.is_student) {
    total += 3;
    if (profile.student_institution_type && profile.student_institution_type !== 'None') filled++;
    if (profile.institution_name && profile.institution_name.trim().length > 0) filled++;
    if (profile.course_or_class && profile.course_or_class.trim().length > 0) filled++;
  }

  return Math.min(100, Math.round((filled / total) * 100));
}

/**
 * Evaluates a single GovernmentScheme against a CitizenProfile using structured eligibility rules.
 * Distinguishes clearly between "Appears eligible", "More information needed", and "Not eligible".
 */
export function evaluateSchemeEligibility(
  profile: CitizenProfile,
  scheme: GovernmentScheme
): EvaluatedSchemeMatch {
  const matchedTags: string[] = [];
  const missingFields: string[] = [];
  let hardDisqualified = false;
  const disqualificationReasons: string[] = [];

  const { criteria } = scheme;

  // 1. Age check
  if (criteria.min_age !== undefined || criteria.max_age !== undefined) {
    if (profile.age === null || profile.age <= 0) {
      missingFields.push('Age or Date of Birth');
    } else {
      const aboveMin = criteria.min_age === undefined || profile.age >= criteria.min_age;
      const belowMax = criteria.max_age === undefined || profile.age <= criteria.max_age;
      if (!aboveMin || !belowMax) {
        // Special check: Ayushman Bharat allows 70+ regardless of income, or IGNOAPS allows 18-40 for APY
        if (scheme.scheme_id === 'ignoaps-atal-pension' && profile.age >= 18 && profile.age <= 40) {
          matchedTags.push(`Age ${profile.age} (Atal Pension 18–40 Eligible)`);
        } else {
          hardDisqualified = true;
          disqualificationReasons.push(
            `Requires age ${criteria.min_age ?? 0}${criteria.max_age ? `–${criteria.max_age}` : '+'} years`
          );
        }
      } else {
        matchedTags.push(`Age ${profile.age} yrs`);
      }
    }
  } else if (profile.age !== null && profile.age > 0) {
    if (scheme.scheme_id === 'ayushman-bharat-pmjay' && profile.age >= 70) {
      matchedTags.push(`Senior Citizen ${profile.age} yrs (70+ Universal Cover)`);
    } else {
      matchedTags.push(`Age ${profile.age} yrs`);
    }
  }

  // 2. Gender check
  if (criteria.allowed_genders && criteria.allowed_genders.length > 0) {
    if (!profile.gender || profile.gender === 'Unknown') {
      missingFields.push('Gender');
    } else if (!criteria.allowed_genders.includes(profile.gender)) {
      hardDisqualified = true;
      disqualificationReasons.push(`Exclusively for ${criteria.allowed_genders.join('/')} beneficiaries`);
    } else {
      matchedTags.push(`${profile.gender} Beneficiary`);
    }
  } else if (profile.gender === 'Female') {
    if (scheme.scheme_id === 'pmegp-msme-subsidy') {
      matchedTags.push('Woman Entrepreneur (Higher 25%–35% Subsidy)');
    } else if (scheme.scheme_id === 'pm-awas-yojana') {
      matchedTags.push('Woman Head of Household Priority');
    }
  }

  // 3. Student check
  if (criteria.requires_student) {
    if (!profile.is_student && profile.occupation !== 'Student') {
      if (!profile.occupation) {
        missingFields.push('Student / Occupation Status');
      } else {
        hardDisqualified = true;
        disqualificationReasons.push('Requires active Student enrollment');
      }
    } else {
      matchedTags.push('Active Student');
      if (profile.student_institution_type && profile.student_institution_type !== 'None') {
        matchedTags.push(profile.student_institution_type);
      } else {
        missingFields.push('Student Institution Type (School / College / Vocational)');
      }
      if (profile.course_or_class) {
        matchedTags.push(profile.course_or_class);
      }
    }
  }

  // 4. Farmer check
  if (criteria.requires_farmer) {
    const isFarmer =
      profile.is_farmer ||
      profile.occupation === 'Farmer' ||
      profile.selected_themes.includes('AGRICULTURE_FARMING');
    if (!isFarmer) {
      if (!profile.occupation) {
        missingFields.push('Occupation / Landholding Status');
      } else {
        hardDisqualified = true;
        disqualificationReasons.push('Requires agricultural landholding farmer status');
      }
    } else {
      matchedTags.push('Cultivable Landholding Farmer');
      if (profile.landholding_hectares !== null && profile.landholding_hectares > 0) {
        matchedTags.push(`${profile.landholding_hectares} Hectare Land`);
      }
    }
  }

  // 5. PwD check
  if (criteria.requires_pwd) {
    if (profile.is_pwd === null) {
      missingFields.push('Disability (PwD) Status');
    } else if (!profile.is_pwd) {
      hardDisqualified = true;
      disqualificationReasons.push('Requires Benchmark Disability (40%+ UDID)');
    } else {
      matchedTags.push('Divyangjan (PwD) Eligible');
    }
  } else if (profile.is_pwd) {
    matchedTags.push('PwD Priority Quota');
  }

  // 6. Income check
  if (criteria.max_annual_income_inr !== undefined) {
    // Special exception: 70+ senior citizens qualify for Ayushman Bharat regardless of income
    const isSeniorAyushman =
      scheme.scheme_id === 'ayushman-bharat-pmjay' && profile.age !== null && profile.age >= 70;

    if (!isSeniorAyushman) {
      if (profile.annual_family_income_inr === null) {
        missingFields.push('Annual Household Income');
      } else if (profile.annual_family_income_inr > criteria.max_annual_income_inr) {
        hardDisqualified = true;
        disqualificationReasons.push(
          `Income ₹${profile.annual_family_income_inr.toLocaleString('en-IN')} exceeds ₹${criteria.max_annual_income_inr.toLocaleString('en-IN')} limit`
        );
      } else {
        matchedTags.push(
          `Income ₹${(profile.annual_family_income_inr / 100000).toFixed(2).replace(/\.00$/, '')}L (< ₹${(
            criteria.max_annual_income_inr / 100000
          )
            .toFixed(1)
            .replace(/\.0$/, '')}L limit)`
        );
      }
    }
  }

  // 7. Social Category & Location tags
  if (profile.social_category && profile.social_category !== 'Unknown') {
    matchedTags.push(`${profile.social_category} Category`);
  } else if (
    scheme.scheme_id === 'nsp-post-matric-scholarship' ||
    scheme.scheme_id === 'mahila-samridhi-yojana'
  ) {
    missingFields.push('Social Category (SC/ST/OBC/EWS/General)');
  }

  if (profile.state) {
    matchedTags.push(
      `${profile.state}${profile.residence_type !== 'Unknown' ? ` (${profile.residence_type})` : ''}`
    );
  } else {
    missingFields.push('State / District');
  }

  if (
    (scheme.scheme_id === 'pmegp-msme-subsidy' || scheme.scheme_id === 'pm-vishwakarma-artisan') &&
    !profile.business_stage
  ) {
    missingFields.push('Proposed Enterprise / Artisan Trade Details');
  }

  if (profile.is_bpl) {
    matchedTags.push('BPL / Priority Ration Household');
  }

  // Theme boost
  const themeSelected = profile.selected_themes.includes(scheme.theme_id);
  if (themeSelected) {
    matchedTags.push('Matches Selected Goal');
  }

  // Determine final status and score
  if (hardDisqualified) {
    return {
      scheme,
      eligibility_status: 'Not eligible',
      schema_status: 'Missing_Criteria',
      match_score_percent: 25,
      why_you_qualify: disqualificationReasons.join('; '),
      matched_tags: matchedTags,
      missing_or_unclear_fields: missingFields,
    };
  }

  if (missingFields.length > 0) {
    const score = Math.max(62, Math.min(84, 86 - missingFields.length * 7 + (themeSelected ? 6 : 0)));
    return {
      scheme,
      eligibility_status: 'More information needed',
      schema_status: 'Likely_Eligible',
      match_score_percent: score,
      why_you_qualify: `Matches ${
        matchedTags.length > 0 ? matchedTags.slice(0, 3).join(', ') : 'initial profile'
      }. Please confirm ${missingFields.join(' & ')} to verify full eligibility.`,
      matched_tags: matchedTags,
      missing_or_unclear_fields: missingFields,
    };
  }

  const eligibleScore = Math.min(99, 90 + (themeSelected ? 6 : 0) + (profile.is_bpl ? 2 : 0));
  return {
    scheme,
    eligibility_status: 'Appears eligible',
    schema_status: 'Eligible',
    match_score_percent: eligibleScore,
    why_you_qualify: `Meets all core structured rules: ${matchedTags.slice(0, 4).join(' · ')}. Final approval depends on verification by the ${scheme.ministry_or_department}.`,
    matched_tags: matchedTags,
    missing_or_unclear_fields: [],
  };
}

/**
 * Evaluates, filters, and ranks all schemes for a CitizenProfile.
 */
export function rankAndFilterSchemes(
  profile: CitizenProfile,
  schemes: GovernmentScheme[],
  categoryFilter: string = 'All',
  statusFilter: string = 'All',
  searchQuery: string = ''
): EvaluatedSchemeMatch[] {
  const evaluated = schemes.map((scheme) => evaluateSchemeEligibility(profile, scheme));

  const filtered = evaluated.filter((item) => {
    // Hide hard-disqualified schemes unless user specifically filters for all or searches by name
    if (item.eligibility_status === 'Not eligible' && statusFilter !== 'Not eligible' && !searchQuery.trim()) {
      // Still show if user selected that exact theme and hasn't filled profile yet
      if (!profile.selected_themes.includes(item.scheme.theme_id)) {
        return false;
      }
    }

    if (categoryFilter !== 'All' && item.scheme.category !== categoryFilter) {
      return false;
    }

    if (statusFilter !== 'All' && item.eligibility_status !== statusFilter) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const hay = `${item.scheme.scheme_name} ${item.scheme.hindi_name} ${item.scheme.category} ${item.scheme.brief_description} ${item.scheme.ministry_or_department}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    return true;
  });

  // Sort: Appears eligible first, then More information needed, then by match score descending
  return filtered.sort((a, b) => {
    const order = {
      'Appears eligible': 3,
      'More information needed': 2,
      'Not eligible': 1,
    };
    if (order[b.eligibility_status] !== order[a.eligibility_status]) {
      return order[b.eligibility_status] - order[a.eligibility_status];
    }
    return b.match_score_percent - a.match_score_percent;
  });
}

/**
 * Validates a 10-digit Indian mobile number or an email address.
 */
export function validateMobileOrEmail(
  input: string,
  mode: 'mobile' | 'email'
): { valid: boolean; error?: string; normalized: string } {
  const trimmed = input.trim();
  if (mode === 'mobile') {
    const digitsOnly = trimmed.replace(/\D/g, '');
    if (digitsOnly.length !== 10 || !/^[6-9]\d{9}$/.test(digitsOnly)) {
      return {
        valid: false,
        error: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.',
        normalized: digitsOnly,
      };
    }
    return { valid: true, normalized: digitsOnly };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return {
      valid: false,
      error: 'Please enter a valid email address (for example: name@example.com).',
      normalized: trimmed.toLowerCase(),
    };
  }
  return { valid: true, normalized: trimmed.toLowerCase() };
}

/**
 * Looks up verified service offices by 6-digit Indian PIN code or district name.
 */
export function findNearbyServiceOffices(pinOrDistrictQuery: string): {
  isValidQuery: boolean;
  exactPinMatch: boolean;
  offices: ServiceCenterOffice[];
  message: string;
} {
  const cleaned = pinOrDistrictQuery.trim();
  if (!cleaned) {
    return {
      isValidQuery: false,
      exactPinMatch: false,
      offices: VERIFIED_SERVICE_CENTERS.slice(0, 3),
      message: 'Showing verified regional Common Service Centres (CSCs) and Tehsil e-District Kendras. Enter your 6-digit PIN code or District name above to filter.',
    };
  }

  // Check if user entered a numeric string that is not 6 digits
  if (/^\d+$/.test(cleaned) && !/^[1-9]\d{5}$/.test(cleaned)) {
    return {
      isValidQuery: false,
      exactPinMatch: false,
      offices: [],
      message: 'Please enter a valid 6-digit Indian PIN code (e.g., 221001, 411001, 110001).',
    };
  }

  const exactMatches = VERIFIED_SERVICE_CENTERS.filter(
    (o) =>
      o.pin_code === cleaned ||
      o.district.toLowerCase().includes(cleaned.toLowerCase()) ||
      o.state.toLowerCase().includes(cleaned.toLowerCase())
  );

  if (exactMatches.length > 0) {
    return {
      isValidQuery: true,
      exactPinMatch: true,
      offices: exactMatches,
      message: `Found ${exactMatches.length} verified government facilitation ${
        exactMatches.length === 1 ? 'centre' : 'centres'
      } matching "${cleaned}".`,
    };
  }

  // If PIN is valid 6-digit format but not in the pre-verified directory, return transparent official directory notice
  return {
    isValidQuery: true,
    exactPinMatch: false,
    offices: [],
    message: `No pre-verified CSC / Tehsil office address is cached in this demonstration for PIN "${cleaned}". Never rely on unverified addresses: please check the official CSC Locator (locator.csccloud.in) or your District Collectorate directory to confirm the exact kiosk in your block.`,
  };
}

/**
 * Merges extracted document fields from multimodal upload into a CitizenProfile.
 */
export function parseDocumentExtractionToProfile(
  currentProfile: CitizenProfile,
  extractedFields: Array<{ field_name: string; field_value: string }>
): CitizenProfile {
  const updated: CitizenProfile = { ...currentProfile };

  for (const field of extractedFields) {
    const key = field.field_name.toLowerCase();
    const val = field.field_value.trim();
    if (!val) continue;

    if (key.includes('name') && !key.includes('institution')) {
      updated.full_name = val;
    } else if (key.includes('age')) {
      const parsedAge = parseInt(val.replace(/\D/g, ''), 10);
      if (!isNaN(parsedAge) && parsedAge > 0 && parsedAge < 120) {
        updated.age = parsedAge;
      }
    } else if (key.includes('gender')) {
      if (/female|महिला/i.test(val)) updated.gender = 'Female';
      else if (/male|पुरुष/i.test(val)) updated.gender = 'Male';
      else if (/trans/i.test(val)) updated.gender = 'Transgender';
    } else if (key.includes('state')) {
      updated.state = val;
    } else if (key.includes('district')) {
      updated.district = val;
    } else if (key.includes('residence') || key.includes('area')) {
      if (/rural|ग्रामीण/i.test(val)) updated.residence_type = 'Rural';
      else if (/urban|शहरी/i.test(val)) updated.residence_type = 'Urban';
    } else if (key.includes('income')) {
      const numericIncome = parseInt(val.replace(/[^\d]/g, ''), 10);
      if (!isNaN(numericIncome) && numericIncome > 0) {
        updated.annual_family_income_inr = numericIncome;
        updated.income_known = 'known';
      }
    } else if (key.includes('category') || key.includes('caste')) {
      if (/\bobc\b/i.test(val)) updated.social_category = 'OBC';
      else if (/\bsc\b/i.test(val)) updated.social_category = 'SC';
      else if (/\bst\b/i.test(val)) updated.social_category = 'ST';
      else if (/\bews\b/i.test(val)) updated.social_category = 'EWS';
      else if (/general/i.test(val)) updated.social_category = 'General';
    } else if (key.includes('land')) {
      const numLand = parseFloat(val.replace(/[^\d.]/g, ''));
      if (!isNaN(numLand) && numLand > 0) {
        updated.is_farmer = true;
        updated.landholding_hectares = numLand;
        if (!updated.occupation) updated.occupation = 'Farmer';
      }
    }
  }

  updated.profile_completeness_percent = calculateProfileCompleteness(updated);
  return updated;
}
