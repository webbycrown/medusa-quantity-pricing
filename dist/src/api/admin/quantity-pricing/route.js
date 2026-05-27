"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const pricing_engine_1 = require("../../../modules/pricing-engine");
const schemas_1 = require("../../../modules/pricing-engine/validators/schemas");
async function GET(req, res) {
    const query = schemas_1.AdminListQuantityPricingSchema.parse(req.query);
    const pricingEngine = req.scope.resolve(pricing_engine_1.PRICING_ENGINE_MODULE);
    const rules = await pricingEngine.getRules({
        product_id: query.product_id,
        variant_id: query.variant_id,
        currency_code: query.currency_code,
        customer_group_id: query.customer_group_id,
        region_id: query.region_id,
    });
    const offset = query.offset ?? 0;
    const limit = query.limit ?? 50;
    const paginated = rules.slice(offset, offset + limit);
    res.json({
        quantity_prices: paginated,
        count: rules.length,
        offset,
        limit,
    });
}
async function POST(req, res) {
    const body = schemas_1.CreateQuantityPricingSchema.parse(req.body);
    const pricingEngine = req.scope.resolve(pricing_engine_1.PRICING_ENGINE_MODULE);
    const result = await pricingEngine.addRule({
        product_id: body.product_id,
        variant_id: body.variant_id ?? null,
        min_qty: body.min_qty,
        max_qty: body.max_qty ?? null,
        pricing_type: body.pricing_type,
        price: body.price,
        currency_code: body.currency_code,
        customer_group_id: body.customer_group_id ?? null,
        region_id: body.region_id ?? null,
        reference_unit_price: body.reference_unit_price ?? null,
    });
    res.status(201).json({ quantity_price: result });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3F1YW50aXR5LXByaWNpbmcvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQSxrQkF3QkM7QUFFRCxvQkFvQkM7QUFyREQsb0VBQXVFO0FBRXZFLGdGQUcyRDtBQUVwRCxLQUFLLFVBQVUsR0FBRyxDQUFDLEdBQWtCLEVBQUUsR0FBbUI7SUFDL0QsTUFBTSxLQUFLLEdBQUcsd0NBQThCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUM3RCxNQUFNLGFBQWEsR0FBeUIsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQzNELHNDQUFxQixDQUN0QixDQUFBO0lBRUQsTUFBTSxLQUFLLEdBQUcsTUFBTSxhQUFhLENBQUMsUUFBUSxDQUFDO1FBQ3pDLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtRQUM1QixVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7UUFDNUIsYUFBYSxFQUFFLEtBQUssQ0FBQyxhQUFhO1FBQ2xDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxpQkFBaUI7UUFDMUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO0tBQzNCLENBQUMsQ0FBQTtJQUVGLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFBO0lBQ2hDLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFBO0lBQy9CLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQTtJQUVyRCxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ1AsZUFBZSxFQUFFLFNBQVM7UUFDMUIsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNO1FBQ25CLE1BQU07UUFDTixLQUFLO0tBQ04sQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVNLEtBQUssVUFBVSxJQUFJLENBQUMsR0FBa0IsRUFBRSxHQUFtQjtJQUNoRSxNQUFNLElBQUksR0FBRyxxQ0FBMkIsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3hELE1BQU0sYUFBYSxHQUF5QixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FDM0Qsc0NBQXFCLENBQ3RCLENBQUE7SUFFRCxNQUFNLE1BQU0sR0FBRyxNQUFNLGFBQWEsQ0FBQyxPQUFPLENBQUM7UUFDekMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO1FBQzNCLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUk7UUFDbkMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1FBQ3JCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUk7UUFDN0IsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1FBQy9CLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztRQUNqQixhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWE7UUFDakMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixJQUFJLElBQUk7UUFDakQsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSTtRQUNqQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsb0JBQW9CLElBQUksSUFBSTtLQUN4RCxDQUFDLENBQUE7SUFFRixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO0FBQ2xELENBQUMifQ==