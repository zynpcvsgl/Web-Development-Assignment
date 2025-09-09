"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
let PostsService = class PostsService {
    constructor() {
        this.posts = [
            { id: 1, userId: 1, title: 'Hello world' },
            { id: 2, userId: 2, title: 'My first post' }
        ];
        this.nextId = 3;
    }
    findAll() { return this.posts; }
    findOne(id) {
        const p = this.posts.find(x => x.id === id);
        if (!p)
            throw new common_1.NotFoundException('Post not found');
        return p;
    }
    create(dto) {
        const p = Object.assign({ id: this.nextId++ }, dto);
        this.posts.push(p);
        return p;
    }
    update(id, dto) {
        const p = this.findOne(id);
        Object.assign(p, dto);
        return p;
    }
    remove(id) {
        const i = this.posts.findIndex(x => x.id === id);
        if (i === -1)
            throw new common_1.NotFoundException('Post not found');
        this.posts.splice(i, 1);
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)()
], PostsService);
