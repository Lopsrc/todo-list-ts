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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const updateUser_dto_1 = require("./dto/updateUser.dto");
const recoverUser_dto_1 = require("./dto/recoverUser.dto");
const accessToken_guard_1 = require("../common/guards/accessToken.guard");
const role_decorator_1 = require("../roles/role.decorator");
const role_enum_1 = require("../roles/role.enum");
const role_guard_1 = require("../roles/role.guard");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    getAll(req, res) {
        this.usersService.getAllUsers(req.user['sub'])
            .then(result => res.status(common_1.HttpStatus.OK).send({ statusCode: common_1.HttpStatus.OK, data: result }))
            .catch(error => res.status(error.status).send({ statusCode: error.status, error: error.message }));
    }
    get(req, res) {
        this.usersService.getUserById(req.user['sub'])
            .then(result => res.status(common_1.HttpStatus.OK).send({ status: common_1.HttpStatus.OK, data: result }))
            .catch(error => res.status(error.status).send({ statusCode: error.status, error: error.message }));
    }
    update(req, user, res) {
        this.usersService.updateUser(req.user['sub'], user)
            .then(result => res.status(common_1.HttpStatus.CREATED).send({ status: common_1.HttpStatus.CREATED, data: result }))
            .catch(error => res.status(error.status).send({ statusCode: error.status, error: error.message }));
    }
    delete(req, res) {
        this.usersService.deleteUser(req.user['sub'])
            .then(result => res.status(common_1.HttpStatus.OK).send({ status: common_1.HttpStatus.OK, data: result }))
            .catch(error => res.status(error.status).send({ statusCode: error.status, error: error.message }));
    }
    recover(user, res) {
        this.usersService.recoverUser(user)
            .then(result => res.status(common_1.HttpStatus.CREATED).send({ status: common_1.HttpStatus.CREATED, data: result }))
            .catch(error => res.status(error.status).send({ statusCode: error.status, error: error.message }));
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, role_guard_1.RolesGuard),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "get", null);
__decorate([
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Put)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, updateUser_dto_1.UpdateUserDTO, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "delete", null);
__decorate([
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Put)('rec'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [recoverUser_dto_1.RecoverUserDTO, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "recover", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map