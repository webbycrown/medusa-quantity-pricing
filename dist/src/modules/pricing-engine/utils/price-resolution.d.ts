import type { PricingType } from "../types/pricing-type";
export type RulePriceInput = {
    pricing_type: PricingType;
    price: number;
};
export declare function roundMoney(amount: number): number;
/**
 * Resolve final unit price from a rule and optional catalog/base price.
 * - fixed: uses rule.price as unit price
 * - percentage: rule.price = % off (e.g. 10 → 10% off)
 * - fixed_discount: rule.price = amount subtracted from base unit price
 */
export declare function resolveUnitPriceFromRule(rule: RulePriceInput, baseUnitPrice?: number | null): number;
//# sourceMappingURL=price-resolution.d.ts.map