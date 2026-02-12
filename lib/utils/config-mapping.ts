export function getSectionKey(sectionId: string): string {
  switch (sectionId) {
    case 'hero-emergency': return 'heroEmergency';
    case 'practice-areas': return 'practiceAreas';
    case 'attorney-profile': return 'attorneyProfile';
    case 'free-consultation': return 'freeConsultation';
    case 'how-it-works': return 'howItWorks';
    case 'review-trust-bar': return 'reviewTrustBar';
    case 'feature-highlight': return 'featureHighlight';
    case 'team-carousel': return 'teamCarousel';
    case 'patient-faq': return 'patientFaq';
    case 'pricing': return 'pricingTable';
    case 'awards': return 'awardsStrip';
    default: return sectionId;
  }
}
