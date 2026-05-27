"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuantityPricingRuleStep = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const index_1 = require("../../index");
exports.createQuantityPricingRuleStep = (0, workflows_sdk_1.createStep)("create-quantity-pricing-rule", async (input, { container }) => {
    const pricingEngine = container.resolve(index_1.PRICING_ENGINE_MODULE);
    const rule = await pricingEngine.addRule(input);
    return new workflows_sdk_1.StepResponse(rule, rule.id);
}, async (ruleId, { container }) => {
    if (!ruleId) {
        return;
    }
    const pricingEngine = container.resolve(index_1.PRICING_ENGINE_MODULE);
    await pricingEngine.removeRule(ruleId);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXJ1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcmljaW5nLWVuZ2luZS93b3JrZmxvd3Mvc3RlcHMvY3JlYXRlLXJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUVBQTRFO0FBQzVFLHVDQUFtRDtBQVN0QyxRQUFBLDZCQUE2QixHQUFHLElBQUEsMEJBQVUsRUFDckQsOEJBQThCLEVBQzlCLEtBQUssRUFBRSxLQUF5QyxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNqRSxNQUFNLGFBQWEsR0FBeUIsU0FBUyxDQUFDLE9BQU8sQ0FDM0QsNkJBQXFCLENBQ3RCLENBQUE7SUFFRCxNQUFNLElBQUksR0FBRyxNQUFNLGFBQWEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7SUFFL0MsT0FBTyxJQUFJLDRCQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUN4QyxDQUFDLEVBQ0QsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDOUIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ1osT0FBTTtJQUNSLENBQUM7SUFFRCxNQUFNLGFBQWEsR0FBeUIsU0FBUyxDQUFDLE9BQU8sQ0FDM0QsNkJBQXFCLENBQ3RCLENBQUE7SUFFRCxNQUFNLGFBQWEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDeEMsQ0FBQyxDQUNGLENBQUEifQ==