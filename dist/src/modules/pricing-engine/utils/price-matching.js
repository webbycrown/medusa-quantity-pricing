"use strict";
/**
 * Pure pricing logic — no database or Medusa container dependencies.
 *
 * Isolating matching here makes unit testing trivial and allows the same
 * algorithm to run in cart workflows, storefront previews, and B2B quotes.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNumber = toNumber;
exports.sortRulesByMinQty = sortRulesByMinQty;
exports.findMatchingRule = findMatchingRule;
exports.preferVariantRules = preferVariantRules;
exports.ruleSpecificityScore = ruleSpecificityScore;
exports.selectBestRuleForContext = selectBestRuleForContext;
/** Normalize DB/API numeric values (BigNumber JSON, strings, etc.) */
function toNumber(value) {
    if (value === null || value === undefined) {
        return NaN;
    }
    if (typeof value === "number") {
        return value;
    }
    if (typeof value === "object" && value !== null && "numeric" in value) {
        return Number(value.numeric);
    }
    if (typeof value === "object" && value !== null && "value" in value) {
        return Number(value.value);
    }
    return Number(value);
}
function sortRulesByMinQty(rules) {
    return [...rules].sort((a, b) => a.min_qty - b.min_qty);
}
/**
 * Pick the best matching tier for a quantity.
 *
 * - Open-ended tiers use max_qty = null (qty 51+ in your example).
 * - When multiple rules match (overlapping ranges), the highest min_qty wins
 *   (most specific tier).
 */
function findMatchingRule(quantity, rules) {
    if (!rules.length || quantity < 1) {
        return null;
    }
    const sorted = sortRulesByMinQty(rules);
    let best = null;
    for (const rule of sorted) {
        const withinMin = quantity >= rule.min_qty;
        const withinMax = rule.max_qty === null || quantity <= rule.max_qty;
        if (withinMin && withinMax) {
            if (!best || rule.min_qty >= best.min_qty) {
                best = rule;
            }
        }
    }
    return best;
}
/**
 * Resolve rules for store/admin display: variant-specific rows first,
 * then product-level fallbacks (variant_id is null).
 */
function preferVariantRules(rules, variantId) {
    if (!variantId) {
        return rules.filter((r) => !r.variant_id);
    }
    const variantRules = rules.filter((r) => r.variant_id === variantId);
    if (variantRules.length) {
        return variantRules;
    }
    return rules.filter((r) => !r.variant_id);
}
/**
 * Score how specific a rule is for contextual pricing (B2B, region, etc.).
 * Higher score = better match when multiple rules qualify.
 */
function ruleSpecificityScore(rule, context) {
    let score = 0;
    if (context.variant_id && rule.variant_id === context.variant_id) {
        score += 8;
    }
    else if (!rule.variant_id) {
        score += 1;
    }
    else {
        return -1;
    }
    if (context.customer_group_id) {
        if (rule.customer_group_id === context.customer_group_id) {
            score += 4;
        }
        else if (!rule.customer_group_id) {
            score += 1;
        }
        else {
            return -1;
        }
    }
    else if (!rule.customer_group_id) {
        score += 2;
    }
    else {
        return -1;
    }
    if (context.region_id) {
        if (rule.region_id === context.region_id) {
            score += 4;
        }
        else if (!rule.region_id) {
            score += 1;
        }
        else {
            return -1;
        }
    }
    else if (!rule.region_id) {
        score += 2;
    }
    else {
        return -1;
    }
    return score;
}
function selectBestRuleForContext(quantity, rules, context) {
    const variantScoped = preferVariantRules(rules, context.variant_id);
    const quantityMatches = variantScoped.filter((rule) => {
        const withinMin = quantity >= rule.min_qty;
        const withinMax = rule.max_qty === null || quantity <= rule.max_qty;
        return withinMin && withinMax;
    });
    if (!quantityMatches.length) {
        return null;
    }
    let best = null;
    let bestScore = -1;
    for (const rule of quantityMatches) {
        const score = ruleSpecificityScore(rule, context);
        if (score < 0) {
            continue;
        }
        if (score > bestScore ||
            (score === bestScore && rule.min_qty > (best?.min_qty ?? 0))) {
            best = rule;
            bestScore = score;
        }
    }
    return best;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpY2UtbWF0Y2hpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcmljaW5nLWVuZ2luZS91dGlscy9wcmljZS1tYXRjaGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7O0dBS0c7O0FBS0gsNEJBY0M7QUFFRCw4Q0FJQztBQVNELDRDQXdCQztBQU1ELGdEQWNDO0FBTUQsb0RBK0NDO0FBRUQsNERBc0NDO0FBdktELHNFQUFzRTtBQUN0RSxTQUFnQixRQUFRLENBQUMsS0FBYztJQUNyQyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRSxDQUFDO1FBQzFDLE9BQU8sR0FBRyxDQUFBO0lBQ1osQ0FBQztJQUNELElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFLENBQUM7UUFDOUIsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDO0lBQ0QsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxTQUFTLElBQUksS0FBSyxFQUFFLENBQUM7UUFDdEUsT0FBTyxNQUFNLENBQUUsS0FBNkIsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUN2RCxDQUFDO0lBQ0QsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxPQUFPLElBQUksS0FBSyxFQUFFLENBQUM7UUFDcEUsT0FBTyxNQUFNLENBQUUsS0FBMkIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBQ0QsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDdEIsQ0FBQztBQUVELFNBQWdCLGlCQUFpQixDQUMvQixLQUFVO0lBRVYsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFD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