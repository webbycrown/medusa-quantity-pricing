"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("@medusajs/framework/http");
exports.default = (0, http_1.defineMiddlewares)({
    routes: [
        {
            matcher: "/admin/quantity-pricing*",
            middlewares: [(0, http_1.authenticate)("user", ["session", "bearer", "api-key"])],
        },
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpL21pZGRsZXdhcmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbURBR2lDO0FBRWpDLGtCQUFlLElBQUEsd0JBQWlCLEVBQUM7SUFDL0IsTUFBTSxFQUFFO1FBQ047WUFDRSxPQUFPLEVBQUUsMEJBQTBCO1lBQ25DLFdBQVcsRUFBRSxDQUFDLElBQUEsbUJBQVksRUFBQyxNQUFNLEVBQUUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7U0FDdEU7S0FDRjtDQUNGLENBQUMsQ0FBQSJ9