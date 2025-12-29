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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_entity_1 = require("./entities/message.entity");
const user_entity_1 = require("../users/entities/user.entity");
const organization_entity_1 = require("../organizations/entities/organization.entity");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
let MessagesService = class MessagesService {
    messagesRepository;
    usersRepository;
    organizationsRepository;
    webSocketGateway;
    constructor(messagesRepository, usersRepository, organizationsRepository, webSocketGateway) {
        this.messagesRepository = messagesRepository;
        this.usersRepository = usersRepository;
        this.organizationsRepository = organizationsRepository;
        this.webSocketGateway = webSocketGateway;
    }
    async sendMessage(user, sendMessageDto) {
        let organization;
        if (sendMessageDto.organizationId) {
            const foundOrganization = await this.organizationsRepository.findOne({
                where: { id: sendMessageDto.organizationId },
            });
            if (!foundOrganization) {
                throw new Error('Organization not found');
            }
            organization = foundOrganization;
        }
        const message = this.messagesRepository.create({
            ...sendMessageDto,
            sender: user,
            organization,
        });
        const savedMessage = await this.messagesRepository.save(message);
        await this.webSocketGateway.sendNewMessageNotification(savedMessage);
        return savedMessage;
    }
    async getMessages(user, organizationId) {
        if (organizationId) {
            return this.messagesRepository.find({
                where: { organization: { id: organizationId } },
                relations: ['sender', 'organization'],
                order: { createdAt: 'DESC' },
            });
        }
        return this.messagesRepository.find({
            where: { sender: { id: user.id } },
            relations: ['sender'],
            order: { createdAt: 'DESC' },
        });
    }
    async getMessageById(id, user) {
        const message = await this.messagesRepository.findOne({
            where: { id },
            relations: ['sender', 'organization'],
        });
        if (!message) {
            throw new Error('Message not found');
        }
        if (message.sender.id !== user.id) {
            if (message.organization) {
                throw new Error('Unauthorized');
            }
            else {
                throw new Error('Unauthorized');
            }
        }
        return message;
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        websocket_gateway_1.WebSocketGateWay])
], MessagesService);
//# sourceMappingURL=messages.service.js.map