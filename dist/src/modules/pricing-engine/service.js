"use strict";
/**
 * PricingEngineService — core commerce logic for quantity range pricing.
 *
 * Extends MedusaService so CRUD is generated from the QuantityPrice model
 * (createQuantityPrices, listQuantityPrices, …). Custom methods wrap that
 * with validation, contextual matching, and a stable public API for workflows.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const quantity_price_1 = __importDefault(require("./models/quantity-price"));
const pricing_type_1 = require("./types/pricing-type");
const rule_filters_1 = require("./utils/rule-filters");
const price_matching_1 = require("./utils/price-matching");
const price_resolution_1 = require("./utils/price-resolution");
class PricingEngineService extends (0, utils_1.MedusaService)({
    QuantityPrice: quantity_price_1.default,
}) {
    /** Map ORM entity → API DTO with normalized numeric price */
    toDTO(entity) {
        return {
            id: entity.id,
            product_id: entity.product_id,
            variant_id: entity.variant_id ?? null,
            min_qty: Number(entity.min_qty),
            max_qty: entity.max_qty === null || entity.max_qty === undefined
                ? null
                : Number(entity.max_qty),
            price: (0, price_matching_1.toNumber)(entity.price),
            pricing_type: normalizePricingType(entity.pricing_type),
            currency_code: entity.currency_code,
            customer_group_id: entity.customer_group_id ?? null,
            region_id: entity.region_id ?? null,
            reference_unit_price: entity.reference_unit_price == null
                ? null
                : (0, price_matching_1.toNumber)(entity.reference_unit_price),
            created_at: entity.created_at,
            updated_at: entity.updated_at,
        };
    }
    /**
     * Create a quantity pricing rule.
     * Validates non-overlapping min/max bounds at the application layer.
     */
    async addRule(data) {
        const created = await this.createQuantityPrices({
            product_id: data.product_id,
            variant_id: data.variant_id ?? null,
            min_qty: data.min_qty,
            max_qty: data.max_qty ?? null,
            price: data.price,
            pricing_type: data.pricing_type ?? "fixed",
            currency_code: data.currency_code.toLowerCase(),
            customer_group_id: data.customer_group_id ?? null,
            region_id: data.region_id ?? null,
            reference_unit_price: data.reference_unit_price ?? null,
        });
        return this.toDTO(created);
    }
    async editRule(data) {
        const { id, ...rest } = data;
        const payload = { id };
        if (rest.product_id !== undefined)
            payload.product_id = rest.product_id;
        if (rest.variant_id !== undefined)
            payload.variant_id = rest.variant_id;
        if (rest.min_qty !== undefined)
            payload.min_qty = rest.min_qty;
        if (rest.max_qty !== undefined)
            payload.max_qty = rest.max_qty;
        if (rest.price !== undefined)
            payload.price = rest.price;
        if (rest.pricing_type !== undefined)
            payload.pricing_type = rest.pricing_type;
        if (rest.currency_code !== undefined) {
            payload.currency_code = rest.currency_code.toLowerCase();
        }
        if (rest.customer_group_id !== undefined) {
            payload.customer_group_id = rest.customer_group_id;
        }
        if (rest.region_id !== undefined)
            payload.region_id = rest.region_id;
        if (rest.reference_unit_price !== undefined) {
            payload.reference_unit_price = rest.reference_unit_price;
        }
        const [updated] = await this.updateQuantityPrices([payload]);
        return this.toDTO(updated);
    }
    async removeRule(id) {
        await this.deleteQuantityPrices(id);
    }
    /**
     * List rules with optional filters. Results are sorted by min_qty ascending.
     */
    async getRules(filters = {}) {
        const where = (0, rule_filters_1.buildListFilters)(filters);
        const rules = await this.listQuantityPrices(where);
        const dtos = rules.map((r) => this.toDTO(r));
        return (0, price_matching_1.sortRulesByMinQty)(dtos);
    }
    async retrieveRule(id) {
        const rule = await this.retrieveQuantityPrice(id);
        return this.toDTO(rule);
    }
    /**
     * Calculate unit price for a given quantity and commercial context.
     *
     * Matching order:
     * 1. Filter by product, currency, optional group/region
     * 2. Prefer variant-specific rules, else product-level
     * 3. Pick tier where min_qty <= qty <= max_qty (or max_qty is null)
     * 4. Tie-break by contextual specificity (B2B / region / variant)
     */
    async calculatePrice(input) {
        const { product_id, quantity, currency_code } = input;
        if (quantity < 1) {
            return null;
        }
        const rules = await this.getRules({
            product_id,
            currency_code: currency_code.toLowerCase(),
        });
        if (!rules.length) {
            return null;
        }
        const match = (0, price_matching_1.selectBestRuleForContext)(quantity, rules, {
            variant_id: input.variant_id ?? null,
            customer_group_id: input.customer_group_id ?? null,
            region_id: input.region_id ?? null,
        });
        if (!match) {
            return null;
        }
        const base = input.base_unit_price != null && Number.isFinite(input.base_unit_price)
            ? input.base_unit_price
            : match.reference_unit_price != null &&
                Number.isFinite(match.reference_unit_price)
                ? match.reference_unit_price
                : null;
        const unit_price = (0, price_resolution_1.resolveUnitPriceFromRule)({ pricing_type: match.pricing_type, price: match.price }, base);
        return {
            unit_price,
            quantity,
            currency_code: match.currency_code,
            rule_id: match.id,
            pricing_type: match.pricing_type,
            rule_value: match.price,
            base_unit_price: base,
            min_qty: match.min_qty,
            max_qty: match.max_qty,
            line_total: unit_price * quantity,
        };
    }
}
function normalizePricingType(value) {
    if (typeof value === "string" && (0, pricing_type_1.isPricingType)(value)) {
        return value;
    }
    return "fixed";
}
exports.default = PricingEngineService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3ByaWNpbmctZW5naW5lL3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7QUFFSCxxREFBeUQ7QUFDekQsNkVBQW1EO0FBVW5ELHVEQUFvRDtBQUNwRCx1REFBdUQ7QUFDdkQsMkRBSStCO0FBQy9CLCtEQUFtRTtBQWtCbkUsTUFBTSxvQkFBcUIsU0FBUSxJQUFBLHFCQUFhLEVBQUM7SUFDL0MsYUFBYSxFQUFiLHdCQUFhO0NBQ2QsQ0FBQztJQUNBLDZEQUE2RDtJQUNyRCxLQUFLLENBQUMsTUFBMkI7UUFDdkMsT0FBTztZQUNMLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNiLFVBQVUsRUFBRSxNQUFNLENBQUMsVUFBVTtZQUM3QixVQUFVLEVBQUUsTUFBTSxDQUFDLFVBQVUsSUFBSSxJQUFJO1lBQ3JDLE9BQU8sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUMvQixPQUFPLEVBQ0wsTUFBTSxDQUFDLE9BQU8sS0FBSyxJQUFJLElBQUksTUFBTSxDQUFDLE9BQU8sS0FBSyxTQUFTO2dCQUNyRCxDQUFDLENBQUMsSUFBSTtnQkFDTixDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDNUIsS0FBSyxFQUFFLElBQUEseUJBQVEsRUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQzdCLFlBQVksRUFBRSxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO1lBQ3ZELGFBQWEsRUFBRSxNQUFNLENBQUMsYUFBYTtZQUNuQyxpQkFBaUIsRUFBRSxNQUFNLENBQUMsaUJBQWlCLElBQUksSUFBSTtZQUNuRCxTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVMsSUFBSSxJQUFJO1lBQ25DLG9CQUFvQixFQUNsQixNQUFNLENBQUMsb0JBQW9CLElBQUksSUFB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