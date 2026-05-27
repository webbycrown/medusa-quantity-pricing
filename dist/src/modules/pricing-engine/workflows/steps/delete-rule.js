"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuantityPricingRuleStep = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const index_1 = require("../../index");
exports.deleteQuantityPricingRuleStep = (0, workflows_sdk_1.createStep)("delete-quantity-pricing-rule", async (input, { container }) => {
    const pricingEngine = container.resolve(index_1.PRICING_ENGINE_MODULE);
    const previous = await pricingEngine.retrieveRule(input.id);
    await pricingEngine.removeRule(input.id);
    return new workflows_sdk_1.StepResponse({ id: input.id, deleted: true }, previous);
}, async (previous, { container }) => {
    if (!previous) {
        return;
    }
    const pricingEngine = container.resolve(index_1.PRICING_ENGINE_MODULE);
    await pricingEngine.addRule({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlLXJ1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcmljaW5nLWVuZ2luZS93b3JrZmxvd3Mvc3RlcHMvZGVsZXRlLXJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUVBQTRFO0FBQzVFLHVDQUFtRDtBQVF0QyxRQUFBLDZCQUE2QixHQUFHLElBQUEsMEJBQVUsRUFDckQsOEJBQThCLEVBQzlCLEtBQUssRUFBRSxLQUF5QyxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNqRSxNQUFNLGFBQWEsR0FBeUIsU0FBUyxDQUFDLE9BQU8sQ0FDM0QsNkJBQXFCLENBQ3RCLENBQUE7SUFFRCxNQUFNLFFBQVEsR0FBRyxNQUFNLGFBQWEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQzNELE1BQU0sYUFBYSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUE7SUFFeEMsT0FBTyxJQUFJLDRCQUFZLENBQUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUE7QUFDcEUsQ0FBQyxFQUNELEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ2hDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNkLE9BQU07SUFDUixDQUFDO0lBRUQsTUFBTSxhQUFhLEdBQXlCLFNBQVMsQ0FBQyxPQUFPLENBQzNELDZCQUFxQixDQUN0QixDQUFBO0lBRUQsTUFBTSxhQUFhLENBQUMsT0FBTyxDQUFDO1FBQzFCLFVBQVUsRUFBRSxRQUFRLENBQUMsVUFBVTtRQUMvQixVQUFVLEVBQUUsUUFBUSxDQUFDLFVBQVU7UUFDL0IsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPO1FBQ3pCLE9BQU8sRUFBRSxRQUFRLENBQUMsT0FBTztRQUN6QixLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7UUFDckIsYUFBYSxFQUFFLFFBQVEsQ0FBQyxhQUFhO1FBQ3JDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxpQkFBaUI7UUFDN0MsU0FBUyxFQUFFLFFBQVEsQ0FBQyxTQUFTO0tBQzlCLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FDRixDQUFBIn0=