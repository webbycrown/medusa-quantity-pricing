"use strict";
/**
 * Adds raw_price for existing installs that ran Migration20260526120000
 * before raw_price was included (required by model.bigNumber() on price).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20260526140000 = void 0;
const migrations_1 = require("@medusajs/framework/mikro-orm/migrations");
class Migration20260526140000 extends migrations_1.Migration {
    async up() {
        this.addSql(`
      ALTER TABLE "quantity_prices"
      ADD COLUMN IF NOT EXISTS "raw_price" jsonb;
    `);
        this.addSql(`
      UPDATE "quantity_prices"
      SET "raw_price" = jsonb_build_object(
        'value', trim(trailing '0' from trim(trailing '.' from "price"::text)),
        'precision', 20
      )
      WHERE "raw_price" IS NULL;
    `);
        this.addSql(`
      ALTER TABLE "quantity_prices"
      ALTER COLUMN "raw_price" SET NOT NULL;
    `);
    }
    async down() {
        this.addSql(`
      ALTER TABLE "quantity_prices"
      DROP COLUMN IF EXISTS "raw_price";
    `);
    }
}
exports.Migration20260526140000 = Migration20260526140000;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNjA1MjYxNDAwMDAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcmljaW5nLWVuZ2luZS9taWdyYXRpb25zL01pZ3JhdGlvbjIwMjYwNTI2MTQwMDAwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0dBR0c7OztBQUVILHlFQUFvRTtBQUVwRSxNQUFhLHVCQUF3QixTQUFRLHNCQUFTO0lBQzNDLEtBQUssQ0FBQyxFQUFFO1FBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7O0tBR1gsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7Ozs7OztLQU9YLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxNQUFNLENBQUM7OztLQUdYLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFUSxLQUFLLENBQUMsSUFBSTtRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDOzs7S0FHWCxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0Y7QUE1QkQsMERBNEJDIn0=