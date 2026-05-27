"use strict";
/**
 * Zod request schemas for admin and store quantity-pricing APIs.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatePriceQuerySchema = exports.StoreListQuantityPricingSchema = exports.AdminListQuantityPricingSchema = exports.UpdateQuantityPricingSchema = exports.CreateQuantityPricingSchema = exports.PricingTypeSchema = void 0;
const zod_1 = require("zod");
const pricing_type_1 = require("../types/pricing-type");
exports.PricingTypeSchema = zod_1.z.enum(pricing_type_1.PRICING_TYPES);
const quantityRuleBase = zod_1.z.object({
    product_id: zod_1.z.string().min(1),
    variant_id: zod_1.z.string().min(1).nullable().optional(),
    min_qty: zod_1.z.coerce.number().int().min(1),
    max_qty: zod_1.z.coerce.number().int().min(1).nullable().optional(),
    pricing_type: exports.PricingTypeSchema.optional().default("fixed"),
    price: zod_1.z.coerce.number().positive(),
    currency_code: zod_1.z
        .string()
        .min(3)
        .max(3)
        .transform((c) => c.toLowerCase()),
    customer_group_id: zod_1.z.string().min(1).nullable().optional(),
    region_id: zod_1.z.string().min(1).nullable().optional(),
    reference_unit_price: zod_1.z.coerce.number().positive().nullable().optional(),
});
exports.CreateQuantityPricingSchema = quantityRuleBase
    .superRefine((data, ctx) => {
    if (data.max_qty != null && data.max_qty < data.min_qty) {
        ctx.addIssue({
            code: "custom",
            message: "max_qty must be greater than or equal to min_qty",
            path: ["max_qty"],
        });
    }
    if (data.pricing_type === "percentage" && data.price > 100) {
        ctx.addIssue({
            code: "custom",
            message: "Percentage discount cannot exceed 100",
            path: ["price"],
        });
    }
});
exports.UpdateQuantityPricingSchema = quantityRuleBase
    .partial()
    .extend({
    product_id: zod_1.z.string().min(1).optional(),
})
    .superRefine((data, ctx) => {
    if (data.min_qty != null &&
        data.max_qty != null &&
        data.max_qty < data.min_qty) {
        ctx.addIssue({
            code: "custom",
            message: "max_qty must be greater than or equal to min_qty",
            path: ["max_qty"],
        });
    }
    if (data.pricing_type === "percentage" && data.price != null && data.price > 100) {
        ctx.addIssue({
            code: "custom",
            message: "Percentage discount cannot exceed 100",
            path: ["price"],
        });
    }
});
exports.AdminListQuantityPricingSchema = zod_1.z.object({
    product_id: zod_1.z.string().optional(),
    variant_id: zod_1.z.string().optional(),
    currency_code: zod_1.z
        .string()
        .length(3)
        .transform((c) => c.toLowerCase())
        .optional(),
    customer_group_id: zod_1.z.string().optional(),
    region_id: zod_1.z.string().optional(),
    limit: zod_1.z.coerce.number().int().min(1).max(100).optional().default(50),
    offset: zod_1.z.coerce.number().int().min(0).optional().default(0),
});
exports.StoreListQuantityPricingSchema = zod_1.z.object({
    product_id: zod_1.z.string().min(1),
    variant_id: zod_1.z.string().optional(),
    /** When omitted, returns tiers for all currencies on this product */
    currency_code: zod_1.z
        .string()
        .length(3)
        .transform((c) => c.toLowerCase())
        .optional(),
    customer_group_id: zod_1.z.string().optional(),
    region_id: zod_1.z.string().optional(),
    quantity: zod_1.z.coerce.number().int().min(1).optional(),
    /** Catalog unit price — required to calculate percentage / fixed discount tiers */
    base_unit_price: zod_1.z.coerce.number().positive().optional(),
});
exports.CalculatePriceQuerySchema = zod_1.z.object({
    product_id: zod_1.z.string().min(1),
    variant_id: zod_1.z.string().optional(),
    quantity: zod_1.z.coerce.number().int().min(1),
    currency_code: zod_1.z
        .string()
        .length(3)
        .transform((c) => c.toLowerCase()),
    base_unit_price: zod_1.z.coerce.number().positive().optional(),
    customer_group_id: zod_1.z.string().optional(),
    region_id: zod_1.z.string().optional(),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3ByaWNpbmctZW5naW5lL3ZhbGlkYXRvcnMvc2NoZW1hcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7OztBQUVILDZCQUF1QjtBQUN2Qix3REFBcUQ7QUFFeEMsUUFBQSxpQkFBaUIsR0FBRyxPQUFDLENBQUMsSUFBSSxDQUFDLDRCQUFhLENBQUMsQ0FBQTtBQUV0RCxNQUFNLGdCQUFnQixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDOUIsVUFBVSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzdCLFVBQVUsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUNuRCxPQUFPLEVBQUUsT0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLE9BQU8sRUFBRSxPQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUU7SUFDN0QsWUFBWSxFQUFFLHlCQUFpQixDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7SUFDM0QsS0FBSyxFQUFFLE9BQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQ25DLGFBQWEsRUFBRSxPQUFDO1NBQ2IsTUFBTSxFQUFFO1NBQ1IsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNOLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDTixTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENB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