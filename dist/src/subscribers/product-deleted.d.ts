import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
export default function pricingEngineProductDeletedHandler({ event: { data }, container, }: SubscriberArgs<{
    id: string;
}>): Promise<void>;
export declare const config: SubscriberConfig;
//# sourceMappingURL=product-deleted.d.ts.map