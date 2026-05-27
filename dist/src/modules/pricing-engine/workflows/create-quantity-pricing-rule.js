"use strict";
/**
 * Workflow: create a quantity pricing rule with rollback on failure.
 *
 * Workflows orchestrate steps that can compensate (undo) on error — safer
 * than calling the service directly when you later add side effects
 * (cache bust, search index, audit logs).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuantityPricingRuleWorkflow = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const create_rule_1 = require("./steps/create-rule");
exports.createQuantityPricingRuleWorkflow = (0, workflows_sdk_1.createWorkflow)("create-quantity-pricing-rule", (input) => {
    const rule = (0, create_rule_1.createQuantityPricingRuleStep)(input);
    return new workflows_sdk_1.WorkflowResponse(rule);
});
exports.default = exports.createQuantityPricingRuleWorkflow;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXF1YW50aXR5LXByaWNpbmctcnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3ByaWNpbmctZW5naW5lL3dvcmtmbG93cy9jcmVhdGUtcXVhbnRpdHktcHJpY2luZy1ydWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILHFFQUcwQztBQUMxQyxxREFHNEI7QUFFZixRQUFBLGlDQUFpQyxHQUFHLElBQUEsOEJBQWMsRUFDN0QsOEJBQThCLEVBQzlCLENBQUMsS0FBeUMsRUFBRSxFQUFFO0lBQzVDLE1BQU0sSUFBSSxHQUFHLElBQUEsMkNBQTZCLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDakQsT0FBTyxJQUFJLGdDQUFnQixDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ25DLENBQUMsQ0FDRixDQUFBO0FBRUQsa0JBQWUseUNBQWlDLENBQUEifQ==