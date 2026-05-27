# Changelog

All notable changes to [`@webbycrown/medusa-quantity-pricing`](https://www.npmjs.com/package/@webbycrown/medusa-quantity-pricing) are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Pricing types** per tier: `fixed`, `percentage`, and `fixed_discount`
- Admin **Pricing type** selector and amount grid with live catalog / tier unit price preview
- `reference_unit_price` on rules — manual list price for discount tiers when variant catalog prices are missing
- `GET /admin/quantity-pricing/catalog-prices` — batch variant catalog unit prices for the admin UI
- Store API `base_unit_price` query param (auto-resolved from Medusa catalog when omitted)
- Admin **Edit** (pencil) on **Settings → Extensions → Quantity Pricing** and on the product detail widget
- Shared `QuantityPricingRulesManager` for create, edit, and delete in one component
- Form prefill via `initialRule` when editing an existing tier
- Migration `Migration20260526150000` — `pricing_type` column
- Migration `Migration20260526160000` — `reference_unit_price` and `raw_reference_unit_price` columns

### Changed

- `useUpdateQuantityPriceRule` mutation signature: `{ id, data }` instead of a flat payload
- Store API returns `pricing_type`, `reference_unit_price`, and richer `calculated_price` (includes `pricing_type`, `rule_value`, `base_unit_price`)
- `resolveQuantityUnitPrice` accepts optional `rule_id` to pin a specific tier at add-to-cart time

### Fixed

- Migration `Migration20260526140000` backfills `raw_price` for installs created before `bigNumber` metadata was required

---

## [1.0.0] - 2026-05-26

Initial public release.

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

#### Public exports

- `PRICING_ENGINE_MODULE`, `pricingEngineModule`, `PricingEngineService`
- `resolveQuantityUnitPrice`, `fetchCatalogPricesForProducts`, `getBaseUnitPriceForRule`
- TypeScript types and `@webbycrown/medusa-quantity-pricing/workflows`

#### Documentation

- README with installation, API reference, storefront guide, and troubleshooting

### Requirements

- Node.js 20+
- Medusa v2.13+ (`@medusajs/framework` ^2.13)
- Register under `plugins` in `medusa-config.ts` (module auto-registers)

---

[Unreleased]: https://github.com/webbycrown/medusa-quantity-pricing/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/webbycrown/medusa-quantity-pricing/releases/tag/v1.0.0
