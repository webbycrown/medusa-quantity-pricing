/**
 * Zod request schemas for admin and store quantity-pricing APIs.
 */
import { z } from "zod";
export declare const PricingTypeSchema: z.ZodEnum<{
    fixed: "fixed";
    percentage: "percentage";
    fixed_discount: "fixed_discount";
}>;
export declare const CreateQuantityPricingSchema: z.ZodObject<{
    product_id: z.ZodString;
    variant_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    min_qty: z.ZodCoercedNumber<unknown>;
    max_qty: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    pricing_type: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        fixed: "fixed";
        percentage: "percentage";
        fixed_discount: "fixed_discount";
    }>>>;
    price: z.ZodCoercedNumber<unknown>;
    currency_code: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    customer_group_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    region_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    reference_unit_price: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
export declare const UpdateQuantityPricingSchema: z.ZodObject<{
    variant_id: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    min_qty: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    max_qty: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>>;
    pricing_type: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        fixed: "fixed";
        percentage: "percentage";
        fixed_discount: "fixed_discount";
    }>>>>;
    price: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    currency_code: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>;
    customer_group_id: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    region_id: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    reference_unit_price: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>>;
    product_id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const AdminListQuantityPricingSchema: z.ZodObject<{
    product_id: z.ZodOptional<z.ZodString>;
    variant_id: z.ZodOptional<z.ZodString>;
    currency_code: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>;
    customer_group_id: z.ZodOptional<z.ZodString>;
    region_id: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    offset: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
export declare const StoreListQuantityPricingSchema: z.ZodObject<{
    product_id: z.ZodString;
    variant_id: z.ZodOptional<z.ZodString>;
    currency_code: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>;
    customer_group_id: z.ZodOptional<z.ZodString>;
    region_id: z.ZodOptional<z.ZodString>;
    quantity: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    base_unit_price: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const CalculatePriceQuerySchema: z.ZodObject<{
    product_id: z.ZodString;
    variant_id: z.ZodOptional<z.ZodString>;
    quantity: z.ZodCoercedNumber<unknown>;
    currency_code: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    base_unit_price: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    customer_group_id: z.ZodOptional<z.ZodString>;
    region_id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=schemas.d.ts.map