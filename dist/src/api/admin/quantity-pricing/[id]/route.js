"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.PUT = PUT;
exports.DELETE = DELETE;
const utils_1 = require("@medusajs/framework/utils");
const pricing_engine_1 = require("../../../../modules/pricing-engine");
const schemas_1 = require("../../../../modules/pricing-engine/validators/schemas");
async function assertRuleExists(pricingEngine, id) {
    try {
        await pricingEngine.retrieveRule(id);
    }
    catch {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `Quantity price rule with id "${id}" not found`);
    }
}
async function GET(req, res) {
    const pricingEngine = req.scope.resolve(pricing_engine_1.PRICING_ENGINE_MODULE);
    try {
        const rule = await pricingEngine.retrieveRule(req.params.id);
        res.json({ quantity_price: rule });
    }
    catch {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `Quantity price rule with id "${req.params.id}" not found`);
    }
}
async function PUT(req, res) {
    const id = req.params.id;
    const body = schemas_1.UpdateQuantityPricingSchema.parse(req.body);
    const pricingEngine = req.scope.resolve(pricing_engine_1.PRICING_ENGINE_MODULE);
    await assertRuleExists(pricingEngine, id);
    const result = await pricingEngine.editRule({
        id,
        ...body,
        variant_id: body.variant_id,
        max_qty: body.max_qty,
        customer_group_id: body.customer_group_id,
        region_id: body.region_id,
    });
    res.json({ quantity_price: result });
}
async function DELETE(req, res) {
    const id = req.params.id;
    const pricingEngine = req.scope.resolve(pricing_engine_1.PRICING_ENGINE_MODULE);
    await assertRuleExists(pricingEngine, id);
    await pricingEngine.removeRule(id);
    res.json({
        id,
        object: "quantity_price",
        deleted: true,
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3F1YW50aXR5LXByaWNpbmcvW2lkXS9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQW9CQSxrQkFjQztBQUVELGtCQW1CQztBQUVELHdCQWVDO0FBdkVELHFEQUF1RDtBQUN2RCx1RUFBMEU7QUFFMUUsbUZBQW1HO0FBRW5HLEtBQUssVUFBVSxnQkFBZ0IsQ0FDN0IsYUFBbUMsRUFDbkMsRUFBVTtJQUVWLElBQUksQ0FBQztRQUNILE1BQU0sYUFBYSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUN0QyxDQUFDO0lBQUMsTUFBTSxDQUFDO1FBQ1AsTUFBTSxJQUFJLG1CQUFXLENBQ25CLG1CQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFDM0IsZ0NBQWdDLEVBQUUsYUFBYSxDQUNoRCxDQUFBO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFFTSxLQUFLLFVBQVUsR0FBRyxDQUFDLEdBQWtCLEVBQUUsR0FBbUI7SUFDL0QsTUFBTSxhQUFhLEdBQXlCLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUMzRCxzQ0FBcUIsQ0FDdEIsQ0FBQTtJQUVELElBQUksQ0FBQztRQUNILE1BQU0sSUFBSSxHQUFHLE1BQU0sYUFBYSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUNwQyxDQUFDO0lBQUMsTUFBTSxDQUFDO1FBQ1AsTUFBTSxJQUFJLG1CQUFXLENBQ25CLG1CQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFDM0IsZ0NBQWdDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxhQUFhLENBQzNELENBQUE7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQUVNLEtBQUssVUFBVSxHQUFHLENBQUMsR0FBa0IsRUFBRSxHQUFtQjtJQUMvRCxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQTtJQUN4QixNQUFNLElBQUksR0FBRyxxQ0FBMkIsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3hELE1BQU0sYUFBYSxHQUF5QixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FDM0Qsc0NBQXFCLENBQ3RCLENBQUE7SUFFRCxNQUFNLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUV6QyxNQUFNLE1BQU0sR0FBRyxNQUFNLGFBQWEsQ0FBQyxRQUFRLENBQUM7UUFDMUMsRUFBRTtRQUNGLEdBQUcsSUFBSTtRQUNQLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtRQUMzQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87UUFDckIsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtRQUN6QyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7S0FDMUIsQ0FBQyxDQUFBO0lBRUYsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO0FBQ3RDLENBQUM7QUFFTSxLQUFLLFVBQVUsTUFBTSxDQUFDLEdBQWtCLEVBQUUsR0FBbUI7SUFDbEUsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUE7SUFDeEIsTUFBTSxhQUFhLEdBQXlCLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUMzRCxzQ0FBcUIsQ0FDdEIsQ0FBQTtJQUVELE1BQU0sZ0JBQWdCLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBRXpDLE1BQU0sYUFBYSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUVsQyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ1AsRUFBRTtRQUNGLE1BQU0sRUFBRSxnQkFBZ0I7UUFDeEIsT0FBTyxFQUFFLElBQUk7S0FDZCxDQUFDLENBQUE7QUFDSixDQUFDIn0=