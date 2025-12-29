"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageSchema = void 0;
const zod_1 = require("zod");
exports.SendMessageSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, '标题不能为空'),
    desp: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    short: zod_1.z.string().optional(),
    organizationId: zod_1.z.string().optional(),
});
//# sourceMappingURL=message.schemas.js.map