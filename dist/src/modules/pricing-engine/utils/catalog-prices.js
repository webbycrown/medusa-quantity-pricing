"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeAmountFromPrice = normalizeAmountFromPrice;
exports.buildCatalogPriceMap = buildCatalogPriceMap;
exports.getBaseUnitPriceForRule = getBaseUnitPriceForRule;
exports.fetchCatalogPricesForProducts = fetchCatalogPricesForProducts;
const utils_1 = require("@medusajs/framework/utils");
function amountToNumber(amount) {
    if (amount == null) {
        return null;
    }
    if (typeof amount === "number" && Number.isFinite(amount)) {
        return amount;
    }
    if (typeof amount === "string") {
        const parsed = Number(amount);
        return Number.isFinite(parsed) ? parsed : null;
    }
    if (typeof amount === "object") {
        const record = amount;
        if ("value" in record) {
            const fromValue = amountToNumber(record.value);
            if (fromValue != null) {
                return fromValue;
            }
        }
        try {
            const bn = utils_1.MathBN.convert(amount);
            return Number(bn.toString());
        }
        catch {
            return null;
        }
    }
    return null;
}
/** Standard catalog price (not sale/price-list), typically qty 1 */
function isBaseCatalogPrice(price) {
    if (price.price_list_id) {
        return false;
    }
    const min = price.min_quantity;
    const max = price.max_quantity;
    if (min != null && min > 1) {
        return false;
    }
    if (max != null && max < 1) {
        return false;
    }
    return true;
}
function normalizeAmountFromPrice(price) {
    const fromRaw = amountToNumber(price.raw_amount);
    if (fromRaw != null) {
        return fromRaw;
    }
    return amountToNumber(price.amount);
}
function pickPriceForCurrency(prices, currencyCode) {
    const code = currencyCode.toLowerCase();
    const forCurrency = prices.filter((p) => p.currency_code?.toLowerCase() === code);
    if (!forCurrency.length) {
        return null;
    }
    const basePrices = forCurrency.filter(isBaseCatalogPrice);
    const candidates = basePrices.length ? basePrices : forCurrency;
    let best = null;
    for (const price of candidates) {
        const amount = normalizeAmountFromPrice(price);
        if (amount == null || !Number.isFinite(amount)) {
            continue;
        }
        if (best == null || amount < best) {
            best = amount;
        }
    }
    return best;
}
function collectVariantPrices(variant) {
    return variant.price_set?.prices ?? [];
}
function buildCatalogPriceMap(variants) {
    const byVariantId = {};
    const defaultByCurrency = {};
    for (const variant of variants) {
        const prices = collectVariantPrices(variant);
        if (!prices.length) {
            continue;
        }
        const perCurrency = {};
        const currencies = [
            ...new Set(prices
                .map((p) => p.currency_code?.toLowerCase())
                .filter((c) => Boolean(c))),
        ];
        for (const code of currencies) {
            const amount = pickPriceForCurrency(prices, code);
            if (amount == null) {
                continue;
            }
            perCurrency[code] = amount;
            const existingDefault = defaultByCurrency[code];
            if (existingDefault == null || amount < existingDefault) {
                defaultByCurrency[code] = amount;
            }
        }
        if (Object.keys(perCurrency).length > 0) {
            byVariantId[variant.id] = perCurrency;
        }
    }
    return { byVariantId, defaultByCurrency };
}
function getBaseUnitPriceForRule(catalog, rule) {
    if (!catalog) {
        return null;
    }
    const code = rule.currency_code.toLowerCase();
    if (rule.variant_id) {
        const variantPrice = catalog.byVariantId[rule.variant_id]?.[code];
        if (variantPrice != null) {
            return variantPrice;
        }
    }
    return catalog.defaultByCurrency[code] ?? null;
}
async function fetchCatalogPricesForProducts(container, productIds, _currencyCodes = []) {
    const uniqueIds = [...new Set(productIds.filter(Boolean))];
    if (!uniqueIds.length) {
        return {};
    }
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const { data: variants } = await query.graph({
        entity: "variant",
        fields: [
            "id",
            "product_id",
            "price_set.id",
            "price_set.prices.amount",
            "price_set.prices.currency_code",
            "price_set.prices.raw_amount",
            "price_set.prices.min_quantity",
            "price_set.prices.max_quantity",
            "price_set.prices.price_list_id",
        ],
        filters: { product_id: uniqueIds },
    });
    const variantsByProduct = new Map();
    for (const variant of (variants ?? [])) {
        const productId = variant.product_id;
        if (!productId) {
            continue;
        }
        const list = variantsByProduct.get(productId) ?? [];
        list.push(variant);
        variantsByProduct.set(productId, list);
    }
    const catalog = {};
    for (const productId of uniqueIds) {
        catalog[productId] = buildCatalogPriceMap(variantsByProduct.get(productId) ?? []);
    }
    return catalog;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2F0YWxvZy1wcmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcmljaW5nLWVuZ2luZS91dGlscy9jYXRhbG9nLXByaWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQTRGQSw0REFPQztBQXNDRCxvREF1Q0M7QUFFRCwwREFrQkM7QUFFRCxzRUFrREM7QUF4UEQscURBQTZFO0FBcUM3RSxTQUFTLGNBQWMsQ0FBQyxNQUFlO0lBQ3JDLElBQUksTUFBTSxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ25CLE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQUVELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUMxRCxPQUFPLE1BQU0sQ0FBQTtJQUNmLENBQUM7SUFFRCxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRSxDQUFDO1FBQy9CLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUM3QixPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO0lBQ2hELENBQUM7SUFFRCxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRSxDQUFDO1FBQy9CLE1BQU0sTUFBTSxHQUFHLE1BQWlDLENBQUE7UUFFaEQsSUFBSSxPQUFPLElBQUksTUFBTSxFQUFFLENBQUM7WUFDdEIsTUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUM5QyxJQUFJLFNBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDdEIsT0FBTyxTQUFTLENBQUE7WUFDbEIsQ0FBQztRQUNILENBQUM7UUFFRCxJQUFJLENBQUM7WUFDSCxNQUFNLEVBQUUsR0FBRyxjQUFNLENBQUMsT0FB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