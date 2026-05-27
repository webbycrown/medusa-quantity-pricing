/**
 * PricingEngineService — core commerce logic for quantity range pricing.
 *
 * Extends MedusaService so CRUD is generated from the QuantityPrice model
 * (createQuantityPrices, listQuantityPrices, …). Custom methods wrap that
 * with validation, contextual matching, and a stable public API for workflows.
 */
import type { CalculatePriceInput, CalculatePriceResult, CreateQuantityPriceRuleDTO, GetQuantityPriceRulesFilters, QuantityPriceRuleDTO, UpdateQuantityPriceRuleDTO } from "./types";
declare const PricingEngineService_base: import("@medusajs/framework/utils").MedusaServiceReturnType<import("@medusajs/framework/utils").ModelConfigurationsToConfigTemplate<{
    readonly QuantityPrice: import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder<{
        id: import("@medusajs/framework/utils").PrimaryKeyModifier<string, import("@medusajs/framework/utils").IdProperty>;
        product_id: import("@medusajs/framework/utils").TextProperty;
        variant_id: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
        min_qty: import("@medusajs/framework/utils").NumberProperty;
        max_qty: import("@medusajs/framework/utils").NullableModifier<number, import("@medusajs/framework/utils").NumberProperty>;
        price: import("@medusajs/framework/utils").BigNumberProperty;
        pricing_type: import("@medusajs/framework/utils").TextProperty;
        currency_code: import("@medusajs/framework/utils").TextProperty;
        customer_group_id: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
        region_id: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
        reference_unit_price: import("@medusajs/framework/utils").NullableModifier<number, import("@medusajs/framework/utils").BigNumberProperty>;
    }>, "quantity_prices">;
}>>;
declare class PricingEngineService extends PricingEngineService_base {
    /** Map ORM entity → API DTO with normalized numeric price */
    private toDTO;
    /**
     * Create a quantity pricing rule.
     * Validates non-overlapping min/max bounds at the application layer.
     */
    addRule(data: CreateQuantityPriceRuleDTO): Promise<QuantityPriceRuleDTO>;
    editRule(data: UpdateQuantityPriceRuleDTO): Promise<QuantityPriceRuleDTO>;
    removeRule(id: string): Promise<void>;
    /**
     * List rules with optional filters. Results are sorted by min_qty ascending.
     */
    getRules(filters?: GetQuantityPriceRulesFilters): Promise<QuantityPriceRuleDTO[]>;
    retrieveRule(id: string): Promise<QuantityPriceRuleDTO>;
    /**
     * Calculate unit price for a given quantity and commercial context.
     *
     * Matching order:
     * 1. Filter by product, currency, optional group/region
     * 2. Prefer variant-specific rules, else product-level
     * 3. Pick tier where min_qty <= qty <= max_qty (or max_qty is null)
     * 4. Tie-break by contextual specificity (B2B / region / variant)
     */
    calculatePrice(input: CalculatePriceInput): Promise<CalculatePriceResult | null>;
}
export default PricingEngineService;
//# sourceMappingURL=service.d.ts.map