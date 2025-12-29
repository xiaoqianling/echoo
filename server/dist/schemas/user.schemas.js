"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserSchema = void 0;
const zod_1 = require("zod");
exports.UpdateUserSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    avatar: zod_1.z.string().optional(),
});
//# sourceMappingURL=user.schemas.js.map