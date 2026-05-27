"use strict";
/**
 * Data model (DML) for the `quantity_prices` PostgreSQL table.
 *
 * Medusa modules own their schema: defining a model here registers it with
 * the module's MikroORM context. Run `npx medusa db:generate pricingEngine`
 * after changes, then `npx medusa db:migrate`.
 *
 * @see https://docs.medusajs.com/learn/fundamentals/modules#1-create-a-data-model
 */
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const QuantityPrice = utils_1.model.define("quantity_prices", {
    id: utils_1.model.id().primaryKey(),
    product_id: utils_1.model.text(),
    /** Null = rule applies to all variants of the product */
    variant_id: utils_1.model.text().nullable(),
    min_qty: utils_1.model.number(),
    /** Null = open-ended upper bound (e.g. qty 51+) */
    max_qty: utils_1.model.number().nullable(),
    /**
     * Meaning depends on pricing_type:
     * - fixed: unit price
     * - percentage: % discount (e.g. 10 = 10% off)
     * - fixed_discount: amount off per unit
     */
    price: utils_1.model.bigNumber(),
    /** fixed | percentage | fixed_discount */
    pricing_type: utils_1.model.text().default("fixed"),
    currency_code: utils_1.model.text(),
    /** Optional B2B / wholesale segment */
    customer_group_id: utils_1.model.text().nullable(),
    /** Optional regional override */
    region_id: utils_1.model.text().nullable(),
    /**
     * Manual list price for discount tiers when the product has no variants
     * or variant prices are not configured in Medusa.
     */
    reference_unit_price: utils_1.model.bigNumber().nullable(),
});
exports.default = QuantityPrice;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVhbnRpdHktcHJpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcmljaW5nLWVuZ2luZS9tb2RlbHMvcXVhbnRpdHktcHJpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7OztHQVFHOztBQUVILHFEQUFpRDtBQUVqRCxNQUFNLGFBQWEsR0FBRyxhQUFLLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFO0lBQ3BELEVBQUUsRUFBRSxhQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFO0lBQzNCLFVBQVUsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQ3hCLHlEQUF5RDtJQUN6RCxVQUFVLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUNuQyxPQUFPLEVBQUUsYUFBSyxDQUFDLE1BQU0sRUFBRTtJQUN2QixtREFBbUQ7SUFDbkQsT0FBTyxFQUFFLGFBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7SUFDbEM7Ozs7O09BS0c7SUFDSCxLQUFLLEVBQUUsYUFBSyxDQUFDLFNBQVMsRUFBRTtJQUN4QiwwQ0FBMEM7SUFDMUMsWUFBWSxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0lBQzNDLGFBQWEsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQzNCLHVDQUF1QztJQUN2QyxpQkFBaUIsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQzFDLGlDQUFpQztJQUNqQyxTQUFTLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUNsQzs7O09BR0c7SUFDSCxvQkFBb0IsRUFBRSxhQUFLLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxFQUFFO0NBQ25ELENBQUMsQ0FBQTtBQUVGLGtCQUFlLGFBQWEsQ0FBQSJ9