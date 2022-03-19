"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSocket = void 0;
const event_types_1 = require("./event-types");
const crud_template_1 = require("./crud-template");
const User_1 = require("../entities/User");
const uuid_1 = require("uuid");
class UserSocket extends crud_template_1.crudtemplate {
    constructor(io /*, connection: Connection*/) {
        super(io, event_types_1.EventTypes.User);
        this.loggedInUsers = [];
        // this.connection = connection;
    }
    setupEvents(socket) {
        super.setupEvents(socket);
        this.login(socket);
    }
    emitUpdate() {
    }
    removeUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            let userRepo = this.connection.getRepository(User_1.User);
            let userToLeave = yield userRepo.findOne({ Username: username }).catch((err) => { console.log(err); });
            if (userToLeave) {
                yield userRepo.remove(userToLeave).catch((err) => { console.log(err); });
            }
        });
    }
    accountExists(username) {
        return __awaiter(this, void 0, void 0, function* () {
            if (username == '')
                return false;
            let userRepo = this.connection.getRepository(User_1.User);
            let user = yield userRepo.find({ Username: username });
            console.log(user, user.length == 0);
            return (user.length == 0) ? false : true;
        });
    }
    accountCorrect(account) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(account);
            if (account.username == '')
                return false;
            let userRepo = this.connection.getRepository(User_1.User);
            let user = yield userRepo.find({ Username: account.username, Password: account.password });
            console.log(user, user.length == 0);
            return (user.length == 0) ? false : true;
        });
    }
    makeItem(account) {
        return __awaiter(this, void 0, void 0, function* () {
            this.accountExists(account.username).then((val) => __awaiter(this, void 0, void 0, function* () {
                console.log(val);
                if (!val) {
                    let userRepo = this.connection.getRepository(User_1.User);
                    let user = new User_1.User();
                    user.ID = (0, uuid_1.v4)();
                    user.Username = account.username;
                    user.Password = account.password;
                    user.Email = account.email;
                    console.log("Creating account");
                    yield userRepo.save(user).catch((err) => { console.log(err); });
                }
            }));
        });
    }
    login(socket) {
        socket.on(`${this.name}-login`, (account) => {
            console.log('Attempting user login');
            this.accountCorrect(account).then((val) => {
                console.log(val);
                if (val) {
                    console.log('Successfully logged in');
                    socket.emit(`${this.name}-log-in`, account);
                }
                else {
                    console.log('Failed to log in');
                    socket.emit(`${this.name}-log-in-failed`);
                }
            });
        });
    }
    delete(socket) {
        socket.on(`delete-${this.name}`, (username) => {
            this.accountExists(username).then((val) => {
                console.log(val);
                if (!val) {
                    this.removeUser(username);
                }
            });
        });
    }
}
exports.UserSocket = UserSocket;
