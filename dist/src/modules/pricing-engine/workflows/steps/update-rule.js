"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuantityPricingRuleStep = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const index_1 = require("../../index");
exports.updateQuantityPricingRuleStep = (0, workflows_sdk_1.createStep)("update-quantity-pricing-rule", async (input, { container }) => {
    const pricingEngine = container.resolve(index_1.PRICING_ENGINE_MODULE);
    const previous = await pricingEngine.retrieveRule(input.id);
    const updated = await pricingEngine.editRule(input);
    return new workflows_sdk_1.StepResponse(updated, { id: input.id, previous });
}, async (compensation, { container }) => {
    if (!compensation?.previous) {
        return;
    }
    const pricingEngine = container.resolve(index_1.PRICING_ENGINE_MODULE);
    const { previous } = compensation;
    await pricingEngine.editRule({
        id: previous.id,
        product_id: previous.product_id,
        variant_id: previous.variant_id,
        min_qty: previous.min_qty,
        max_qty: previous.max_qty,
        price: previous.price,
        currency_code: previous.currency_code,
        customer_group_id: previous.customer_group_id,
        region_id: previous.region_id,
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLXJ1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcmljaW5nLWVuZ2luZS93b3JrZmxvd3Mvc3RlcHMvdXBkYXRlLXJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUVBQTRFO0FBQzVFLHVDQUFtRDtBQVN0QyxRQUFBLDZCQUE2QixHQUFHLElBQUEsMEJBQVUsRUFDckQsOEJBQThCLEVBQzlCLEtBQUssRUFBRSxLQUF5QyxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNqRSxNQUFNLGFBQWEsR0FBeUIsU0FBUyxDQUFDLE9BQU8sQ0FDM0QsNkJBQXFCLENBQ3RCLENBQUE7SUFFRCxNQUFNLFFBQVEsR0FBRyxNQUFNLGFBQWEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQzNELE1BQU0sT0FBTyxHQUFHLE1BQU0sYUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUVuRCxPQUFPLElBQUksNEJBQVksQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFBO0FBQzlELENBQUMsRUFDRCxLQUFLLEVBQUUsWUFBWSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNwQyxJQUFJLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxDQUFDO1FBQzVCLE9BQU07SUFDUixDQUFDO0lBRUQsTUFBTSxhQUFhLEdBQXlCLFNBQVMsQ0FBQyxPQUFPLENBQzNELDZCQUFxQixDQUN0QixDQUFBO0lBRUQsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLFlBQVksQ0FBQTtJQUNqQyxNQUFNLGFBQWEsQ0FBQyxRQUFRLENBQUM7UUFDM0IsRUFBRSxFQUFFLFFBQVEsQ0FBQyxFQUFFO1FBQ2YsVUFBVSxFQUFFLFFBQVEsQ0FBQyxVQUFVO1FBQy9CLFVBQVUsRUFBRSxRQUFRLENBQUMsVUFBVTtRQUMvQixPQUFPLEVBQUUsUUFBUSxDQUFDLE9BQU87UUFDekIsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPO1FBQ3pCLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSztRQUNyQixhQUFhLEVBQUUsUUFBUSxDQUFDLGFBQWE7UUFDckMsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLGlCQUFpQjtRQUM3QyxTQUFTLEVBQUUsUUFBUSxDQUFDLFNBQVM7S0FDOUIsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUNGLENBQUEifQ==