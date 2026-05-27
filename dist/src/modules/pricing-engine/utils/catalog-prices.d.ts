export type CatalogPriceMap = {
    byVariantId: Record<string, Record<string, number>>;
    defaultByCurrency: Record<string, number>;
};
type ContainerLike = {
    resolve<T = unknown>(key: string): T;
};
type PriceRow = {
    amount?: unknown;
    currency_code?: string | null;
    raw_amount?: unknown;
    min_quantity?: number | null;
    max_quantity?: number | null;
    price_list_id?: string | null;
};
type VariantRow = {
    id: string;
    product_id?: string | null;
    price_set?: {
        id?: string | null;
        prices?: PriceRow[] | null;
    } | null;
};
export declare function normalizeAmountFromPrice(price: PriceRow): number | null;
export declare function buildCatalogPriceMap(variants: VariantRow[]): CatalogPriceMap;
export declare function getBaseUnitPriceForRule(catalog: CatalogPriceMap | undefined, rule: {
    variant_id: string | null;
    currency_code: string;
}): number | null;
export declare function fetchCatalogPricesForProducts(container: ContainerLike, productIds: string[], _currencyCodes?: string[]): Promise<Record<string, CatalogPriceMap>>;
export {};
//# sourceMappingURL=catalog-prices.d.ts.map