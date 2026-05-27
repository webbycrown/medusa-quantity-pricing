"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = pricingEngineProductDeletedHandler;
const pricing_engine_1 = require("../modules/pricing-engine");
async function pricingEngineProductDeletedHandler({ event: { data }, container, }) {
    const productId = data.id;
    const pricingEngine = container.resolve(pricing_engine_1.PRICING_ENGINE_MODULE);
    const rules = await pricingEngine.getRules({ product_id: productId });
    for (const rule of rules) {
        await pricingEngine.removeRule(rule.id);
    }
}
exports.config = {
    event: "product.deleted",
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1kZWxldGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3N1YnNjcmliZXJzL3Byb2R1Y3QtZGVsZXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFJQSxxREFjQztBQWpCRCw4REFBaUU7QUFHbEQsS0FBSyxVQUFVLGtDQUFrQyxDQUFDLEVBQy9ELEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxFQUNmLFNBQVMsR0FDc0I7SUFDL0IsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQTtJQUN6QixNQUFNLGFBQWEsR0FBeUIsU0FBUyxDQUFDLE9BQU8sQ0FDM0Qsc0NBQXFCLENBQ3RCLENBQUE7SUFFRCxNQUFNLEtBQUssR0FBRyxNQUFNLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQTtJQUVyRSxLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQ3pCLE1BQU0sYUFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDekMsQ0FBQztBQUNILENBQUM7QUFFWSxRQUFBLE1BQU0sR0FBcUI7SUFDdEMsS0FBSyxFQUFFLGlCQUFpQjtDQUN6QixDQUFBIn0=