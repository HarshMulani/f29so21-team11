import { Server, Socket } from "socket.io";
import { User as UserModel } from "../models/User";
import { EventTypes } from "./event-types";
import { crudtemplate } from "./crud-template";
import { Connection } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { readFile, readFileSync, writeFileSync } from "fs";
import { writeFile } from "fs/promises";

export class UserSocket extends crudtemplate<UserModel> {

    private connection: Connection;
    private loggedInUsers: Array<string> = []
    private accounts: Array<UserModel> = []

    constructor(io: Server/*, connection: Connection*/) {
        super(io, EventTypes.User)
        // this.connection = connection;
    }

    setupEvents(socket: Socket) {
        super.setupEvents(socket)
        this.updateStats(socket);
        this.retrieve(socket);
        this.login(socket);
    }

    emitUpdate(): void {
        
    }

    updateStats(socket: Socket): void {
        socket.on(`update-${this.name}-stats`, async (data: {name: string, stat: string}) => {
            let json: string = readFileSync("./server/accounts.json", 'utf8')
            let a: JSON = JSON.parse(json);
            let num: number = a[data.name]['stats'][data.stat];
            a[data.name]['stats'][data.stat] = (num + 1)
            // console.log(JSON.stringify(a))
            writeFileSync("./server/accounts.json", JSON.stringify(a));
            socket.emit('update-stats', a[data.name])
        })
    }

    update(socket: Socket) {
        socket.on(`update-${this.name}`, (account: UserModel) => { // Update item
            let json: string = readFileSync("./server/accounts.json", 'utf8')
            let a: JSON = JSON.parse(json);
            a[account.username]['bio'] = account.bio;
            writeFileSync("./server/accounts.json", JSON.stringify(a));
        })
    }

    retrieve(socket: Socket): void {
        socket.on('get-personal-user', async (name: string) => {
            let user: UserModel = await this.getUser(name)
            if (user) {
                socket.emit('get-user', user)
            }
        })
    }

    async getUser(name: string): Promise<UserModel> {
        let user: UserModel

        let json = readFileSync("./server/accounts.json", 'utf8')

        let a = JSON.parse(json);
        user = a[name]
        if (user == undefined) return null
        user.username = name         
                
        return (user) ? user : null 
        // return this.accounts.find((user) => user.username == name);
    } 

    async removeUser(username: string) {
        // let userRepo = this.connection.getRepository(User);
        // let userToLeave = await userRepo.findOne({ Username: username }).catch((err) => { console.log(err); });
        // if (userToLeave) {
        //     await userRepo.remove(userToLeave).catch((err) => { console.log(err); });
        // }
    }

    async accountExists(username: string): Promise<boolean> {
        // if (username == '') return false

        let user: UserModel;
        let json = readFileSync("./server/accounts.json", 'utf8')
        let a = JSON.parse(json);
        user = a[username]
        
        if (user == undefined) return false
        else return true
        // if (this.accounts.find((acc) => acc.username == username)) {
        //     return true
        // } else {
        //     return false
        // }
        
        // let userRepo = this.connection.getRepository(User);
        // let user = await userRepo.find({Username: username});
        // console.log(user, user.length == 0)
        // return (user.length == 0) ? false : true;
    }

    async accountCorrect(account : UserModel) : Promise<boolean> {
        // if (account.username == '') return false

        let user: UserModel

        let json = readFileSync("./server/accounts.json", 'utf8')

        let a = JSON.parse(json);
        user = a[account.username]      

        if (user == undefined) return false
        return (user.password == account.password) ? true : false 
        // if (this.accounts.find((acc) => acc.username == account.username && acc.password == account.password)) {
        //     return true
        // } else {
        //     return false
        // }

        // let userRepo = this.connection.getRepository(User);
        // let user = await userRepo.find({Username: account.username, Password: account.password});
        // console.log(user, user.length == 0)
        // return (user.length == 0) ? false: true;
    }

    async makeItem(account: UserModel): Promise<void> {
        this.accountExists(account.username).then(async (val) => {
            if (!val) {
                let id = uuidv4();;
                this.accounts.push({id: id, username: account.username, email: account.email, password: account.password, stats: {posts: 0, groups: 0, chats: 0}, bio: '' })
                
                let json = readFileSync("./server/accounts.json", 'utf8')
                let a = JSON.parse(json);
                a[account.username] = {id: id, email: account.email, password: account.password, stats: {posts: 0, groups: 0, chats: 0}, bio: '' };
                writeFileSync("./server/accounts.json", JSON.stringify(a));

                // let userRepo = this.connection.getRepository(User);
                // let user = new User();
                // user.ID = uuidv4();
                // user.Username = account.username;
                // user.Password = account.password;
                // user.Email = account.email;
                console.log("Creating account")
                // await userRepo.save(user).catch((err) => {console.log(err)})
            }
        })
    }

    login(socket: Socket) {
        socket.on(`${this.name}-login`, async (account : UserModel)=> {
            console.log('Attempting user login')
            let val = await this.accountCorrect(account)
            console.log("val", val)
            if (val) {
                console.log('Successfully logged in')
                let acc: UserModel = await this.getUser(account.username)
                console.log(acc)
                socket.emit(`${this.name}-log-in`, acc);
            } else {
                console.log('Failed to log in')
                socket.emit(`${this.name}-log-in-failed`);
            }
        })
    }

    delete(socket: Socket) {
        socket.on(`delete-${this.name}`, (username: string) => {
            this.accountExists(username).then((val) => {
                if (!val) {
                    this.removeUser(username);
                }
            });
            
        })
    }

    /*

    socket.on('account-created', async (acc) => {
        let userRepo = connection.getRepository(User);
        let user = new User();
        user.Username = acc.username;
        user.Password = acc.password;
        user.Email = null;
        await userRepo.save(user).then(() => { console.log("User saved to database") }).catch((err) => console.log(err));
        console.log(`Account created with Username: ${acc.username} and Password: ${acc.password}`);
    });

    socket.on('login', async (account) => {
        let userRepo = connection.getRepository(User);
        let accUser = await userRepo.find({ Username: account.username });
        if (accUser != null && accUser[0].Password == account.password) {
            socket.emit('successfully-logged-in');
        }
    });

    socket.on('clear-users', async () => {
        let userRepo = connection.getRepository(User);
        let usersToDelete = await userRepo.find();
        usersToDelete.forEach((user) => { userRepo.remove(user); });

        // let Users = await userRepo.find();
        // Users.forEach((user) => { console.log(`User: ${user.Username}`); });
    })

    */
}