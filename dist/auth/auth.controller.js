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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const createUser_dto_1 = require("../users/dto/createUser.dto");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/auth.dto");
const accessToken_guard_1 = require("../common/guards/accessToken.guard");
const refreshToken_guard_1 = require("../common/guards/refreshToken.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signup(user, res) {
        await this.authService.signUp(user)
            .then(result => res.status(common_1.HttpStatus.OK).send({ data: result }))
            .catch(error => res.status(error.status).send({ statusCode: error.status, error: error.message }));
    }
    async signin(authDto, res) {
        this.authService.signIn(authDto)
            .then(result => res.status(common_1.HttpStatus.OK).send({ data: result }))
            .catch(error => res.status(error.status).send({ statusCode: error.status, error: error.message }));
    }
    async logout(req, res) {
        this.authService.logOut(req.user['sub'])
            .then(result => res.status(common_1.HttpStatus.OK).send({ data: result }))
            .catch(error => res.status(error.status).send({ statusCode: error.status, error: error.message }));
    }
    async refresh(req, res) {
        this.authService.refresh(req.user['sub'], req.user['refreshToken'])
            .then(result => res.status(common_1.HttpStatus.OK).send({ data: result }))
            .catch(error => res.status(error.status).send({ statusCode: error.status, error: error.message }));
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Post)('/signup'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createUser_dto_1.CreateUserDTO, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Post)('/signin'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AuthDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signin", null);
__decorate([
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Post)("/logout"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(refreshToken_guard_1.RefreshTokenGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Post)("/refresh"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map