export type { PricingType } from "./pricing-type";
export { PRICING_TYPES, PRICING_TYPE_LABELS, isPricingType } from "./pricing-type";
/**
 * Shared TypeScript contracts for the Quantity Range Pricing Engine module.
 *
 * Keeping DTOs here (instead of inline in routes) lets admin/store APIs, workflows,
 * and the service share one source of truth — important when this module is
 * extracted into a standalone npm package later.
 */
import type { PricingType } from "./pricing-type";
/** Input for creating a quantity-based price rule */
export type CreateQuantityPriceRuleDTO = {
    product_id: string;
    variant_id?: string | null;
    min_qty: number;
    max_qty?: number | null;
    pricing_type?: PricingType;
    /** See pricing_type for meaning */
    price: number;
    currency_code: string;
    customer_group_id?: string | null;
    region_id?: string | null;
    /** List price for discount tiers when variant catalog price is unavailable */
    reference_unit_price?: number | null;
};
/** Partial update — only supplied fields are changed */
export type UpdateQuantityPriceRuleDTO = Partial<Omit<CreateQuantityPriceRuleDTO, "product_id">> & {
    id: string;
    product_id?: string;
};
/** Filters when listing rules from the database */
export type GetQuantityPriceRulesFilters = {
    product_id?: string;
    variant_id?: string | null;
    currency_code?: string;
    customer_group_id?: string | null;
    region_id?: string | null;
    /** When true, only rules with no customer_group_id */
    default_customer_group?: boolean;
    /** When true, only rules with no region_id */
    default_region?: boolean;
};
/** Input for runtime price calculation */
export type CalculatePriceInput = {
    product_id: string;
    variant_id?: string | null;
    quantity: number;
    currency_code: string;
    /** Required for percentage / fixed_discount rules */
    base_unit_price?: number | null;
    customer_group_id?: string | null;
    region_id?: string | null;
};
/** Result of a successful price calculation */
export type CalculatePriceResult = {
    unit_price: number;
    quantity: number;
    currency_code: string;
    rule_id: string;
    pricing_type: PricingType;
    rule_value: number;
    base_unit_price: number | null;
    min_qty: number;
    max_qty: number | null;
    /** Total line amount (unit_price × quantity) */
    line_total: number;
};
/** Serialized rule returned from APIs */
export type QuantityPriceRuleDTO = {
    id: string;
    product_id: string;
    variant_id: string | null;
    min_qty: number;
    max_qty: number | null;
    pricing_type: PricingType;
    price: number;
    currency_code: string;
    customer_group_id: string | null;
    region_id: string | null;
    reference_unit_price: number | null;
    created_at: Date;
    updated_at: Date;
};
//# sourceMappingURL=index.d.ts.map