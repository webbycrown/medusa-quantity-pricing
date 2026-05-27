"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuantityPricingRuleWorkflow = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const update_rule_1 = require("./steps/update-rule");
exports.updateQuantityPricingRuleWorkflow = (0, workflows_sdk_1.createWorkflow)("update-quantity-pricing-rule", (input) => {
    const rule = (0, update_rule_1.updateQuantityPricingRuleStep)(input);
    return new workflows_sdk_1.WorkflowResponse(rule);
});
exports.default = exports.updateQuantityPricingRuleWorkflow;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLXF1YW50aXR5LXByaWNpbmctcnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3ByaWNpbmctZW5naW5lL3dvcmtmbG93cy91cGRhdGUtcXVhbnRpdHktcHJpY2luZy1ydWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFFQUcwQztBQUMxQyxxREFHNEI7QUFFZixRQUFBLGlDQUFpQyxHQUFHLElBQUEsOEJBQWMsRUFDN0QsOEJBQThCLEVBQzlCLENBQUMsS0FBeUMsRUFBRSxFQUFFO0lBQzVDLE1BQU0sSUFBSSxHQUFHLElBQUEsMkNBQTZCLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDakQsT0FBTyxJQUFJLGdDQUFnQixDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ25DLENBQUMsQ0FDRixDQUFBO0FBRUQsa0JBQWUseUNBQWlDLENBQUEifQ==