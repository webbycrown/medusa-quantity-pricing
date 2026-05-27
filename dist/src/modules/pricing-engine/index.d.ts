/**
 * Module entry — registers PricingEngineService with Medusa's DI container.
 *
 * How Medusa modules work:
 * 1. You export `Module(MODULE_KEY, { service })` from index.ts
 * 2. medusa-config.ts lists the module path under `modules`
 * 3. On boot, Medusa instantiates the service and registers it as
 *    `container.resolve(PRICING_ENGINE_MODULE)`
 * 4. API routes, workflows, jobs, and subscribers resolve the same key
 *
 * @see https://docs.medusajs.com/learn/fundamentals/modules
 */
/** Container registration key — use this constant everywhere, never a string literal */
export declare const PRICING_ENGINE_MODULE = "pricingEngine";
declare const _default: any;
export default _default;
//# sourceMappingURL=index.d.ts.map