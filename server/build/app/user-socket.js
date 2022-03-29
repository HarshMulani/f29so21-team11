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
const uuid_1 = require("uuid");
const fs_1 = require("fs");
class UserSocket extends crud_template_1.crudtemplate {
    constructor(io /*, connection: Connection*/) {
        super(io, event_types_1.EventTypes.User);
        this.loggedInUsers = [];
        this.accounts = [];
        // this.connection = connection;
    }
    setupEvents(socket) {
        super.setupEvents(socket);
        this.updateStats(socket);
        this.retrieve(socket);
        this.login(socket);
    }
    emitUpdate() {
    }
    updateStats(socket) {
        socket.on(`update-${this.name}-stats`, (data) => __awaiter(this, void 0, void 0, function* () {
            let json = (0, fs_1.readFileSync)("./server/accounts.json", 'utf8');
            let a = JSON.parse(json);
            let num = a[data.name]['stats'][data.stat];
            a[data.name]['stats'][data.stat] = (num + 1);
            // console.log(JSON.stringify(a))
            (0, fs_1.writeFileSync)("./server/accounts.json", JSON.stringify(a));
            socket.emit('update-stats', a[data.name]);
        }));
    }
    update(socket) {
        socket.on(`update-${this.name}`, (account) => {
            console.log(account);
            let json = (0, fs_1.readFileSync)("./server/accounts.json", 'utf8');
            let a = JSON.parse(json);
            a[account.username]['bio'] = account.bio;
            (0, fs_1.writeFileSync)("./server/accounts.json", JSON.stringify(a));
        });
    }
    retrieve(socket) {
        socket.on('get-personal-user', (name) => __awaiter(this, void 0, void 0, function* () {
            let user = yield this.getUser(name);
            if (user) {
                socket.emit('get-user', user);
            }
        }));
    }
    getUser(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            let json = (0, fs_1.readFileSync)("./server/accounts.json", 'utf8');
            let a = JSON.parse(json);
            user = a[name];
            if (user == undefined)
                return null;
            user.username = name;
            return (user) ? user : null;
            // return this.accounts.find((user) => user.username == name);
        });
    }
    removeUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            // let userRepo = this.connection.getRepository(User);
            // let userToLeave = await userRepo.findOne({ Username: username }).catch((err) => { console.log(err); });
            // if (userToLeave) {
            //     await userRepo.remove(userToLeave).catch((err) => { console.log(err); });
            // }
        });
    }
    accountExists(username) {
        return __awaiter(this, void 0, void 0, function* () {
            // if (username == '') return false
            let user;
            let json = (0, fs_1.readFileSync)("./server/accounts.json", 'utf8');
            let a = JSON.parse(json);
            user = a[username];
            if (user == undefined)
                return false;
            else
                return true;
            // if (this.accounts.find((acc) => acc.username == username)) {
            //     return true
            // } else {
            //     return false
            // }
            // let userRepo = this.connection.getRepository(User);
            // let user = await userRepo.find({Username: username});
            // console.log(user, user.length == 0)
            // return (user.length == 0) ? false : true;
        });
    }
    accountCorrect(account) {
        return __awaiter(this, void 0, void 0, function* () {
            // if (account.username == '') return false
            let user;
            let json = (0, fs_1.readFileSync)("./server/accounts.json", 'utf8');
            let a = JSON.parse(json);
            user = a[account.username];
            if (user == undefined)
                return false;
            return (user.password == account.password) ? true : false;
            // if (this.accounts.find((acc) => acc.username == account.username && acc.password == account.password)) {
            //     return true
            // } else {
            //     return false
            // }
            // let userRepo = this.connection.getRepository(User);
            // let user = await userRepo.find({Username: account.username, Password: account.password});
            // console.log(user, user.length == 0)
            // return (user.length == 0) ? false: true;
        });
    }
    makeItem(account) {
        return __awaiter(this, void 0, void 0, function* () {
            this.accountExists(account.username).then((val) => __awaiter(this, void 0, void 0, function* () {
                if (!val) {
                    let id = (0, uuid_1.v4)();
                    ;
                    this.accounts.push({ id: id, username: account.username, email: account.email, password: account.password, stats: { posts: 0, groups: 0, chats: 0 }, bio: '' });
                    let json = (0, fs_1.readFileSync)("./server/accounts.json", 'utf8');
                    let a = JSON.parse(json);
                    a[account.username] = { id: id, email: account.email, password: account.password, stats: { posts: 0, groups: 0, chats: 0 }, bio: '' };
                    (0, fs_1.writeFileSync)("./server/accounts.json", JSON.stringify(a));
                    // let userRepo = this.connection.getRepository(User);
                    // let user = new User();
                    // user.ID = uuidv4();
                    // user.Username = account.username;
                    // user.Password = account.password;
                    // user.Email = account.email;
                    console.log("Creating account");
                    // await userRepo.save(user).catch((err) => {console.log(err)})
                }
            }));
        });
    }
    login(socket) {
        socket.on(`${this.name}-login`, (account) => __awaiter(this, void 0, void 0, function* () {
            console.log('Attempting user login');
            let val = yield this.accountCorrect(account);
            console.log("val", val);
            if (val) {
                console.log('Successfully logged in');
                let acc = yield this.getUser(account.username);
                console.log(acc);
                socket.emit(`${this.name}-log-in`, acc);
            }
            else {
                console.log('Failed to log in');
                socket.emit(`${this.name}-log-in-failed`);
            }
        }));
    }
    delete(socket) {
        socket.on(`delete-${this.name}`, (username) => {
            this.accountExists(username).then((val) => {
                if (!val) {
                    this.removeUser(username);
                }
            });
        });
    }
}
exports.UserSocket = UserSocket;
