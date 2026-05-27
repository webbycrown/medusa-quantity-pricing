/**
 * Workflow: create a quantity pricing rule with rollback on failure.
 *
 * Workflows orchestrate steps that can compensate (undo) on error — safer
 * than calling the service directly when you later add side effects
 * (cache bust, search index, audit logs).
 */
export declare const createQuantityPricingRuleWorkflow: import("@medusajs/framework/workflows-sdk").ReturnWorkflow<import("../types").CreateQuantityPriceRuleDTO, import("../types").QuantityPriceRuleDTO, []>;
export default createQuantityPricingRuleWorkflow;
//# sourceMappingURL=create-quantity-pricing-rule.d.ts.map