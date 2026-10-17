export const MAX_COMMISSION_PERCENT = 60;

/** 手数料＝税込販売額 × 手数料率（1円未満切り捨て）。支払額＝販売額 − 手数料。送料は対象外 */
export function calcCommission(lineTotalYen: number, percent: number) {
  const commissionYen = Math.floor((lineTotalYen * percent) / 100);
  return { commissionPercent: percent, commissionYen, payoutYen: lineTotalYen - commissionYen };
}
