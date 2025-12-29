"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSchema = exports.LoginSchema = void 0;
const zod_1 = require("zod");
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('邮箱格式不正确'),
    password: zod_1.z.string().min(1, '密码不能为空'),
});
exports.RegisterSchema = zod_1.z.object({
    email: zod_1.z.string().email('邮箱格式不正确'),
    password: zod_1.z.string().min(6, '密码至少需要6个字符'),
    name: zod_1.z.string().min(1, '姓名不能为空'),
});
//# sourceMappingURL=auth.schemas.js.map