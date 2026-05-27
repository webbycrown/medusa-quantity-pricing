"use strict";
/**
 * Builds MikroORM / MedusaService list filters from API query params.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildListFilters = buildListFilters;
function buildListFilters(filters) {
    const where = {};
    if (filters.product_id) {
        where.product_id = filters.product_id;
    }
    if (filters.variant_id !== undefined) {
        where.variant_id = filters.variant_id;
    }
    if (filters.currency_code) {
        where.currency_code = filters.currency_code.toLowerCase();
    }
    if (filters.customer_group_id) {
        where.customer_group_id = filters.customer_group_id;
    }
    else if (filters.default_customer_group) {
        where.customer_group_id = null;
    }
    if (filters.region_id) {
        where.region_id = filters.region_id;
    }
    else if (filters.default_region) {
        where.region_id = null;
    }
    return where;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZS1maWx0ZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvcHJpY2luZy1lbmdpbmUvdXRpbHMvcnVsZS1maWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7QUFJSCw0Q0E4QkM7QUE5QkQsU0FBZ0IsZ0JBQWdCLENBQzlCLE9BQXFDO0lBRXJDLE1BQU0sS0FBSyxHQUE0QixFQUFFLENBQUE7SUFFekMsSUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDdkIsS0FBSyxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFBO0lBQ3ZDLENBQUM7SUFFRCxJQUFJLE9BQU8sQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFLENBQUM7UUFDckMsS0FBSyxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFBO0lBQ3ZDLENBQUM7SUFFRCxJQUFJLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMxQixLQUFLLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUE7SUFDM0QsQ0FBQztJQUVELElBQUksT0FBTyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDOUIsS0FBSyxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQTtJQUNyRCxDQUFDO1NBQU0sSUFBSSxPQUFPLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUMxQyxLQUFLLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFBO0lBQ2hDLENBQUM7SUFFRCxJQUFJLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN0QixLQUFLLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUE7SUFDckMsQ0FBQztTQUFNLElBQUksT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ2xDLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBO0lBQ3hCLENBQUM7SUFFRCxPQUFPLEtBQUssQ0FBQTtBQUNkLENBQUMifQ==