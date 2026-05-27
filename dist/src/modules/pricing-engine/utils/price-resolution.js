"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundMoney = roundMoney;
exports.resolveUnitPriceFromRule = resolveUnitPriceFromRule;
function roundMoney(amount) {
    return Math.round(amount * 100) / 100;
}
/**
 * Resolve final unit price from a rule and optional catalog/base price.
 * - fixed: uses rule.price as unit price
 * - percentage: rule.price = % off (e.g. 10 → 10% off)
 * - fixed_discount: rule.price = amount subtracted from base unit price
 */
function resolveUnitPriceFromRule(rule, baseUnitPrice) {
    const type = rule.pricing_type;
    const value = Number(rule.price);
    if (type === "fixed") {
        return value;
    }
    if (baseUnitPrice == null || !Number.isFinite(baseUnitPrice)) {
        return value;
    }
    if (type === "percentage") {
        return Math.max(0, roundMoney(baseUnitPrice * (1 - value / 100)));
    }
    if (type === "fixed_discount") {
        return Math.max(0, roundMoney(baseUnitPrice - value));
    }
    return value;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpY2UtcmVzb2x1dGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3ByaWNpbmctZW5naW5lL3V0aWxzL3ByaWNlLXJlc29sdXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFPQSxnQ0FFQztBQVFELDREQXdCQztBQWxDRCxTQUFnQixVQUFVLENBQUMsTUFBYztJQUN2QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtBQUN2QyxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQix3QkFBd0IsQ0FDdEMsSUFBb0IsRUFDcEIsYUFBNkI7SUFFN0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQTtJQUM5QixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBRWhDLElBQUksSUFBSSxLQUFLLE9BQU8sRUFBRSxDQUFDO1FBQ3JCLE9BQU8sS0FBSyxDQUFBO0lBQ2QsQ0FBQztJQUVELElBQUksYUFBYSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQztRQUM3RCxPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUM7SUFFRCxJQUFJLElBQUksS0FBSyxZQUFZLEVBQUUsQ0FBQztRQUMxQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNuRSxDQUFDO0lBRUQsSUFBSSxJQUFJLEtBQUssZ0JBQWdCLEVBQUUsQ0FBQztRQUM5QixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUN2RCxDQUFDO0lBRUQsT0FBTyxLQUFLLENBQUE7QUFDZCxDQUFDIn0=