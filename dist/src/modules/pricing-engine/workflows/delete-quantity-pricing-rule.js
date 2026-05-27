"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuantityPricingRuleWorkflow = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const delete_rule_1 = require("./steps/delete-rule");
exports.deleteQuantityPricingRuleWorkflow = (0, workflows_sdk_1.createWorkflow)("delete-quantity-pricing-rule", (input) => {
    const result = (0, delete_rule_1.deleteQuantityPricingRuleStep)(input);
    return new workflows_sdk_1.WorkflowResponse(result);
});
exports.default = exports.deleteQuantityPricingRuleWorkflow;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlLXF1YW50aXR5LXByaWNpbmctcnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3ByaWNpbmctZW5naW5lL3dvcmtmbG93cy9kZWxldGUtcXVhbnRpdHktcHJpY2luZy1ydWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFFQUcwQztBQUMxQyxxREFBbUU7QUFNdEQsUUFBQSxpQ0FBaUMsR0FBRyxJQUFBLDhCQUFjLEVBQzdELDhCQUE4QixFQUM5QixDQUFDLEtBQTZDLEVBQUUsRUFBRTtJQUNoRCxNQUFNLE1BQU0sR0FBRyxJQUFBLDJDQUE2QixFQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ25ELE9BQU8sSUFBSSxnQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNyQyxDQUFDLENBQ0YsQ0FBQTtBQUVELGtCQUFlLHlDQUFpQyxDQUFBIn0=