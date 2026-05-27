/**
 * PostgreSQL migration for quantity_prices.
 *
 * `model.bigNumber()` on `price` requires both:
 * - price (numeric)
 * - raw_price (jsonb) — BigNumber precision metadata
 */
import { Migration } from "@medusajs/framework/mikro-orm/migrations";
export declare class Migration20260526120000 extends Migration {
    up(): Promise<void>;
    down(): Promise<void>;
}
//# sourceMappingURL=Migration20260526120000.d.ts.map