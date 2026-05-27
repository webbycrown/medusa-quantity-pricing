"use strict";
/**
 * PostgreSQL migration for quantity_prices.
 *
 * `model.bigNumber()` on `price` requires both:
 * - price (numeric)
 * - raw_price (jsonb) — BigNumber precision metadata
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20260526120000 = void 0;
const migrations_1 = require("@medusajs/framework/mikro-orm/migrations");
class Migration20260526120000 extends migrations_1.Migration {
    async up() {
        this.addSql(`
      create table if not exists "quantity_prices" (
        "id" text not null,
        "product_id" text not null,
        "variant_id" text null,
        "min_qty" integer not null,
        "max_qty" integer null,
        "price" numeric not null,
        "raw_price" jsonb not null,
        "currency_code" text not null,
        "customer_group_id" text null,
        "region_id" text null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "quantity_prices_pkey" primary key ("id")
      );
    `);
        this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_quantity_prices_product_id"
      ON "quantity_prices" ("product_id")
      WHERE deleted_at IS NULL;
    `);
        this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_quantity_prices_variant_id"
      ON "quantity_prices" ("variant_id")
      WHERE deleted_at IS NULL;
    `);
        this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_quantity_prices_currency_code"
      ON "quantity_prices" ("currency_code")
      WHERE deleted_at IS NULL;
    `);
        this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_quantity_prices_customer_group_id"
      ON "quantity_prices" ("customer_group_id")
      WHERE deleted_at IS NULL;
    `);
        this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_quantity_prices_region_id"
      ON "quantity_prices" ("region_id")
      WHERE deleted_at IS NULL;
    `);
        this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_quantity_prices_deleted_at"
      ON "quantity_prices" ("deleted_at")
      WHERE deleted_at IS NULL;
    `);
        this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_quantity_prices_lookup"
      ON "quantity_prices" ("product_id", "currency_code", "min_qty")
      WHERE deleted_at IS NULL;
    `);
    }
    async down() {
        this.addSql(`drop table if exists "quantity_prices" cascade;`);
    }
}
exports.Migration20260526120000 = Migration20260526120000;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNjA1MjYxMjAwMDAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcmljaW5nLWVuZ2luZS9taWdyYXRpb25zL01pZ3JhdGlvbjIwMjYwNTI2MTIwMDAwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILHlFQUFvRTtBQUVwRSxNQUFhLHVCQUF3QixTQUFRLHNCQUFTO0lBQzNDLEtBQUssQ0FBQyxFQUFFO1FBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FpQlgsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7OztLQUlYLENBQUMsQ0FBQTtRQUNGLElBQUksQ0FBQyxNQUFNLENBQUM7Ozs7S0FJWCxDQUFDLENBQUE7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDOzs7O0tBSVgsQ0FBQyxDQUFBO1FBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7OztLQUlYLENBQUMsQ0FBQTtRQUNGLElBQUksQ0FBQyxNQUFNLENBQUM7Ozs7S0FJWCxDQUFDLENBQUE7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDOzs7O0tBSVgsQ0FBQyxDQUFBO1FBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7OztLQUlYLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFUSxLQUFLLENBQUMsSUFBSTtRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLGlEQUFpRCxDQUFDLENBQUE7SUFDaEUsQ0FBQztDQUNGO0FBN0RELDBEQTZEQyJ9