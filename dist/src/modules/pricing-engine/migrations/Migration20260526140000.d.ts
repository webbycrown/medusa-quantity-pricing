/**
 * Adds raw_price for existing installs that ran Migration20260526120000
 * before raw_price was included (required by model.bigNumber() on price).
 */
import { Migration } from "@medusajs/framework/mikro-orm/migrations";
export declare class Migration20260526140000 extends Migration {
    up(): Promise<void>;
    down(): Promise<void>;
}
//# sourceMappingURL=Migration20260526140000.d.ts.map