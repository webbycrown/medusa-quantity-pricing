# Changelog

All notable changes to [`@webbycrown/medusa-quantity-pricing-rules`](https://www.npmjs.com/package/@webbycrown/medusa-quantity-pricing-rules) are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),


## [1.0.0] - 2026-05-27

**Initial public release.**

### Added

#### Core module

- `pricingEngine` Medusa module with PostgreSQL `quantity_prices` table
- `PricingEngineService` — CRUD, list filters, and runtime `calculatePrice`
- DML model: `product_id`, optional `variant_id`, `min_qty`, `max_qty`, `price`, `currency_code`, optional `customer_group_id` and `region_id`
- Database migration with indexes and `raw_price` (`bigNumber`) support
- Tier matching: highest matching `min_qty` wins; variant-specific rules preferred when `variant_id` is set
- `product.deleted` subscriber removes all rules for the deleted product

#### Workflows

- `createQuantityPricingRuleWorkflow` with compensation
- `updateQuantityPricingRuleWorkflow` with compensation
- `deleteQuantityPricingRuleWorkflow` with compensation

#### Admin API

- `GET /admin/quantity-pricing` — list rules (filters + pagination)
- `POST /admin/quantity-pricing` — create rule
- `GET /admin/quantity-pricing/:id` — retrieve rule
- `PUT /admin/quantity-pricing/:id` — update rule
- `DELETE /admin/quantity-pricing/:id` — delete rule
- Zod validation and admin auth middleware on `/admin/quantity-pricing*`

#### Store API

- `GET /store/quantity-pricing` — list tiers; optional `calculated_price` when `quantity` is provided

#### Admin UI

- **Settings → Extensions → Quantity Pricing** — global rules management
- **Product detail** widget — per-product tiers with variant selector
- **Settings → Store** widget — rule count and quick link
- `QuantityPricingForm` for creating tiers

#### Documentation

- README with installation, API reference, storefront guide, and troubleshooting

### Requirements

- Node.js 20+
- Medusa v2.13+ (`@medusajs/framework` ^2.13)
- Register under `plugins` in `medusa-config.ts` (module auto-registers)

---

[Unreleased]: https://github.com/webbycrown/medusa-quantity-pricing/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/webbycrown/medusa-quantity-pricing/releases/tag/v1.0.0
