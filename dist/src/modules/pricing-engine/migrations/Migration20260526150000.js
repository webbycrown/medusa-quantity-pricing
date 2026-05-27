"use strict";
/**
 * Adds pricing_type for fixed / percentage / fixed_discount tiers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20260526150000 = void 0;
const migrations_1 = require("@medusajs/framework/mikro-orm/migrations");
class Migration20260526150000 extends migrations_1.Migration {
    async up() {
        this.addSql(`
      ALTER TABLE "quantity_prices"
      ADD COLUMN IF NOT EXISTS "pricing_type" text NOT NULL DEFAULT 'fixed';
    `);
    }
    async down() {
        this.addSql(`
      ALTER TABLE "quantity_prices"
      DROP COLUMN IF EXISTS "pricing_type";
    `);
    }
}
exports.Migration20260526150000 = Migration20260526150000;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNjA1MjYxNTAwMDAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcmljaW5nLWVuZ2luZS9taWdyYXRpb25zL01pZ3JhdGlvbjIwMjYwNTI2MTUwMDAwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7O0FBRUgseUVBQW9FO0FBRXBFLE1BQWEsdUJBQXdCLFNBQVEsc0JBQVM7SUFDM0MsS0FBSyxDQUFDLEVBQUU7UUFDZixJQUFJLENBQUMsTUFBTSxDQUFDOzs7S0FHWCxDQUFDLENBQUE7SUFDSixDQUFDO0lBRVEsS0FBSyxDQUFDLElBQUk7UUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7O0tBR1gsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGO0FBZEQsMERBY0MifQ==