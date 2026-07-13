export interface ValueItem {
  titleKey: string;
  bodyKey: string;
  resultKey: string;
  proofKey: string;
}

/** Ordenados por impacto para quien contrata: la IA gobernada abre, el liderazgo cierra. */
export const VALUE_ITEMS: readonly ValueItem[] = [
  {
    titleKey: 'value.ai.title',
    bodyKey: 'value.ai.body',
    resultKey: 'value.ai.result',
    proofKey: 'value.ai.proof',
  },
  {
    titleKey: 'value.arch.title',
    bodyKey: 'value.arch.body',
    resultKey: 'value.arch.result',
    proofKey: 'value.arch.proof',
  },
  {
    titleKey: 'value.quality.title',
    bodyKey: 'value.quality.body',
    resultKey: 'value.quality.result',
    proofKey: 'value.quality.proof',
  },
  {
    titleKey: 'value.delivery.title',
    bodyKey: 'value.delivery.body',
    resultKey: 'value.delivery.result',
    proofKey: 'value.delivery.proof',
  },
  {
    titleKey: 'value.domain.title',
    bodyKey: 'value.domain.body',
    resultKey: 'value.domain.result',
    proofKey: 'value.domain.proof',
  },
  {
    titleKey: 'value.lead.title',
    bodyKey: 'value.lead.body',
    resultKey: 'value.lead.result',
    proofKey: 'value.lead.proof',
  },
];

export interface ValueStat {
  value: string;
  labelKey: string;
}

export const VALUE_STATS: readonly ValueStat[] = [
  { value: '12+', labelKey: 'value.stats.years' },
  { value: '10', labelKey: 'value.stats.companies' },
  { value: '2', labelKey: 'value.stats.countries' },
  { value: '3', labelKey: 'value.stats.sectors' },
];
