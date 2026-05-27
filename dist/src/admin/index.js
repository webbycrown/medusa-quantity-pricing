"use strict";
const jsxRuntime = require("react/jsx-runtime");
const adminSdk = require("@medusajs/admin-sdk");
const icons = require("@medusajs/icons");
const ui = require("@medusajs/ui");
const react = require("react");
const reactQuery = require("@tanstack/react-query");
const Medusa = require("@medusajs/js-sdk");
const reactRouterDom = require("react-router-dom");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const Medusa__default = /* @__PURE__ */ _interopDefault(Medusa);
const sdk = new Medusa__default.default({
  baseUrl: "/",
  auth: {
    type: "session"
  }
});
function useCatalogUnitPrices(productIds, currencyCodes = []) {
  const uniqueIds = [...new Set(productIds.filter(Boolean))].sort();
  const currencies = [
    ...new Set(currencyCodes.map((c) => c.toLowerCase()).filter(Boolean))
  ].sort();
  return reactQuery.useQuery({
    queryKey: ["catalog-unit-prices", uniqueIds, currencies],
    enabled: uniqueIds.length > 0,
    queryFn: async () => {
      const search = new URLSearchParams();
      for (const id of uniqueIds) {
        search.append("product_id", id);
      }
      for (const code of currencies) {
        search.append("currency_code", code);
      }
      const { catalog } = await sdk.client.fetch(`/admin/quantity-pricing/catalog-prices?${search.toString()}`, {
        method: "GET"
      });
      return catalog ?? {};
    }
  });
}
const quantityPricingQueryKeys = {
  all: (params) => ["quantity-pricing", params],
  detail: (id) => ["quantity-pricing", id]
};
const useQuantityPricingRules = (params = {}) => {
  const search = new URLSearchParams();
  if (params.product_id) search.set("product_id", params.product_id);
  if (params.currency_code) search.set("currency_code", params.currency_code);
  const qs = search.toString();
  return reactQuery.useQuery({
    queryKey: quantityPricingQueryKeys.all(params),
    queryFn: () => sdk.client.fetch(
      `/admin/quantity-pricing${qs ? `?${qs}` : ""}`,
      { method: "GET" }
    )
  });
};
const useCreateQuantityPriceRule = () => {
  const queryClient = reactQuery.useQueryClient();
  return reactQuery.useMutation({
    mutationFn: (data) => sdk.client.fetch("/admin/quantity-pricing", {
      method: "POST",
      body: data
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quantity-pricing"] });
      queryClient.invalidateQueries({ queryKey: ["catalog-unit-prices"] });
    }
  });
};
const useUpdateQuantityPriceRule = () => {
  const queryClient = reactQuery.useQueryClient();
  return reactQuery.useMutation({
    mutationFn: ({
      id,
      data
    }) => sdk.client.fetch(
      `/admin/quantity-pricing/${id}`,
      {
        method: "PUT",
        body: data
      }
    ),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["quantity-pricing"] });
      queryClient.invalidateQueries({ queryKey: ["catalog-unit-prices"] });
      queryClient.invalidateQueries({
        queryKey: quantityPricingQueryKeys.detail(id)
      });
    }
  });
};
const useDeleteQuantityPriceRule = () => {
  const queryClient = reactQuery.useQueryClient();
  return reactQuery.useMutation({
    mutationFn: (id) => sdk.client.fetch(`/admin/quantity-pricing/${id}`, {
      method: "DELETE"
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quantity-pricing"] });
      queryClient.invalidateQueries({ queryKey: ["catalog-unit-prices"] });
    }
  });
};
function formatVariantLabel(variant) {
  var _a;
  const parts = [];
  if (variant.title) {
    parts.push(variant.title);
  }
  if (variant.sku) {
    parts.push(variant.sku);
  }
  const optionValues = (_a = variant.options) == null ? void 0 : _a.map((o) => o.value).filter(Boolean).join(" / ");
  if (optionValues) {
    parts.push(optionValues);
  }
  return parts.length > 0 ? parts.join(" · ") : variant.id;
}
const useProductVariants = (productId) => {
  return reactQuery.useQuery({
    queryKey: ["product-variants", productId],
    enabled: Boolean(productId),
    queryFn: async () => {
      const { product } = await sdk.admin.product.retrieve(productId, {
        fields: "id,*variants"
      });
      const variantRefs = product.variants ?? [];
      if (variantRefs.length === 0) {
        return { variants: [], count: 0, hasVariants: false };
      }
      const { variants, count } = await sdk.admin.product.listVariants(
        productId,
        { limit: 200, fields: "id,title,sku,options.*" }
      );
      const options = (variants ?? []).map((v) => ({
        id: v.id,
        title: formatVariantLabel(v),
        sku: v.sku
      }));
      const resolvedCount = count ?? options.length;
      return {
        variants: options,
        count: resolvedCount,
        hasVariants: resolvedCount > 0
      };
    }
  });
};
function getBaseUnitPriceForRule(catalog, rule) {
  var _a;
  const code = rule.currency_code.toLowerCase();
  if (catalog && rule.variant_id) {
    const variantPrice = (_a = catalog.byVariantId[rule.variant_id]) == null ? void 0 : _a[code];
    if (variantPrice != null) {
      return variantPrice;
    }
  }
  const fromCatalog = catalog == null ? void 0 : catalog.defaultByCurrency[code];
  if (fromCatalog != null) {
    return fromCatalog;
  }
  if (rule.reference_unit_price != null && Number.isFinite(rule.reference_unit_price)) {
    return rule.reference_unit_price;
  }
  return null;
}
const PRICING_TYPE_OPTIONS = [
  { value: "fixed", label: "Fixed price" },
  { value: "percentage", label: "Percentage discount (%)" },
  { value: "fixed_discount", label: "Fixed discount (amount off)" }
];
function roundMoney(amount) {
  return Math.round(amount * 100) / 100;
}
function resolveRuleUnitPrice(rule, baseUnitPrice) {
  const type = rule.pricing_type ?? "fixed";
  const value = Number(rule.price);
  if (type === "fixed") {
    return value;
  }
  if (baseUnitPrice == null || !Number.isFinite(baseUnitPrice)) {
    return value;
  }
  if (type === "percentage") {
    return Math.max(0, roundMoney(baseUnitPrice * (1 - value / 100)));
  }
  if (type === "fixed_discount") {
    return Math.max(0, roundMoney(baseUnitPrice - value));
  }
  return value;
}
function formatAmount(amount) {
  const rounded = roundMoney(amount);
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}
function formatRulePriceDisplay(rule, baseUnitPrice) {
  const type = rule.pricing_type ?? "fixed";
  if (type === "fixed") {
    return formatAmount(Number(rule.price));
  }
  if (baseUnitPrice == null || !Number.isFinite(baseUnitPrice)) {
    return "No list price";
  }
  return formatAmount(resolveRuleUnitPrice(rule, baseUnitPrice));
}
function pricingTypeLabel(type) {
  var _a;
  return ((_a = PRICING_TYPE_OPTIONS.find((o) => o.value === (type ?? "fixed"))) == null ? void 0 : _a.label) ?? "Fixed price";
}
function discountColumnLabel(type) {
  switch (type) {
    case "percentage":
    case "fixed_discount":
      return "Discount";
    case "fixed":
    default:
      return "Unit price";
  }
}
function PricingAmountGrid({
  pricingType,
  discountValue,
  onDiscountValueChange,
  catalogPrice,
  catalogLoading = false,
  currencyCode,
  noVariants = false
}) {
  const discountNum = Number(discountValue);
  const hasDiscountInput = discountValue.trim() !== "" && Number.isFinite(discountNum);
  const eachPrice = pricingType === "fixed" && hasDiscountInput ? discountNum : hasDiscountInput && catalogPrice != null ? resolveRuleUnitPrice(
    { pricing_type: pricingType, price: discountNum },
    catalogPrice
  ) : null;
  const catalogDisplay = catalogLoading ? "" : catalogPrice != null ? formatAmount(catalogPrice) : "";
  const eachDisplay = eachPrice != null && Number.isFinite(eachPrice) ? formatAmount(eachPrice) : "";
  const currencyLabel = currencyCode.toUpperCase();
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-y-2", children: [
    /* @__PURE__ */ jsxRuntime.jsx(ui.Label, { children: "Pricing" }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "rounded-lg border border-ui-border-base overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-3 border-b border-ui-border-base bg-ui-bg-subtle", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Text,
          {
            size: "xsmall",
            weight: "plus",
            className: "px-2 py-2 text-center border-r border-ui-border-base",
            children: discountColumnLabel(pricingType)
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Text,
          {
            size: "xsmall",
            weight: "plus",
            className: "px-2 py-2 text-center border-r border-ui-border-base",
            children: "Each/Price"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xsmall", weight: "plus", className: "px-2 py-2 text-center", children: "List price" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Input,
          {
            type: "number",
            min: 0,
            max: pricingType === "percentage" ? 100 : void 0,
            step: pricingType === "percentage" ? 1 : "0.01",
            value: discountValue,
            onChange: (e) => onDiscountValueChange(e.target.value),
            placeholder: pricingType === "percentage" ? "%" : pricingType === "fixed_discount" ? "off" : "tier",
            className: "rounded-none border-0 border-r border-ui-border-base shadow-none focus-visible:ring-0"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Input,
          {
            readOnly: true,
            value: eachDisplay,
            placeholder: "—",
            className: "rounded-none border-0 border-r border-ui-border-base bg-ui-bg-subtle shadow-none"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Input,
          {
            readOnly: true,
            value: catalogDisplay,
            placeholder: catalogLoading ? "…" : catalogPrice == null ? "No list price" : "—",
            className: "rounded-none border-0 bg-ui-bg-subtle shadow-none"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xsmall", className: "text-ui-fg-muted", children: pricingType === "percentage" ? `Tier unit price = list price − discount %. Currency: ${currencyLabel}` : pricingType === "fixed_discount" ? `Tier unit price = list price − discount amount. Currency: ${currencyLabel}` : "Tier unit price is what the customer pays. List price comes from Medusa variant pricing." }),
    !catalogLoading && catalogPrice == null && pricingType !== "fixed" && /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xsmall", className: "text-ui-fg-error", children: noVariants ? "Enter List price (reference) above, or switch to Fixed price." : "Set variant prices in Medusa or enter List price (reference) above." })
  ] });
}
const VARIANT_ALL = "__all__";
function ruleToSelectValue(variantId) {
  return variantId ? variantId : VARIANT_ALL;
}
function selectValueToVariantId(value) {
  return value === VARIANT_ALL ? null : value;
}
function ruleToFormState(rule, hasVariants) {
  return {
    productId: rule.product_id,
    variantSelectValue: hasVariants ? ruleToSelectValue(rule.variant_id) : VARIANT_ALL,
    pricingType: rule.pricing_type ?? "fixed",
    minQty: String(rule.min_qty),
    maxQty: rule.max_qty === null ? "" : String(rule.max_qty),
    price: String(rule.price),
    currencyCode: rule.currency_code,
    referenceListPrice: rule.reference_unit_price != null ? String(rule.reference_unit_price) : ""
  };
}
function QuantityPricingForm({
  onSubmit,
  isLoading,
  onCancel,
  defaultCurrency = "inr",
  productId: fixedProductId,
  variants = [],
  variantsLoading = false,
  hasVariants: hasVariantsProp,
  initialRule = null
}) {
  const typedProductId = (fixedProductId ?? "").trim();
  const { data: fetchedForTypedProduct, isLoading: isFetchingTypedVariants } = useProductVariants(!fixedProductId && typedProductId ? typedProductId : void 0);
  const variantOptions = react.useMemo(() => {
    if (variants.length > 0) {
      return variants;
    }
    return (fetchedForTypedProduct == null ? void 0 : fetchedForTypedProduct.variants) ?? [];
  }, [variants, fetchedForTypedProduct]);
  const variantSelectLoading = variantsLoading || isFetchingTypedVariants;
  const hasVariants = hasVariantsProp ?? (fetchedForTypedProduct == null ? void 0 : fetchedForTypedProduct.hasVariants) ?? false;
  const showVariantField = !variantSelectLoading && hasVariants && variantOptions.length > 0;
  const initial = initialRule ? ruleToFormState(initialRule, hasVariants) : {
    productId: fixedProductId ?? "",
    variantSelectValue: VARIANT_ALL,
    pricingType: "fixed",
    minQty: "1",
    maxQty: "",
    price: "",
    currencyCode: defaultCurrency,
    referenceListPrice: ""
  };
  const [productId, setProductId] = react.useState(initial.productId);
  const [variantSelectValue, setVariantSelectValue] = react.useState(
    initial.variantSelectValue
  );
  const [pricingType, setPricingType] = react.useState(initial.pricingType);
  const [minQty, setMinQty] = react.useState(initial.minQty);
  const [maxQty, setMaxQty] = react.useState(initial.maxQty);
  const [price, setPrice] = react.useState(initial.price);
  const [currencyCode, setCurrencyCode] = react.useState(initial.currencyCode);
  const [referenceListPrice, setReferenceListPrice] = react.useState(
    "referenceListPrice" in initial ? initial.referenceListPrice : ""
  );
  const [error, setError] = react.useState(null);
  const isEditing = Boolean(initialRule);
  const resolvedProductId = (fixedProductId ?? productId).trim();
  const resolvedCurrency = currencyCode.trim().toLowerCase();
  const variantIdForCatalog = showVariantField ? selectValueToVariantId(variantSelectValue) : null;
  const { data: catalogByProduct, isLoading: isLoadingCatalog } = useCatalogUnitPrices(
    resolvedProductId ? [resolvedProductId] : [],
    resolvedCurrency ? [resolvedCurrency] : []
  );
  const catalogFromMedusa = resolvedProductId ? getBaseUnitPriceForRule(catalogByProduct == null ? void 0 : catalogByProduct[resolvedProductId], {
    variant_id: variantIdForCatalog,
    currency_code: resolvedCurrency || defaultCurrency
  }) : null;
  const referenceNum = referenceListPrice.trim() === "" ? null : Number(referenceListPrice);
  const effectiveListPrice = catalogFromMedusa ?? (referenceNum != null && Number.isFinite(referenceNum) ? referenceNum : null);
  const needsReferenceListPrice = pricingType !== "fixed" && catalogFromMedusa == null && !isLoadingCatalog;
  const showReferenceField = pricingType !== "fixed" && (!hasVariants || needsReferenceListPrice) && !variantSelectLoading;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const min_qty = Number(minQty);
    const max_qty = maxQty.trim() === "" ? null : Number(maxQty);
    const priceNum = Number(price);
    if (!resolvedProductId) {
      setError("Product ID is required");
      return;
    }
    if (!Number.isFinite(min_qty) || min_qty < 1) {
      setError("Min quantity must be at least 1");
      return;
    }
    if (max_qty !== null && (!Number.isFinite(max_qty) || max_qty < min_qty)) {
      setError("Max quantity must be empty (open-ended) or ≥ min quantity");
      return;
    }
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      setError("Value must be a positive number");
      return;
    }
    if (pricingType === "percentage" && priceNum > 100) {
      setError("Percentage discount cannot exceed 100");
      return;
    }
    if (pricingType !== "fixed" && catalogFromMedusa == null && (!Number.isFinite(referenceNum) || referenceNum <= 0)) {
      setError(
        hasVariants ? "Enter a list price (reference) or set variant prices in Medusa" : "Enter a list price (reference) — this product has no variants"
      );
      return;
    }
    const variant_id = showVariantField ? selectValueToVariantId(variantSelectValue) : null;
    try {
      await onSubmit({
        product_id: resolvedProductId,
        variant_id,
        min_qty,
        max_qty,
        pricing_type: pricingType,
        price: priceNum,
        currency_code: resolvedCurrency,
        reference_unit_price: pricingType !== "fixed" && catalogFromMedusa == null && referenceNum != null && Number.isFinite(referenceNum) ? referenceNum : null
      });
      if (!fixedProductId) {
        setProductId("");
      }
      setVariantSelectValue(VARIANT_ALL);
      setPricingType("fixed");
      setMinQty("1");
      setMaxQty("");
      setPrice("");
      setReferenceListPrice("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save rule");
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-y-4", children: [
    !variantSelectLoading && !hasVariants && fixedProductId && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "rounded-lg border border-ui-border-base bg-ui-bg-subtle px-3 py-2", children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: "small", className: "text-ui-fg-subtle", children: [
      "This product has ",
      /* @__PURE__ */ jsxRuntime.jsx("strong", { children: "no variants" }),
      ". Use",
      " ",
      /* @__PURE__ */ jsxRuntime.jsx("strong", { children: "Fixed price" }),
      " tiers for simple volume pricing, or enter a ",
      /* @__PURE__ */ jsxRuntime.jsx("strong", { children: "List price (reference)" }),
      " below for discount tiers. For checkout, add at least one variant in Medusa when you are ready to sell."
    ] }) }),
    !fixedProductId && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-y-2", children: [
      /* @__PURE__ */ jsxRuntime.jsx(ui.Label, { htmlFor: "qp-product-id", children: "Product ID" }),
      /* @__PURE__ */ jsxRuntime.jsx(
        ui.Input,
        {
          id: "qp-product-id",
          value: productId,
          onChange: (e) => setProductId(e.target.value),
          placeholder: "prod_01..."
        }
      )
    ] }),
    showVariantField && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-y-2", children: [
      /* @__PURE__ */ jsxRuntime.jsx(ui.Label, { htmlFor: "qp-variant-id", children: "Variant (optional)" }),
      /* @__PURE__ */ jsxRuntime.jsxs(
        ui.Select,
        {
          value: variantSelectValue,
          onValueChange: setVariantSelectValue,
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(ui.Select.Trigger, { id: "qp-variant-id", children: /* @__PURE__ */ jsxRuntime.jsx(ui.Select.Value, { placeholder: "Select variant" }) }),
            /* @__PURE__ */ jsxRuntime.jsxs(ui.Select.Content, { children: [
              /* @__PURE__ */ jsxRuntime.jsx(ui.Select.Item, { value: VARIANT_ALL, children: "All variants" }),
              variantOptions.map((v) => /* @__PURE__ */ jsxRuntime.jsx(ui.Select.Item, { value: v.id, children: v.title || v.sku || v.id }, v.id))
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-y-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx(ui.Label, { htmlFor: "qp-currency", children: "Currency" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Input,
          {
            id: "qp-currency",
            value: currencyCode,
            onChange: (e) => setCurrencyCode(e.target.value),
            placeholder: "inr",
            maxLength: 3
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-y-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx(ui.Label, { htmlFor: "qp-pricing-type", children: "Pricing type" }),
        /* @__PURE__ */ jsxRuntime.jsxs(
          ui.Select,
          {
            value: pricingType,
            onValueChange: (v) => setPricingType(v),
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(ui.Select.Trigger, { id: "qp-pricing-type", children: /* @__PURE__ */ jsxRuntime.jsx(ui.Select.Value, { placeholder: "Select type" }) }),
              /* @__PURE__ */ jsxRuntime.jsx(ui.Select.Content, { children: PRICING_TYPE_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntime.jsx(ui.Select.Item, { value: opt.value, children: opt.label }, opt.value)) })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-y-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx(ui.Label, { htmlFor: "qp-min-qty", children: "Min qty" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Input,
          {
            id: "qp-min-qty",
            type: "number",
            min: 1,
            value: minQty,
            onChange: (e) => setMinQty(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-y-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx(ui.Label, { htmlFor: "qp-max-qty", children: "Max qty (empty = 51+)" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Input,
          {
            id: "qp-max-qty",
            type: "number",
            min: 1,
            value: maxQty,
            onChange: (e) => setMaxQty(e.target.value),
            placeholder: "optional"
          }
        )
      ] })
    ] }),
    showReferenceField && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-y-2", children: [
      /* @__PURE__ */ jsxRuntime.jsxs(ui.Label, { htmlFor: "qp-reference-price", children: [
        "List price (reference)",
        " ",
        !hasVariants || needsReferenceListPrice ? "" : "(optional)"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(
        ui.Input,
        {
          id: "qp-reference-price",
          type: "number",
          min: 0,
          step: "0.01",
          value: referenceListPrice,
          onChange: (e) => setReferenceListPrice(e.target.value),
          placeholder: "e.g. 120"
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xsmall", className: "text-ui-fg-muted", children: "Used to calculate discount tiers when Medusa has no variant list price for this currency." })
    ] }),
    resolvedProductId ? /* @__PURE__ */ jsxRuntime.jsx(
      PricingAmountGrid,
      {
        pricingType,
        discountValue: price,
        onDiscountValueChange: setPrice,
        catalogPrice: effectiveListPrice,
        catalogLoading: isLoadingCatalog,
        currencyCode: resolvedCurrency || defaultCurrency,
        noVariants: !hasVariants
      }
    ) : /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", className: "text-ui-fg-subtle", children: "Enter a product ID to load catalog price." }),
    error && /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", className: "text-ui-fg-error", children: error }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex justify-end gap-2", children: [
      onCancel && /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { type: "button", variant: "secondary", onClick: onCancel, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { type: "submit", isLoading, children: isEditing ? "Save changes" : "Add rule" })
    ] })
  ] });
}
function formatQtyRange(rule) {
  if (rule.max_qty === null) {
    return `${rule.min_qty}+`;
  }
  return `${rule.min_qty}–${rule.max_qty}`;
}
function variantLabel(variantId, variants) {
  if (!variantId) {
    return "All variants";
  }
  const match = variants.find((v) => v.id === variantId);
  return (match == null ? void 0 : match.title) || (match == null ? void 0 : match.sku) || variantId;
}
function formatDiscountCell(rule) {
  const type = rule.pricing_type ?? "fixed";
  const value = Number(rule.price);
  if (type === "percentage") {
    return `${formatAmount(value)}%`;
  }
  if (type === "fixed_discount") {
    return formatAmount(value);
  }
  return "—";
}
function formatCatalogCell(base) {
  if (base == null || !Number.isFinite(base)) {
    return "—";
  }
  return formatAmount(base);
}
function QuantityPricingRulesManager({
  productId,
  variants = [],
  showProductColumn = !productId,
  addButtonLabel = "Add rule"
}) {
  const { data, isLoading, isError, error } = useQuantityPricingRules(
    productId ? { product_id: productId } : {}
  );
  const { mutateAsync: createRule, isPending: isCreating } = useCreateQuantityPriceRule();
  const { mutateAsync: updateRule, isPending: isUpdating } = useUpdateQuantityPriceRule();
  const { mutateAsync: deleteRule } = useDeleteQuantityPriceRule();
  const prompt = ui.usePrompt();
  const {
    data: fetchedVariants,
    isLoading: isLoadingVariants,
    isFetching: isFetchingVariants,
    isSuccess: variantsLoaded
  } = useProductVariants(productId);
  const resolvedVariants = react.useMemo(() => {
    if (variants.length > 0) {
      return variants;
    }
    return (fetchedVariants == null ? void 0 : fetchedVariants.variants) ?? [];
  }, [variants, fetchedVariants]);
  const [drawerOpen, setDrawerOpen] = react.useState(false);
  const [editingRule, setEditingRule] = react.useState(null);
  const rules = (data == null ? void 0 : data.quantity_prices) ?? [];
  const isSaving = isCreating || isUpdating;
  const catalogProductIds = react.useMemo(() => {
    if (productId) {
      return [productId];
    }
    return [...new Set(rules.map((r) => r.product_id))];
  }, [productId, rules]);
  const catalogCurrencies = react.useMemo(
    () => [...new Set(rules.map((r) => r.currency_code.toLowerCase()))],
    [rules]
  );
  const { data: catalogByProduct, isLoading: isLoadingCatalog } = useCatalogUnitPrices(catalogProductIds, catalogCurrencies);
  const hasProductVariants = (fetchedVariants == null ? void 0 : fetchedVariants.hasVariants) === true;
  const showVariantColumn = !showProductColumn && Boolean(productId) && variantsLoaded && !isFetchingVariants && hasProductVariants;
  const openCreate = () => {
    setEditingRule(null);
    setDrawerOpen(true);
  };
  const openEdit = (rule) => {
    setEditingRule(rule);
    setDrawerOpen(true);
  };
  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingRule(null);
  };
  const handleDrawerOpenChange = (open) => {
    if (!open) {
      closeDrawer();
    } else {
      setDrawerOpen(true);
    }
  };
  const handleDelete = async (rule) => {
    const base = getBaseUnitPriceForRule(
      catalogByProduct == null ? void 0 : catalogByProduct[rule.product_id],
      rule
    );
    const confirmed = await prompt({
      title: "Delete pricing rule",
      description: `Remove tier ${formatQtyRange(rule)} @ ${formatRulePriceDisplay(rule, base)} ${rule.currency_code.toUpperCase()}?`,
      confirmText: "Delete",
      cancelText: "Cancel"
    });
    if (!confirmed) return;
    try {
      await deleteRule(rule.id);
      ui.toast.success("Rule deleted");
    } catch (e) {
      ui.toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  };
  if (isError) {
    throw error;
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center justify-end px-6 py-4 border-b border-ui-border-base", children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Button, { size: "small", variant: "secondary", onClick: openCreate, children: [
      /* @__PURE__ */ jsxRuntime.jsx(icons.Plus, {}),
      addButtonLabel
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "px-6 py-4", children: [
      productId && variantsLoaded && !isFetchingVariants && !hasProductVariants && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mb-4 rounded-lg border border-ui-border-base bg-ui-bg-subtle px-3 py-2" }),
      isLoading ? /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", className: "text-ui-fg-subtle", children: "Loading rules..." }) : rules.length === 0 ? /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", className: "text-ui-fg-subtle", children: productId ? "No quantity tiers for this product yet." : "No quantity pricing rules yet. Add a rule to get started." }) : /* @__PURE__ */ jsxRuntime.jsxs(ui.Table, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(ui.Table.Header, { children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Table.Row, { children: [
          showProductColumn ? /* @__PURE__ */ jsxRuntime.jsx(ui.Table.HeaderCell, { children: "Product" }) : showVariantColumn ? /* @__PURE__ */ jsxRuntime.jsx(ui.Table.HeaderCell, { children: "Variant" }) : null,
          /* @__PURE__ */ jsxRuntime.jsx(ui.Table.HeaderCell, { children: "Qty range" }),
          /* @__PURE__ */ jsxRuntime.jsx(ui.Table.HeaderCell, { children: "Type" }),
          /* @__PURE__ */ jsxRuntime.jsx(ui.Table.HeaderCell, { children: "Discount" }),
          /* @__PURE__ */ jsxRuntime.jsx(ui.Table.HeaderCell, { children: "List price" }),
          /* @__PURE__ */ jsxRuntime.jsx(ui.Table.HeaderCell, { children: "Tier unit price" }),
          /* @__PURE__ */ jsxRuntime.jsx(ui.Table.HeaderCell, { children: "Currency" }),
          /* @__PURE__ */ jsxRuntime.jsx(ui.Table.HeaderCell, { className: "text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsx(ui.Table.Body, { children: rules.map((rule) => {
          const base = getBaseUnitPriceForRule(
            catalogByProduct == null ? void 0 : catalogByProduct[rule.product_id],
            rule
          );
          return /* @__PURE__ */ jsxRuntime.jsxs(ui.Table.Row, { children: [
            showProductColumn ? /* @__PURE__ */ jsxRuntime.jsxs(ui.Table.Cell, { children: [
              /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", className: "font-mono text-xs", children: rule.product_id }),
              rule.variant_id && /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xsmall", className: "text-ui-fg-subtle", children: variantLabel(rule.variant_id, resolvedVariants) })
            ] }) : showVariantColumn ? /* @__PURE__ */ jsxRuntime.jsx(ui.Table.Cell, { children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", className: "text-ui-fg-base", children: variantLabel(rule.variant_id, resolvedVariants) }) }) : null,
            /* @__PURE__ */ jsxRuntime.jsx(ui.Table.Cell, { children: formatQtyRange(rule) }),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Table.Cell, { children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", children: pricingTypeLabel(rule.pricing_type) }) }),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Table.Cell, { children: rule.pricing_type === "fixed" ? "—" : formatDiscountCell(rule) }),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Table.Cell, { children: isLoadingCatalog ? /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", className: "text-ui-fg-subtle", children: "…" }) : formatCatalogCell(base) }),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Table.Cell, { children: isLoadingCatalog && rule.pricing_type !== "fixed" ? /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", className: "text-ui-fg-subtle", children: "…" }) : formatRulePriceDisplay(rule, base) }),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Table.Cell, { children: rule.currency_code.toUpperCase() }),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Table.Cell, { className: "text-right", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex justify-end gap-1", children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                ui.IconButton,
                {
                  size: "small",
                  variant: "transparent",
                  onClick: () => openEdit(rule),
                  children: /* @__PURE__ */ jsxRuntime.jsx(icons.PencilSquare, {})
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(
                ui.IconButton,
                {
                  size: "small",
                  variant: "transparent",
                  onClick: () => handleDelete(rule),
                  children: /* @__PURE__ */ jsxRuntime.jsx(icons.Trash, {})
                }
              )
            ] }) })
          ] }, rule.id);
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(ui.Drawer, { open: drawerOpen, onOpenChange: handleDrawerOpenChange, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Drawer.Content, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(ui.Drawer.Header, { children: /* @__PURE__ */ jsxRuntime.jsx(ui.Drawer.Title, { children: editingRule ? "Edit quantity pricing rule" : "Add quantity pricing rule" }) }),
      /* @__PURE__ */ jsxRuntime.jsx(ui.Drawer.Body, { className: "p-4", children: /* @__PURE__ */ jsxRuntime.jsx(
        QuantityPricingForm,
        {
          productId,
          variants: resolvedVariants,
          variantsLoading: Boolean(productId) && isLoadingVariants,
          hasVariants: hasProductVariants,
          initialRule: editingRule,
          isLoading: isSaving,
          onCancel: closeDrawer,
          onSubmit: async (input) => {
            if (editingRule) {
              await updateRule({
                id: editingRule.id,
                data: {
                  product_id: input.product_id,
                  variant_id: input.variant_id,
                  min_qty: input.min_qty,
                  max_qty: input.max_qty,
                  pricing_type: input.pricing_type,
                  price: input.price,
                  currency_code: input.currency_code,
                  reference_unit_price: input.reference_unit_price
                }
              });
              ui.toast.success("Rule updated");
            } else {
              await createRule(input);
              ui.toast.success("Rule created");
            }
            closeDrawer();
          }
        },
        `${(editingRule == null ? void 0 : editingRule.id) ?? "new"}-${hasProductVariants}`
      ) })
    ] }) })
  ] });
}
const ProductQuantityPricingWidget = ({ data }) => {
  const productId = data.id;
  return /* @__PURE__ */ jsxRuntime.jsxs(ui.Container, { className: "divide-y p-0", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-x-2 px-6 py-4", children: [
      /* @__PURE__ */ jsxRuntime.jsx(icons.CurrencyDollar, { className: "text-ui-fg-subtle" }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntime.jsx(ui.Heading, { level: "h2", children: "Quantity pricing" }),
        /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", className: "text-ui-fg-subtle mt-0.5", children: "Volume tiers for this product (e.g. 1–10, 11–50, 51+)." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(
      QuantityPricingRulesManager,
      {
        productId,
        variants: data.variants,
        addButtonLabel: "Add tier"
      }
    )
  ] });
};
adminSdk.defineWidgetConfig({
  zone: "product.details.after"
});
const StoreQuantityPricingWidget = () => {
  const { data, isLoading } = useQuantityPricingRules();
  const count = (data == null ? void 0 : data.count) ?? 0;
  return /* @__PURE__ */ jsxRuntime.jsx(ui.Container, { className: "p-6", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-y-2", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-x-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx(icons.CurrencyDollar, { className: "text-ui-fg-subtle" }),
        /* @__PURE__ */ jsxRuntime.jsx(ui.Heading, { level: "h2", children: "Quantity pricing engine" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", className: "text-ui-fg-subtle max-w-lg", children: isLoading ? "Loading pricing rules…" : count === 0 ? "No volume tiers configured yet. Rules apply per product (qty 1–10, 11–50, 51+, etc.)." : `${count} active rule${count === 1 ? "" : "s"} across your catalog.` })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { size: "small", variant: "secondary", asChild: true, children: /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Link, { to: "/settings/quantity-pricing", children: "Manage pricing" }) })
  ] }) });
};
adminSdk.defineWidgetConfig({
  zone: "store.details.after"
});
const QuantityPricingSettingsPage = () => {
  return /* @__PURE__ */ jsxRuntime.jsxs(ui.Container, { className: "divide-y p-0", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "px-6 py-4", children: [
      /* @__PURE__ */ jsxRuntime.jsx(ui.Heading, { level: "h1", children: "Quantity pricing" }),
      /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", className: "text-ui-fg-subtle mt-1", children: "Volume tiers per product (e.g. 1–10 → ₹100, 11–50 → ₹90, 51+ → ₹80)." })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(QuantityPricingRulesManager, { showProductColumn: true })
  ] });
};
const config = adminSdk.defineRouteConfig({
  label: "Quantity Pricing",
  icon: icons.CurrencyDollar,
  rank: 5
});
const widgetModule = { widgets: [
  {
    Component: ProductQuantityPricingWidget,
    zone: ["product.details.after"]
  },
  {
    Component: StoreQuantityPricingWidget,
    zone: ["store.details.after"]
  }
] };
const routeModule = {
  routes: [
    {
      Component: QuantityPricingSettingsPage,
      path: "/settings/quantity-pricing"
    }
  ]
};
const menuItemModule = {
  menuItems: [
    {
      label: config.label,
      icon: config.icon,
      path: "/settings/quantity-pricing",
      nested: void 0,
      rank: 5,
      translationNs: void 0
    }
  ]
};
const formModule = { customFields: {} };
const displayModule = {
  displays: {}
};
const i18nModule = { resources: {} };
const plugin = {
  widgetModule,
  routeModule,
  menuItemModule,
  formModule,
  displayModule,
  i18nModule
};
module.exports = plugin;
