# Medusa Quantity Pricing Rules

[![npm version](https://img.shields.io/npm/v/@webbycrown/medusa-quantity-pricing-rules.svg)](https://www.npmjs.com/package/@webbycrown/medusa-quantity-pricing-rules)

Medusa v2 plugin for **quantity range pricing** (volume / tiered / wholesale). Set unit prices by quantity with fixed prices, percentage discounts, or fixed amount-off tiers.

[![Watch the Medusa Quantity Pricing Rules demo on YouTube](https://raw.githubusercontent.com/webbycrown/medusa-quantity-pricing/main/public/Play.png)](https://www.youtube.com/watch?v=CjBjc7j3H6g)

**Watch demo:** [https://www.youtube.com/watch?v=CjBjc7j3H6g](https://www.youtube.com/watch?v=CjBjc7j3H6g)

## Features

- PostgreSQL `quantity_prices` table (module + migrations)
- Pricing types: `fixed`, `percentage`, `fixed_discount`
- Admin API (CRUD + Zod validation) and Store API (list tiers, calculate price)
- Admin UI: **Settings → Extensions → Quantity Pricing**, per-product widget, store summary widget
- Workflows with compensation (create / update / delete)
- Auto cleanup on `product.deleted`
- Optional variant, region, and customer-group scoping
- Exported helpers: `resolveQuantityUnitPrice`, catalog utilities, workflows



## Requirements

| Requirement | Version |
|-------------|---------|
| Node.js | 20+ |
| Medusa | v2.13+ (`@medusajs/framework` ^2.13) |


![Quantity pricing admin — product tiers with fixed price or discounts](https://raw.githubusercontent.com/webbycrown/medusa-quantity-pricing/main/public/walkthrough-img.png)

## Installation

```bash
npm install @webbycrown/medusa-quantity-pricing-rules
```

Register in `medusa-config.ts`:

```ts
import { defineConfig } from "@medusajs/framework/utils"

export default defineConfig({
  plugins: [
    {
      resolve: "@webbycrown/medusa-quantity-pricing-rules",
      options: {},
    },
  ],
})
```

> Registers the `pricingEngine` module automatically. Do **not** add a duplicate entry under `modules`.

Run migrations and start Medusa:

```bash
npx medusa db:migrate
npm run dev
```

Open Admin → **Settings → Extensions → Quantity Pricing** to create tiers.

## Admin UI

| Location | Purpose |
|----------|---------|
| **Settings → Extensions → Quantity Pricing** | List, create, edit, delete rules |
| **Products → [product]** | Tiers for that product (product ID pre-filled) |
| **Settings → Store** | Rule count + link to settings |

### Tier fields

| Field | Description |
|-------|-------------|
| **Product ID** | Required (auto-filled on product page) |
| **Variant** | Optional — empty = all variants |
| **Min qty** | Minimum quantity (e.g. `1`) |
| **Max qty** | Upper bound; empty = open-ended (e.g. `51+`) |
| **Pricing type** | `fixed`, `percentage`, or `fixed_discount` |
| **Discount / unit price** | See [Pricing types](#pricing-types) |
| **Currency** | ISO 4217, e.g. `inr`, `usd` |
| **List price (reference)** | For discount tiers when catalog price is missing |

Non-overlapping ranges per product + currency are recommended. When ranges overlap, the tier with the **highest `min_qty`** that still fits the quantity wins.

## Pricing types

| Type | `price` means | Resolved unit price |
|------|----------------|---------------------|
| `fixed` | Tier unit price | `price` |
| `percentage` | Percent off catalog (e.g. `10` = 10% off) | `base × (1 − price/100)` |
| `fixed_discount` | Amount off per unit | `max(base − price, 0)` |

`base` is resolved in order:

1. `base_unit_price` on Store API / `resolveQuantityUnitPrice`
2. Medusa variant catalog price for `currency_code`
3. `reference_unit_price` on the rule

## Store API

**`GET /store/quantity-pricing`** — requires a publishable API key.

| Param | Required | Description |
|-------|----------|-------------|
| `product_id` | Yes | Product to load tiers for |
| `variant_id` | No | Variant-specific rules + product-level fallback |
| `currency_code` | No | Filter / calculation currency |
| `customer_group_id` | No | B2B segment |
| `region_id` | No | Regional override |
| `quantity` | No | When set, includes `calculated_price` |
| `base_unit_price` | No | Catalog price for discount tiers |


```http
GET /store/quantity-pricing?product_id=prod_01XXXX&currency_code=inr&quantity=25
```

```json
{
  "quantity_prices": [],
  "calculated_price": {
    "unit_price": 90,
    "quantity": 25,
    "currency_code": "inr",
    "rule_id": "qprice_02...",
    "pricing_type": "fixed",
    "line_total": 2250
  }
}
```

Without `variant_id`, only product-level tiers (`variant_id = null`) are returned.

## Admin API

Authenticated admin session or token.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/admin/quantity-pricing` | List rules |
| `POST` | `/admin/quantity-pricing` | Create rule |
| `GET` | `/admin/quantity-pricing/:id` | Get rule |
| `PUT` | `/admin/quantity-pricing/:id` | Update rule |
| `DELETE` | `/admin/quantity-pricing/:id` | Delete rule |
| `GET` | `/admin/quantity-pricing/catalog-prices` | Variant catalog prices |

**Create fixed tier:**

```json
{
  "product_id": "prod_01XXXXXXXX",
  "min_qty": 1,
  "max_qty": 10,
  "pricing_type": "fixed",
  "price": 100,
  "currency_code": "inr"
}
```

**Open-ended tier (51+):** set `"max_qty": null`.

## Package exports

```ts
import {
  PRICING_ENGINE_MODULE,
  resolveQuantityUnitPrice,
  fetchCatalogPricesForProducts,
} from "@webbycrown/medusa-quantity-pricing-rules"

const unitPrice = await resolveQuantityUnitPrice(container, {
  product_id: "prod_01...",
  variant_id: "variant_01...",
  quantity: 25,
  currency_code: "inr",
  rule_id: "qprice_02...", // optional — pin selected tier
})

const pricingEngine = container.resolve(PRICING_ENGINE_MODULE)
const result = await pricingEngine.calculatePrice({
  product_id: "prod_01...",
  quantity: 25,
  currency_code: "inr",
})
```

```ts
import {
  createQuantityPricingRuleWorkflow,
  updateQuantityPricingRuleWorkflow,
  deleteQuantityPricingRuleWorkflow,
} from "@webbycrown/medusa-quantity-pricing-rules/workflows"
```

| Export | Purpose |
|--------|---------|
| `PRICING_ENGINE_MODULE` | Container key (`"pricingEngine"`) |
| `pricingEngineModule` | Module definition |
| `PricingEngineService` | Service class |
| `resolveQuantityUnitPrice` | Resolve tier unit price (cart / checkout) |
| `fetchCatalogPricesForProducts` | Batch catalog prices |
| `getBaseUnitPriceForRule` | Base price for a rule |
| Types | `QuantityPriceRuleDTO`, `CalculatePriceInput`, `PricingType`, … |
| `./workflows` | Create / update / delete workflows |

The plugin does not modify cart line items automatically. Use `resolveQuantityUnitPrice` in your add-to-cart flow when a tier applies.

## Tier matching

1. Load rules for `product_id` (+ optional filters).
2. Prefer variant-specific rules when `variant_id` is set.
3. Match `min_qty ≤ quantity` and (`max_qty` is null or `quantity ≤ max_qty`).
4. Highest matching `min_qty` wins.
5. Resolve unit price from `pricing_type` and base price sources.

## Database

Table **`quantity_prices`**: `product_id`, `variant_id`, `min_qty`, `max_qty`, `pricing_type`, `price`, `currency_code`, `reference_unit_price`, `customer_group_id`, `region_id`.

After model changes in a fork:

```bash
npx medusa db:generate pricingEngine
npx medusa db:migrate
```

## Troubleshooting

| Issue | Check |
|-------|--------|
| Admin page not found | Rebuild plugin (`npm run build` in package) and restart Medusa |
| Empty `quantity_prices` on store | Rules exist for `product_id` + `currency_code`; pass `variant_id` if needed |
| Wrong discount price | Variant catalog price or `reference_unit_price`; pass `base_unit_price` |
| Wrong tier | Overlapping ranges — highest `min_qty` wins |
| Module not found | Plugin under `plugins` in `medusa-config.ts`, not duplicated under `modules` |

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## Author

**WebbyCrown** — [info@webbycrown.com](mailto:info@webbycrown.com) · [webbycrown.com](https://webbycrown.com)
