/**
 * Application-level helper — resolves PricingEngineService from the container.
 * Use in cart routes, custom line-item flows, and subscribers.
 */
import type { CalculatePriceInput } from "../modules/pricing-engine/types";
export type ResolveQuantityUnitPriceInput = CalculatePriceInput & {
    /** When set, uses this exact tier (qty range + pricing type) for the line item */
    rule_id?: string | null;
};
type ContainerLike = {
    resolve<T = unknown>(key: string): T;
};
export declare function resolveQuantityUnitPrice(container: ContainerLike, input: ResolveQuantityUnitPriceInput): Promise<number | null>;
export {};
//# sourceMappingURL=pricing-engine.d.ts.map