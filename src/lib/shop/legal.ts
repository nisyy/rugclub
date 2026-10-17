import { LEGAL_DEFAULTS, type LegalSettings } from './legalConfig';

export { LEGAL_DEFAULTS, LEGAL_LABELS, missingLegalFields } from './legalConfig';
export type { LegalSettings } from './legalConfig';

// 特定商取引法に基づく表記は、legalConfig.ts の内容で確定（管理画面からは編集しない）。
// 内容を変える場合は legalConfig.ts を編集して再デプロイする。
export async function getLegalSettings(): Promise<LegalSettings> {
  return { ...LEGAL_DEFAULTS };
}
