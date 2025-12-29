"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMemberSchema = exports.CreateOrganizationSchema = void 0;
const zod_1 = require("zod");
exports.CreateOrganizationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, '组织名称不能为空'),
    description: zod_1.z.string().optional(),
});
exports.AddMemberSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, '用户ID不能为空'),
    role: zod_1.z.enum(['admin', 'member'], {
        errorMap: () => ({ message: '角色必须是 admin 或 member' }),
    }),
});
//# sourceMappingURL=organization.schemas.js.map