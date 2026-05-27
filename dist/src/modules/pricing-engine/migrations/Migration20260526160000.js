"use strict";
/**
 * Optional list price for discount tiers when the product has no variants
 * (or Medusa variant prices are not set).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20260526160000 = void 0;
const migrations_1 = require("@medusajs/framework/mikro-orm/migrations");
class Migration20260526160000 extends migrations_1.Migration {
    async up() {
        this.addSql(`
      ALTER TABLE "quantity_prices"
      ADD COLUMN IF NOT EXISTS "reference_unit_price" numeric NULL;
    `);
        this.addSql(`
      ALTER TABLE "quantity_prices"
      ADD COLUMN IF NOT EXISTS "raw_reference_unit_price" jsonb NULL;
    `);
    }
    async down() {
        this.addSql(`
      ALTER TABLE "quantity_prices"
      DROP COLUMN IF EXISTS "raw_reference_unit_price";
    `);
        this.addSql(`
      ALTER TABLE "quantity_prices"
      DROP COLUMN IF EXISTS "reference_unit_price";
    `);
    }
}
exports.Migration20260526160000 = Migration20260526160000;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNjA1MjYxNjAwMDAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcmljaW5nLWVuZ2luZS9taWdyYXRpb25zL01pZ3JhdGlvbjIwMjYwNTI2MTYwMDAwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0dBR0c7OztBQUVILHlFQUFvRTtBQUVwRSxNQUFhLHVCQUF3QixTQUFRLHNCQUFTO0lBQzNDLEtBQUssQ0FBQyxFQUFFO1FBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7O0tBR1gsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7O0tBR1gsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVRLEtBQUssQ0FBQyxJQUFJO1FBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUM7OztLQUdYLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxNQUFNLENBQUM7OztLQUdYLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRjtBQXhCRCwwREF3QkMifQ==