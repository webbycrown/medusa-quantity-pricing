/**
 * Pure pricing logic — no database or Medusa container dependencies.
 *
 * Isolating matching here makes unit testing trivial and allows the same
 * algorithm to run in cart workflows, storefront previews, and B2B quotes.
 */
import type { QuantityPriceRuleDTO } from "../types";
/** Normalize DB/API numeric values (BigNumber JSON, strings, etc.) */
export declare function toNumber(value: unknown): number;
export declare function sortRulesByMinQty<T extends {
    min_qty: number;
}>(rules: T[]): T[];
/**
 * Pick the best matching tier for a quantity.
 *
 * - Open-ended tiers use max_qty = null (qty 51+ in your example).
 * - When multiple rules match (overlapping ranges), the highest min_qty wins
 *   (most specific tier).
 */
export declare function findMatchingRule(quantity: number, rules: QuantityPriceRuleDTO[]): QuantityPriceRuleDTO | null;
/**
 * Resolve rules for store/admin display: variant-specific rows first,
 * then product-level fallbacks (variant_id is null).
 */
export declare function preferVariantRules(rules: QuantityPriceRuleDTO[], variantId?: string | null): QuantityPriceRuleDTO[];
/**
 * Score how specific a rule is for contextual pricing (B2B, region, etc.).
 * Higher score = better match when multiple rules qualify.
 */
export declare function ruleSpecificityScore(rule: QuantityPriceRuleDTO, context: {
    variant_id?: string | null;
    customer_group_id?: string | null;
    region_id?: string | null;
}): number;
export declare function selectBestRuleForContext(quantity: number, rules: QuantityPriceRuleDTO[], context: {
    variant_id?: string | null;
    customer_group_id?: string | null;
    region_id?: string | null;
}): QuantityPriceRuleDTO | null;
//# sourceMappingURL=price-matching.d.ts.map