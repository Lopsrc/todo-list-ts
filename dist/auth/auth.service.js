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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const argon2 = require("argon2");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async signUp(user) {
        const userExist = await this.usersService.getUserByEmail(user.email);
        if (userExist) {
            throw new common_1.BadRequestException('User already exists');
        }
        const hash = await argon2.hash(user.password);
        const newUser = await this.usersService.createUser({
            name: user.name || null,
            email: user.email,
            pass_hash: hash,
            role: user.role || null,
            birth_date: new Date(user.birthDate) || null,
        });
        const tokens = await this.generateTokens(newUser.id, newUser.email, user.role);
        const refreshHash = await argon2.hash(tokens.refreshToken);
        await this.usersService.signIn({
            email: newUser.email,
            refresh_token_hash: refreshHash
        });
        return tokens;
    }
    async signIn(authDto) {
        const user = await this.usersService.getUserByEmail(authDto.email);
        if (!user || user.del) {
            throw new common_1.BadRequestException('User does not exist');
        }
        const passwordMatches = await argon2.verify(user.pass_hash, authDto.password);
        if (!passwordMatches) {
            throw new common_1.BadRequestException('Password is incorrect');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        const hashedRefreshToken = await argon2.hash(tokens.refreshToken);
        console.log(user.email);
        await this.usersService.signIn({ email: user.email,
            refresh_token_hash: hashedRefreshToken });
        return tokens;
    }
    async logOut(id) {
        return this.usersService.logOut({ id, refresh_token_hash: null });
    }
    async refresh(id, token) {
        const user = await this.usersService.getUserById(id);
        if (!user || user.del) {
            throw new common_1.BadRequestException('User does not exist');
        }
        const tokenMatches = await argon2.verify(user.refresh_token_hash, token);
        if (!tokenMatches) {
            throw new common_1.BadRequestException('Token is not valid');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        const hashedRefreshToken = await argon2.hash(tokens.refreshToken);
        await this.usersService.signIn({
            email: user.email,
            refresh_token_hash: hashedRefreshToken
        });
        return tokens;
    }
    async generateTokens(userId, email, role) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email,
                role,
            }, {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: process.env.ACCESS_TOKEN_TTL,
            }),
            this.jwtService.signAsync({
                sub: userId,
                email,
                role,
            }, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: process.env.REFRESH_TOKEN_TTL,
            }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map