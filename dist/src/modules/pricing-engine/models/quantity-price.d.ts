/**
 * Data model (DML) for the `quantity_prices` PostgreSQL table.
 *
 * Medusa modules own their schema: defining a model here registers it with
 * the module's MikroORM context. Run `npx medusa db:generate pricingEngine`
 * after changes, then `npx medusa db:migrate`.
 *
 * @see https://docs.medusajs.com/learn/fundamentals/modules#1-create-a-data-model
 */
declare const QuantityPrice: import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder<{
    id: import("@medusajs/framework/utils").PrimaryKeyModifier<string, import("@medusajs/framework/utils").IdProperty>;
    product_id: import("@medusajs/framework/utils").TextProperty;
    /** Null = rule applies to all variants of the product */
    variant_id: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
    min_qty: import("@medusajs/framework/utils").NumberProperty;
    /** Null = open-ended upper bound (e.g. qty 51+) */
    max_qty: import("@medusajs/framework/utils").NullableModifier<number, import("@medusajs/framework/utils").NumberProperty>;
    /**
     * Meaning depends on pricing_type:
     * - fixed: unit price
     * - percentage: % discount (e.g. 10 = 10% off)
     * - fixed_discount: amount off per unit
     */
    price: import("@medusajs/framework/utils").BigNumberProperty;
    /** fixed | percentage | fixed_discount */
    pricing_type: import("@medusajs/framework/utils").TextProperty;
    currency_code: import("@medusajs/framework/utils").TextProperty;
    /** Optional B2B / wholesale segment */
    customer_group_id: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
    /** Optional regional override */
    region_id: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
    /**
     * Manual list price for discount tiers when the product has no variants
     * or variant prices are not configured in Medusa.
     */
    reference_unit_price: import("@medusajs/framework/utils").NullableModifier<number, import("@medusajs/framework/utils").BigNumberProperty>;
}>, "quantity_prices">;
export default QuantityPrice;
//# sourceMappingURL=quantity-price.d.ts.map