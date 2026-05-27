export declare const PRICING_TYPES: readonly ["fixed", "percentage", "fixed_discount"];
export type PricingType = (typeof PRICING_TYPES)[number];
export declare const PRICING_TYPE_LABELS: Record<PricingType, string>;
export declare function isPricingType(value: string): value is PricingType;
//# sourceMappingURL=pricing-type.d.ts.map