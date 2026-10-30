import React from 'react';

/**
 * National Civic Emblem & Digital India Tricolor Arc SVG for the myScheme / SchemeSaathi Header
 */
export const AshokaEmblemSvg: React.FC<{ className?: string }> = ({ className = 'w-7 h-9' }) => (
  <svg viewBox="0 0 44 56" fill="none" className={className} aria-hidden="true">
    {/* Pedestal & Wheel */}
    <rect x="8" y="42" width="28" height="4" rx="1.5" fill="#1E293B" />
    <rect x="11" y="48" width="22" height="3" rx="1" fill="#475569" />
    <circle cx="22" cy="36" r="4.5" stroke="#1E293B" strokeWidth="1.6" />
    <circle cx="22" cy="36" r="1.2" fill="#1E293B" />
    {/* Three Lions Silhouette */}
    <path
      d="M17 30V16C17 12.5 19.2 10 22 10C24.8 10 27 12.5 27 16V30H17Z"
      fill="#1E293B"
    />
    <path
      d="M11 30V19C11 16.5 12.6 14.5 15 14.5C16.5 14.5 17.5 15.5 17.5 17.5V30H11Z"
      fill="#334155"
    />
    <path
      d="M26.5 30V17.5C26.5 15.5 27.5 14.5 29 14.5C31.4 14.5 33 16.5 33 19V30H26.5Z"
      fill="#334155"
    />
    <circle cx="22" cy="7.5" r="2.5" fill="#15803D" />
  </svg>
);

export const DigitalIndiaTricolorMark: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <path
      d="M10 8C19 4 29 8 32 17C34 23 31 30 25 33"
      stroke="#EA580C"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M14 14C20 11 26 14 28 20C29 24 27 28 23 30"
      stroke="#0284C7"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M18 20C21 18.5 24 20 25 23C25.5 25 24.5 27 22 28"
      stroke="#16A34A"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle cx="14" cy="25" r="3" fill="#15803D" />
  </svg>
);

/**
 * Rich Editorial Hero Picture for Welcome & Theme Discovery
 */
export const HeroCivicIllustration: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg
    viewBox="0 0 680 420"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="myScheme Citizen Empowerment & Digital Seva Kendra Illustration"
  >
    <defs>
      <linearGradient id="heroSky" x1="0" y1="0" x2="680" y2="420" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#064E3B" />
        <stop offset="55%" stopColor="#0F2942" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="sunGlow" x1="520" y1="30" x2="520" y2="190" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="cardSurface" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F8FAFC" />
      </linearGradient>
    </defs>

    <rect width="680" height="420" rx="20" fill="url(#heroSky)" />

    {/* Warm Golden Hour Sun & Civic Skyline */}
    <circle cx="530" cy="110" r="85" fill="url(#sunGlow)" />
    <circle cx="530" cy="110" r="42" fill="#F59E0B" fillOpacity="0.22" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="5 5" />

    {/* Distant Rural-Urban Landscape Silhouette */}
    <path
      d="M0 330C110 295 220 305 340 325C460 345 570 310 680 295V420H0V330Z"
      fill="#065F46"
      fillOpacity="0.45"
    />
    <path
      d="M0 355C150 335 310 345 470 338C560 334 630 322 680 318V420H0V355Z"
      fill="#047857"
      fillOpacity="0.55"
    />

    {/* Left Interactive Citizen Scheme Card Preview */}
    <rect x="44" y="48" width="276" height="248" rx="16" fill="url(#cardSurface)" stroke="#E2E8F0" strokeWidth="1.5" />
    {/* Green Top Strip */}
    <path d="M44 64C44 55.1634 51.1634 48 60 48H304C312.837 48 320 55.1634 320 64V84H44V64Z" fill="#15803D" />
    <circle cx="66" cy="66" r="6" fill="#BBF7D0" />
    <text x="80" y="70" fill="#FFFFFF" fontSize="12" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
      myScheme · Verified Citizen Profile
    </text>

    {/* Matched Scheme Row 1: PM-KISAN */}
    <rect x="60" y="100" width="244" height="54" rx="10" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="1.2" />
    <circle cx="82" cy="127" r="12" fill="#16A34A" />
    <path d="M77 127L80.5 130.5L87.5 123.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <text x="102" y="123" fill="#064E3B" fontSize="12" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
      PM-KISAN Samman Nidhi
    </text>
    <text x="102" y="140" fill="#15803D" fontSize="11" fontWeight="600" fontFamily="Public Sans, sans-serif">
      ₹6,000 / Year · Appears Eligible
    </text>

    {/* Matched Scheme Row 2: NSP Scholarship */}
    <rect x="60" y="164" width="244" height="54" rx="10" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.2" />
    <circle cx="82" cy="191" r="12" fill="#2563EB" />
    <path d="M77 191L80.5 194.5L87.5 187.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <text x="102" y="187" fill="#1E3A8A" fontSize="12" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
      NSP Post-Matric Scholarship
    </text>
    <text x="102" y="204" fill="#1D4ED8" fontSize="11" fontWeight="600" fontFamily="Public Sans, sans-serif">
      Up to ₹75,000 / Yr · Tuition Waiver
    </text>

    {/* Matched Scheme Row 3: Ayushman Bharat */}
    <rect x="60" y="228" width="244" height="52" rx="10" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1.2" />
    <circle cx="82" cy="254" r="12" fill="#D97706" />
    <path d="M82 248V260M76 254H88" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    <text x="102" y="250" fill="#78350F" fontSize="12" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
      Ayushman Bharat PM-JAY
    </text>
    <text x="102" y="266" fill="#B45309" fontSize="11" fontWeight="600" fontFamily="Public Sans, sans-serif">
      ₹5,00,000 Family Health Cover
    </text>

    {/* Right Side: Detailed Indian Citizens (Farmer, Female Student, Entrepreneur) */}
    {/* Graduate Student Woman holding Degree & Tablet */}
    <circle cx="408" cy="176" r="26" fill="#FDBA74" />
    <path d="M382 172C382 152 394 140 410 140C426 140 436 154 435 172C424 162 396 162 382 172Z" fill="#0F172A" />
    {/* Graduation Mortarboard */}
    <path d="M372 146L408 130L444 146L408 160L372 146Z" fill="#1E293B" stroke="#FBBF24" strokeWidth="1.5" />
    <line x1="438" y1="148" x2="438" y2="170" stroke="#F59E0B" strokeWidth="2.5" />
    <path d="M366 310C366 252 384 214 408 214C432 214 450 252 450 310H366Z" fill="#0D9488" />
    <path d="M386 214L408 268L430 214" fill="#FDE047" />

    {/* Indian Farmer in Saffron Turban */}
    <circle cx="542" cy="168" r="27" fill="#FDBA74" />
    <path d="M511 162C511 140 525 128 543 128C562 128 575 142 573 162H511Z" fill="#EA580C" />
    <path d="M516 152C532 142 554 142 568 152" stroke="#FEF08A" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M496 310C496 248 515 208 542 208C569 208 588 248 588 310H496Z" fill="#F8FAFC" />
    <path d="M516 210L542 280L568 210" stroke="#16A34A" strokeWidth="8" />

    {/* Foreground Desk & YojanaMitra AI Voice Badge */}
    <rect x="348" y="308" width="290" height="72" rx="14" fill="#0F172A" stroke="#16A34A" strokeWidth="1.5" />
    <circle cx="382" cy="344" r="18" fill="#16A34A" />
    <text x="373" y="348" fill="#FFFFFF" fontSize="11" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">
      AI
    </text>
    <text x="412" y="338" fill="#FFFFFF" fontSize="13" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
      YojanaMitra Live Gemini API
    </text>
    <text x="412" y="358" fill="#86EFAC" fontSize="11" fontFamily="Public Sans, sans-serif">
      Ask any question · Auto-syncs profile &amp; schemes
    </text>

    {/* Bottom Left DBT Assurance Badge */}
    <rect x="44" y="314" width="276" height="66" rx="14" fill="#1E293B" stroke="#334155" />
    <text x="64" y="340" fill="#F8FAFC" fontSize="12" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
      100% Direct Benefit Transfer (DBT)
    </text>
    <text x="64" y="360" fill="#94A3B8" fontSize="11" fontFamily="Public Sans, sans-serif">
      Central &amp; State Ministries · Verified Rules
    </text>
  </svg>
);

/**
 * Rich, Scheme-Specific Photographic-Grade SVG Scene Pictures for Every Scheme & Category
 */
export const SchemeCategoryIllustration: React.FC<{
  category: string;
  schemeId?: string;
  className?: string;
}> = ({ category, schemeId = '', className = 'w-full h-44' }) => {
  // 1. Agriculture / PM-KISAN Picture: Lush Farm, Tractor, Solar Pump & Farmer
  if (category === 'Agriculture' || schemeId.includes('kisan')) {
    return (
      <svg
        viewBox="0 0 480 200"
        fill="none"
        className={className}
        role="img"
        aria-label="PM-KISAN Agriculture and Farmer Income Support Illustration"
      >
        <defs>
          <linearGradient id="agriSky" x1="0" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="60%" stopColor="#DCFCE7" />
            <stop offset="100%" stopColor="#BBF7D0" />
          </linearGradient>
        </defs>
        <rect width="480" height="200" fill="url(#agriSky)" />
        {/* Warm Morning Sun */}
        <circle cx="390" cy="54" r="34" fill="#FBBF24" fillOpacity="0.45" />
        <circle cx="390" cy="54" r="22" fill="#F59E0B" />
        {/* Terraced Green Fields */}
        <path d="M0 135C110 105 240 115 360 138C410 148 450 140 480 130V200H0V135Z" fill="#16A34A" />
        <path d="M0 158C150 138 310 152 480 146V200H0V158Z" fill="#15803D" />
        <path d="M0 176C180 165 340 172 480 168V200H0V176Z" fill="#166534" />
        {/* Crop Furrow Lines */}
        <path d="M40 200L130 142M110 200L185 144M180 200L240 148" stroke="#86EFAC" strokeWidth="1.5" strokeOpacity="0.6" />

        {/* Solar Water Pump Array (PM-KUSUM) */}
        <g transform="translate(290, 74)">
          <rect x="0" y="14" width="84" height="38" rx="4" transform="rotate(-12 0 14)" fill="#0F2942" stroke="#38BDF8" strokeWidth="2" />
          <line x1="28" y1="9" x2="34" y2="45" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.6" />
          <line x1="56" y1="3" x2="62" y2="39" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.6" />
          <rect x="38" y="42" width="8" height="36" fill="#475569" />
          {/* Water Arc */}
          <path d="M46 58C64 46 82 54 92 74" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 3" />
        </g>

        {/* Tractor & Farmer Silhouette */}
        <g transform="translate(56, 86)">
          <rect x="18" y="18" width="44" height="28" rx="4" fill="#DC2626" />
          <rect x="42" y="2" width="24" height="22" rx="3" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
          <circle cx="26" cy="48" r="12" fill="#1E293B" stroke="#94A3B8" strokeWidth="3" />
          <circle cx="58" cy="44" r="16" fill="#1E293B" stroke="#94A3B8" strokeWidth="3.5" />
        </g>

        {/* Golden Wheat Stalks */}
        <g stroke="#D97706" strokeWidth="3" strokeLinecap="round">
          <path d="M180 145V92M180 104L168 94M180 116L192 106M180 128L168 118" />
          <path d="M210 148V86M210 98L198 88M210 110L222 100M210 122L198 112" />
        </g>

        {/* DBT Badge */}
        <rect x="330" y="150" width="134" height="34" rx="8" fill="#064E3B" fillOpacity="0.9" stroke="#86EFAC" />
        <text x="342" y="171" fill="#FFFFFF" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
          ₹6,000/yr Direct DBT
        </text>
      </svg>
    );
  }

  // 2. Education / NSP & PM-Vidyalaxmi Picture: University Campus, Students & Scholarship Grant
  if (category === 'Education' || schemeId.includes('nsp') || schemeId.includes('vidyalaxmi')) {
    return (
      <svg
        viewBox="0 0 480 200"
        fill="none"
        className={className}
        role="img"
        aria-label="National Scholarship and Higher Education Illustration"
      >
        <defs>
          <linearGradient id="eduBg" x1="0" y1="0" x2="480" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DBEAFE" />
            <stop offset="100%" stopColor="#EFF6FF" />
          </linearGradient>
        </defs>
        <rect width="480" height="200" fill="url(#eduBg)" />
        <rect y="162" width="480" height="38" fill="#1E3A8A" />

        {/* University / College Dome & Columns */}
        <g transform="translate(38, 36)">
          <path d="M30 42L115 6L200 42H30Z" fill="#1D4ED8" />
          <circle cx="115" cy="26" r="8" fill="#FBBF24" />
          <rect x="42" y="42" width="146" height="84" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="2" />
          <rect x="58" y="54" width="16" height="72" fill="#BFDBFE" />
          <rect x="92" y="54" width="16" height="72" fill="#BFDBFE" />
          <rect x="126" y="54" width="16" height="72" fill="#BFDBFE" />
          <rect x="160" y="54" width="16" height="72" fill="#BFDBFE" />
          <rect x="32" y="120" width="166" height="8" rx="2" fill="#1E40AF" />
        </g>

        {/* Two Students with Books, Laptop & Graduation Cap */}
        <g transform="translate(275, 44)">
          {/* Student 1 (Female Scholar) */}
          <circle cx="48" cy="42" r="18" fill="#FDBA74" />
          <path d="M26 24L48 14L70 24L48 34L26 24Z" fill="#0F172A" />
          <path d="M22 118C22 82 33 64 48 64C63 64 74 82 74 118H22Z" fill="#16A34A" />
          {/* Student 2 (Male Scholar) */}
          <circle cx="112" cy="46" r="17" fill="#FDBA74" />
          <path d="M88 118C88 84 98 68 112 68C126 68 136 84 136 118H88Z" fill="#2563EB" />
          {/* Open Book & Degree Scroll */}
          <rect x="56" y="86" width="44" height="26" rx="4" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
          <line x1="78" y1="86" x2="78" y2="112" stroke="#1E293B" strokeWidth="1.5" />
        </g>

        <rect x="285" y="150" width="175" height="34" rx="8" fill="#1E3A8A" stroke="#93C5FD" />
        <text x="298" y="171" fill="#FFFFFF" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
          100% Tuition + Stipend DBT
        </text>
      </svg>
    );
  }

  // 3. Healthcare / Ayushman Bharat PM-JAY Picture: Modern Hospital, Doctor, Family & ₹5L Golden Card
  if (category === 'Healthcare' || schemeId.includes('ayushman')) {
    return (
      <svg
        viewBox="0 0 480 200"
        fill="none"
        className={className}
        role="img"
        aria-label="Ayushman Bharat PM-JAY Cashless Healthcare Illustration"
      >
        <rect width="480" height="200" fill="#ECFDF5" />
        <rect y="164" width="480" height="36" fill="#065F46" />

        {/* Empanelled Hospital Building */}
        <g transform="translate(40, 34)">
          <rect x="0" y="24" width="160" height="106" rx="8" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" />
          <rect x="52" y="4" width="56" height="28" rx="6" fill="#059669" />
          <path d="M80 10V26M72 18H88" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          {/* Hospital Windows */}
          <rect x="20" y="46" width="28" height="22" rx="3" fill="#A7F3D0" />
          <rect x="66" y="46" width="28" height="22" rx="3" fill="#A7F3D0" />
          <rect x="112" y="46" width="28" height="22" rx="3" fill="#A7F3D0" />
          <rect x="58" y="84" width="44" height="46" rx="4" fill="#047857" />
        </g>

        {/* Golden Ayushman Card Visual */}
        <g transform="translate(236, 42)">
          <rect width="204" height="104" rx="12" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
          <rect x="0" y="0" width="204" height="28" rx="10" fill="#D97706" />
          <text x="14" y="19" fill="#FFFFFF" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
            AYUSHMAN BHARAT · PM-JAY CARD
          </text>
          <circle cx="36" cy="64" r="18" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
          <path d="M30 64L34 68L43 59" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
          <text x="66" y="56" fill="#78350F" fontSize="13" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">
            ₹5,00,000 / Year
          </text>
          <text x="66" y="73" fill="#92400E" fontSize="10" fontWeight="600" fontFamily="Public Sans, sans-serif">
            Cashless Family &amp; 70+ Senior Cover
          </text>
          <text x="66" y="89" fill="#047857" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono, monospace">
            29,000+ Empanelled Hospitals
          </text>
        </g>
      </svg>
    );
  }

  // 4. Housing / PMAY Gramin & Urban Picture: All-Weather Pucca Home, Solar Roof, Ujjwala LPG & Family
  if (category === 'Housing' || schemeId.includes('awas')) {
    return (
      <svg
        viewBox="0 0 480 200"
        fill="none"
        className={className}
        role="img"
        aria-label="Pradhan Mantri Awas Yojana Pucca House Grant Illustration"
      >
        <rect width="480" height="200" fill="#FFF7ED" />
        <path d="M0 160H480V200H0V160Z" fill="#7C2D12" />

        {/* Newly Built Pucca House */}
        <g transform="translate(52, 34)">
          <path d="M16 56L110 8L204 56H16Z" fill="#EA580C" />
          <rect x="32" y="56" width="156" height="70" fill="#FFFFFF" stroke="#F97316" strokeWidth="2" />
          <rect x="92" y="78" width="36" height="48" rx="4" fill="#9A3412" />
          <rect x="48" y="74" width="28" height="26" rx="3" fill="#FED7AA" stroke="#EA580C" strokeWidth="1.5" />
          <rect x="144" y="74" width="28" height="26" rx="3" fill="#FED7AA" stroke="#EA580C" strokeWidth="1.5" />
          {/* Rooftop Solar Panel */}
          <rect x="118" y="22" width="54" height="22" rx="3" transform="rotate(24 118 22)" fill="#0F2942" stroke="#38BDF8" strokeWidth="1.5" />
        </g>

        {/* Key & Grant Badge */}
        <g transform="translate(290, 52)">
          <rect width="154" height="86" rx="12" fill="#FFFFFF" stroke="#FDBA74" strokeWidth="2" />
          <text x="16" y="30" fill="#9A3412" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
            PMAY 2.0 HOUSING GRANT
          </text>
          <text x="16" y="52" fill="#15803D" fontSize="15" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">
            ₹1.20L – ₹2.50L
          </text>
          <text x="16" y="70" fill="#475569" fontSize="10" fontWeight="600" fontFamily="Public Sans, sans-serif">
            3 Installments via DBT
          </text>
        </g>
      </svg>
    );
  }

  // 5. Women & Child / Mahila Samridhi & Sukanya Samriddhi Picture
  if (category === 'Women & Child' || schemeId.includes('mahila')) {
    return (
      <svg
        viewBox="0 0 480 200"
        fill="none"
        className={className}
        role="img"
        aria-label="Women Empowerment and Self-Reliance Scheme Illustration"
      >
        <rect width="480" height="200" fill="#FDF2F8" />
        <rect y="162" width="480" height="38" fill="#831843" />

        {/* Women Self-Help Group / Entrepreneur Figures */}
        <g transform="translate(56, 36)">
          <circle cx="54" cy="40" r="20" fill="#FDBA74" />
          <path d="M26 126C26 86 38 64 54 64C70 64 82 86 82 126H26Z" fill="#DB2777" />
          <circle cx="122" cy="44" r="19" fill="#FDBA74" />
          <path d="M96 126C96 88 107 68 122 68C137 68 148 88 148 126H96Z" fill="#7C3AED" />
          <circle cx="188" cy="42" r="20" fill="#FDBA74" />
          <path d="M160 126C160 86 172 64 188 64C204 64 216 86 216 126H160Z" fill="#0D9488" />
        </g>

        <g transform="translate(296, 50)">
          <rect width="152" height="88" rx="12" fill="#FFFFFF" stroke="#F472B6" strokeWidth="2" />
          <text x="14" y="28" fill="#9D174D" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
            MAHILA SAMRIDHI CREDIT
          </text>
          <text x="14" y="52" fill="#15803D" fontSize="14" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">
            Up to ₹1.40L @ 4%
          </text>
          <text x="14" y="70" fill="#475569" fontSize="10" fontWeight="600" fontFamily="Public Sans, sans-serif">
            Concessional Women SHG Loan
          </text>
        </g>
      </svg>
    );
  }

  // 6. Pensions / Senior Citizens & Social Welfare Picture
  if (category === 'Pensions' || category === 'Social Welfare' || schemeId.includes('pension') || schemeId.includes('divyang')) {
    return (
      <svg
        viewBox="0 0 480 200"
        fill="none"
        className={className}
        role="img"
        aria-label="Senior Citizen Pension and Social Security Illustration"
      >
        <rect width="480" height="200" fill="#F0F9FF" />
        <rect y="162" width="480" height="38" fill="#0C4A6E" />

        <g transform="translate(56, 38)">
          {/* Senior Citizen Couple */}
          <circle cx="58" cy="42" r="20" fill="#FDBA74" />
          <path d="M40 32C46 22 70 22 76 32" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />
          <path d="M30 124C30 84 42 66 58 66C74 66 86 84 86 124H30Z" fill="#0284C7" />

          <circle cx="130" cy="46" r="19" fill="#FDBA74" />
          <path d="M104 124C104 86 115 68 130 68C145 68 156 86 156 124H104Z" fill="#D97706" />
        </g>

        <g transform="translate(268, 48)">
          <rect width="178" height="88" rx="12" fill="#FFFFFF" stroke="#7DD3FC" strokeWidth="2" />
          <text x="16" y="28" fill="#0369A1" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
            SOCIAL SECURITY &amp; PENSION
          </text>
          <text x="16" y="52" fill="#15803D" fontSize="14" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">
            Assured Monthly DBT
          </text>
          <text x="16" y="70" fill="#475569" fontSize="10" fontWeight="600" fontFamily="Public Sans, sans-serif">
            Direct Bank Pension &amp; Aids
          </text>
        </g>
      </svg>
    );
  }

  // 7. Business, MSME, Mudra & PM Vishwakarma Picture
  return (
    <svg
      viewBox="0 0 480 200"
      fill="none"
      className={className}
      role="img"
      aria-label="MSME Business, Mudra Loan and PM Vishwakarma Artisan Illustration"
    >
      <rect width="480" height="200" fill="#FFFBEB" />
      <rect y="162" width="480" height="38" fill="#78350F" />

      {/* Enterprise Storefront & Workshop */}
      <g transform="translate(42, 36)">
        <rect x="8" y="34" width="156" height="92" rx="6" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" />
        <path d="M0 34L22 10H150L172 34H0Z" fill="#D97706" />
        <rect x="28" y="56" width="52" height="44" rx="4" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" />
        <rect x="98" y="56" width="44" height="70" rx="4" fill="#0F2942" />
      </g>

      {/* Growth Bars & Subsidy Shield */}
      <g transform="translate(260, 44)">
        <rect width="186" height="94" rx="12" fill="#FFFFFF" stroke="#FCD34D" strokeWidth="2" />
        <rect x="20" y="54" width="16" height="26" rx="3" fill="#F59E0B" />
        <rect x="44" y="38" width="16" height="42" rx="3" fill="#D97706" />
        <rect x="68" y="20" width="16" height="60" rx="3" fill="#16A34A" />
        <text x="96" y="38" fill="#0F172A" fontSize="12" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">
          35% Subsidy
        </text>
        <text x="96" y="56" fill="#15803D" fontSize="11" fontWeight="700" fontFamily="Public Sans, sans-serif">
          Up to ₹10L–₹50L
        </text>
        <text x="96" y="72" fill="#64748B" fontSize="10" fontFamily="Public Sans, sans-serif">
          Zero Collateral Credit
        </text>
      </g>
    </svg>
  );
};
