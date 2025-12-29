"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const mock_data_service_1 = require("../services/mock-data.service");
const auth_service_1 = require("../../auth/auth.service");
const messages_service_1 = require("../../messages/messages.service");
const message_schemas_1 = require("../../schemas/message.schemas");
let TestController = class TestController {
    mockDataService;
    authService;
    messagesService;
    constructor(mockDataService, authService, messagesService) {
        this.mockDataService = mockDataService;
        this.authService = authService;
        this.messagesService = messagesService;
    }
    async generateTestUser() {
        const mockUser = await this.mockDataService.generateMockUser();
        const tokens = await this.authService.generateTokens(mockUser.id);
        return {
            user: mockUser,
            ...tokens,
        };
    }
    async sendTestMessage(body, req) {
        const validatedData = message_schemas_1.SendMessageSchema.parse(body);
        const message = await this.messagesService.sendMessage(req.user, validatedData);
        return message;
    }
    async getMockData() {
        const user = await this.mockDataService.generateMockUser();
        const organization = this.mockDataService.generateMockOrganization(user);
        const message = this.mockDataService.generateMockMessage(user);
        const member = this.mockDataService.generateMockOrganizationMember(organization, user);
        return {
            user,
            organization,
            message,
            member,
        };
    }
};
exports.TestController = TestController;
__decorate([
    (0, common_1.Post)('generate-test-user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestController.prototype, "generateTestUser", null);
__decorate([
    (0, common_1.Post)('send-test-message'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TestController.prototype, "sendTestMessage", null);
__decorate([
    (0, common_1.Get)('mock-data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestController.prototype, "getMockData", null);
exports.TestController = TestController = __decorate([
    (0, common_1.Controller)('test'),
    __metadata("design:paramtypes", [mock_data_service_1.MockDataService,
        auth_service_1.AuthService,
        messages_service_1.MessagesService])
], TestController);
//# sourceMappingURL=test.controller.js.map