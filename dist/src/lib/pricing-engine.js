"use strict";
/**
 * Application-level helper — resolves PricingEngineService from the container.
 * Use in cart routes, custom line-item flows, and subscribers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveQuantityUnitPrice = resolveQuantityUnitPrice;
const pricing_engine_1 = require("../modules/pricing-engine");
const catalog_prices_1 = require("../modules/pricing-engine/utils/catalog-prices");
const price_resolution_1 = require("../modules/pricing-engine/utils/price-resolution");
function quantityMatchesRule(quantity, rule) {
    if (quantity < rule.min_qty) {
        return false;
    }
    if (rule.max_qty != null && quantity > rule.max_qty) {
        return false;
    }
    return true;
}
async function resolveQuantityUnitPrice(container, input) {
    const pricingEngine = container.resolve(pricing_engine_1.PRICING_ENGINE_MODULE);
    if (input.rule_id) {
        try {
            const rule = await pricingEngine.retrieveRule(input.rule_id);
            if (rule.product_id !== input.product_id) {
                return null;
            }
            if (!quantityMatchesRule(input.quantity, rule)) {
                return null;
            }
            if (input.variant_id &&
                rule.variant_id &&
                rule.variant_id !== input.variant_id) {
                return null;
            }
            let base_unit_price = input.base_unit_price ?? null;
            if (base_unit_price == null) {
                const catalog = await (0, catalog_prices_1.fetchCatalogPricesForProducts)(container, [
                    input.product_id,
                ]);
                base_unit_price = (0, catalog_prices_1.getBaseUnitPriceForRule)(catalog[input.product_id], {
                    variant_id: input.variant_id ?? null,
                    currency_code: rule.currency_code,
                });
            }
            if (base_unit_price == null && rule.reference_unit_price != null) {
                base_unit_price = rule.reference_unit_price;
            }
            return (0, price_resolution_1.resolveUnitPriceFromRule)({ pricing_type: rule.pricing_type, price: rule.price }, base_unit_price);
        }
        catch {
            return null;
        }
    }
    const result = await pricingEngine.calculatePrice(input);
    return result?.unit_price ?? null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpY2luZy1lbmdpbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3ByaWNpbmctZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0dBR0c7O0FBbUNILDREQTBEQztBQTNGRCw4REFBaUU7QUFHakUsbUZBR3VEO0FBQ3ZELHVGQUEyRjtBQVczRixTQUFTLG1CQUFtQixDQUMxQixRQUFnQixFQUNoQixJQUFpRDtJQUVqRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDNUIsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDO0lBRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BELE9BQU8sS0FBSyxDQUFBO0lBQ2QsQ0FBQztJQUVELE9BQU8sSUFBSSxDQUFBO0FBQ2IsQ0FBQztBQUVNLEtBQUssVUFBVSx3QkFBd0IsQ0FDNUMsU0FBd0IsRUFDeEIsS0FBb0M7SUFFcEMsTUFBTSxhQUFhLEdBQ2pCLFNBQVMsQ0FBQyxPQUFPLENBQUMsc0NBQXFCLENBQUMsQ0FBQTtJQUUxQyxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUM7WUFDSCxNQUFNLElBQUksR0FBRyxNQUFNLGFBQWEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBRTVELElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ3pDLE9BQU8sSUFBSSxDQUFBO1lBQ2IsQ0FBQztZQUVELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQy9DLE9BQU8sSUFBSSxDQUFBO1lBQ2IsQ0FBQztZQUVELElBQ0UsS0FBSyxDQUFDLFVBQVU7Z0JBQ2hCLElBQUksQ0FBQyxVQUFVO2dCQUNmLElBQUksQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDLFVBQVUsRUFDcEMsQ0FBQztnQkFDRCxPQUFPLElBQUksQ0FBQTtZQUNiLENBQUM7WUFFRCxJQUFJLGVBQWUsR0FBRyxLQUFLLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQTtZQUVuRCxJQUFJLGVBQWUsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDNUIsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFBLDhDQUE2QixFQUFDLFNBQVMsRUFBRTtvQkFDN0QsS0FBSyxDQUFDLFVBQVU7aUJBQ2pCLENBQUMsQ0FBQTtnQkFFRixlQUFlLEdBQUcsSUFBQSx3Q0FBdUIsRUFDdkMsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFDekI7b0JBQ0UsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVLElBQUksSUFBSTtvQkFDcEMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhO2lCQUNsQyxDQUNGLENBQUE7WUFDSCxDQUFDO1lBRUQsSUFBSSxlQUFlLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxvQkFBb0IsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDakUsZUFBZSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQTtZQUM3QyxDQUFDO1lBRUQsT0FBTyxJQUFBLDJDQUF3QixFQUM3QixFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQ3RELGVBQWUsQ0FDaEIsQ0FBQTtRQUNILENBQUM7UUFBQyxNQUFNLENBQUM7WUFDUCxPQUFPLElBQUksQ0FBQTtRQUNiLENBQUM7SUFDSCxDQUFDO0lBRUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxhQUFhLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ3hELE9BQU8sTUFBTSxFQUFFLFVBQVUsSUFBSSxJQUFJLENBQUE7QUFDbkMsQ0FBQyJ9