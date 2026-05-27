"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const pricing_engine_1 = require("../../../modules/pricing-engine");
const catalog_prices_1 = require("../../../modules/pricing-engine/utils/catalog-prices");
const price_matching_1 = require("../../../modules/pricing-engine/utils/price-matching");
const schemas_1 = require("../../../modules/pricing-engine/validators/schemas");
async function GET(req, res) {
    const query = schemas_1.StoreListQuantityPricingSchema.parse(req.query);
    const pricingEngine = req.scope.resolve(pricing_engine_1.PRICING_ENGINE_MODULE);
    const allRules = await pricingEngine.getRules({
        product_id: query.product_id,
        ...(query.currency_code ? { currency_code: query.currency_code } : {}),
        customer_group_id: query.customer_group_id,
        region_id: query.region_id,
    });
    // Without variant: product-level tiers only. With variant: variant-specific (+ fallback).
    const quantity_prices = query.variant_id != null
        ? (0, price_matching_1.preferVariantRules)(allRules, query.variant_id)
        : allRules.filter((r) => !r.variant_id);
    if (!quantity_prices.length) {
        res.json({
            quantity_prices: [],
            calculated_price: null,
        });
        return;
    }
    let calculated_price = null;
    if (query.quantity) {
        const rulesForCalc = query.variant_id != null
            ? (0, price_matching_1.preferVariantRules)(allRules, query.variant_id)
            : allRules.filter((r) => !r.variant_id);
        const qtyMatch = (0, price_matching_1.selectBestRuleForContext)(query.quantity, rulesForCalc, {
            variant_id: query.variant_id ?? null,
            customer_group_id: query.customer_group_id ?? null,
            region_id: query.region_id ?? null,
        });
        const calcCurrency = query.currency_code ??
            qtyMatch?.currency_code ??
            rulesForCalc[0]?.currency_code ??
            "usd";
        let base_unit_price = query.base_unit_price ?? null;
        if (base_unit_price == null) {
            const catalog = await (0, catalog_prices_1.fetchCatalogPricesForProducts)(req.scope, [
                query.product_id,
            ]);
            base_unit_price = (0, catalog_prices_1.getBaseUnitPriceForRule)(catalog[query.product_id], {
                variant_id: query.variant_id ?? null,
                currency_code: calcCurrency,
            });
        }
        calculated_price = await pricingEngine.calculatePrice({
            product_id: query.product_id,
            variant_id: query.variant_id ?? null,
            quantity: query.quantity,
            currency_code: calcCurrency,
            base_unit_price,
            customer_group_id: query.customer_group_id ?? null,
            region_id: query.region_id ?? null,
        });
    }
    res.json({
        quantity_prices,
        calculated_price,
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3F1YW50aXR5LXByaWNpbmcvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFjQSxrQkE2RUM7QUExRkQsb0VBQXVFO0FBR3ZFLHlGQUc2RDtBQUM3RCx5RkFHNkQ7QUFDN0QsZ0ZBQW1HO0FBRTVGLEtBQUssVUFBVSxHQUFHLENBQUMsR0FBa0IsRUFBRSxHQUFtQjtJQUMvRCxNQUFNLEtBQUssR0FBRyx3Q0FBOEIsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzdELE1BQU0sYUFBYSxHQUF5QixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FDM0Qsc0NBQXFCLENBQ3RCLENBQUE7SUFFRCxNQUFNLFFBQVEsR0FBRyxNQUFNLGFBQWEsQ0FBQyxRQUFRLENBQUM7UUFDNUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO1FBQzVCLEdBQUcsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN0RSxpQkFBaUIsRUFBRSxLQUFLLENBQUMsaUJBQWlCO1FBQzFDLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUztLQUMzQixDQUFDLENBQUE7SUFFRiwwRkFBMEY7SUFDMUYsTUFBTSxlQUFlLEdBQ25CLEtBQUssQ0FBQyxVQUFVLElBQUksSUFBSTtRQUN0QixDQUFDLENBQUMsSUFBQSxtQ0FBa0IsRUFBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUNoRCxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUE7SUFFM0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUM1QixHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ1AsZUFBZSxFQUFFLEVBQUU7WUFDbkIsZ0JBQWdCLEVBQUUsSUFBSTtTQUN2QixDQUFDLENBQUE7UUFDRixPQUFNO0lBQ1IsQ0FBQztJQUVELElBQUksZ0JBQWdCLEdBQWdDLElBQUksQ0FBQTtJQUV4RCxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNuQixNQUFNLFlBQVksR0FDaEIsS0FBSyxDQUFDLFVBQVUsSUFBSSxJQUFJO1lBQ3RCLENBQUMsQ0FBQyxJQUFBLG1DQUFrQixFQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDO1lBQ2hELENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUUzQyxNQUFNLFFBQVEsR0FBRyxJQUFBLHlDQUF3QixFQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFO1lBQ3RFLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVSxJQUFJLElBQUk7WUFDcEMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixJQUFJLElBQUk7WUFDbEQsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLElBQUksSUFBSTtTQUNuQyxDQUFDLENBQUE7UUFFRixNQUFNLFlBQVksR0FDaEIsS0FBSyxDQUFDLGFBQWE7WUFDbkIsUUFBUSxFQUFFLGFBQWE7WUFDdkIsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLGFBQWE7WUFDOUIsS0FBSyxDQUFBO1FBRVAsSUFBSSxlQUFlLEdBQUcsS0FBSyxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUE7UUFFbkQsSUFBSSxlQUFlLElBQUksSUFBSSxFQUFFLENBQUM7WUFDNUIsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFBLDhDQUE2QixFQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQzdELEtBQUssQ0FBQyxVQUFVO2FBQ2pCLENBQUMsQ0FBQTtZQUNGLGVBQWUsR0FBRyxJQUFBLHdDQUF1QixFQUN2QyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUN6QjtnQkFDRSxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVUsSUFBSSxJQUFJO2dCQUNwQyxhQUFhLEVBQUUsWUFBWTthQUM1QixDQUNGLENBQUE7UUFDSCxDQUFDO1FBRUQsZ0JBQWdCLEdBQUcsTUFBTSxhQUFhLENBQUMsY0FBYyxDQUFDO1lBQ3BELFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtZQUM1QixVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVUsSUFBSSxJQUFJO1lBQ3BDLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtZQUN4QixhQUFhLEVBQUUsWUFBWTtZQUMzQixlQUFlO1lBQ2YsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixJQUFJLElBQUk7WUFDbEQsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLElBQUksSUFBSTtTQUNuQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsR0FBRyxDQUFDLElBQUksQ0FBQztRQUNQLGVBQWU7UUFDZixnQkFBZ0I7S0FDakIsQ0FBQyxDQUFBO0FBQ0osQ0FBQyJ9