"use strict";
/**
 * Module entry — registers PricingEngineService with Medusa's DI container.
 *
 * How Medusa modules work:
 * 1. You export `Module(MODULE_KEY, { service })` from index.ts
 * 2. medusa-config.ts lists the module path under `modules`
 * 3. On boot, Medusa instantiates the service and registers it as
 *    `container.resolve(PRICING_ENGINE_MODULE)`
 * 4. API routes, workflows, jobs, and subscribers resolve the same key
 *
 * @see https://docs.medusajs.com/learn/fundamentals/modules
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRICING_ENGINE_MODULE = void 0;
const utils_1 = require("@medusajs/framework/utils");
const service_1 = __importDefault(require("./service"));
/** Container registration key — use this constant everywhere, never a string literal */
exports.PRICING_ENGINE_MODULE = "pricingEngine";
exports.default = (0, utils_1.Module)(exports.PRICING_ENGINE_MODULE, {
    service: service_1.default,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcmljaW5nLWVuZ2luZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7O0dBV0c7Ozs7OztBQUVILHFEQUFrRDtBQUNsRCx3REFBNEM7QUFFNUMsd0ZBQXdGO0FBQzNFLFFBQUEscUJBQXFCLEdBQUcsZUFBZSxDQUFBO0FBRXBELGtCQUFlLElBQUEsY0FBTSxFQUFDLDZCQUFxQixFQUFFO0lBQzNDLE9BQU8sRUFBRSxpQkFBb0I7Q0FDOUIsQ0FBQyxDQUFBIn0=