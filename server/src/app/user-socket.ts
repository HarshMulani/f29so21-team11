import { Server, Socket } from "socket.io";
import { User as UserModel } from "../models/User";
import { EventTypes } from "./event-types";
import { crudtemplate } from "./crud-template";
import { Connection } from "typeorm";
import { User } from "../entities/User";
import { v4 as uuidv4 } from 'uuid';

export class UserSocket extends crudtemplate<UserModel> {

    private connection: Connection;
    private loggedInUsers: Array<string> = []

    constructor(io: Server, connection: Connection) {
        super(io, EventTypes.User)
        this.connection = connection;
    }

    setupEvents(socket: Socket) {
        super.setupEvents(socket)
        this.login(socket);
    }

    emitUpdate(): void {
        
    }

    async removeUser(username: string) {
        let userRepo = this.connection.getRepository(User);
        let userToLeave = await userRepo.findOne({ Username: username }).catch((err) => { console.log(err); });
        if (userToLeave) {
            await userRepo.remove(userToLeave).catch((err) => { console.log(err); });
        }
    }

    async accountExists(username: string): Promise<boolean> {
        if (username == '') return false
        let userRepo = this.connection.getRepository(User);
        let user = await userRepo.find({Username: username});
        console.log(user, user.length == 0)
        return (user.length == 0) ? false : true;
    }

    async accountCorrect(account : UserModel) : Promise<boolean> {
        console.log(account)
        if (account.username == '') return false
        let userRepo = this.connection.getRepository(User);
        let user = await userRepo.find({Username: account.username, Password: account.password});
        console.log(user, user.length == 0)
        return (user.length == 0) ? false: true;
    }

    async makeItem(account: UserModel): Promise<void> {
        this.accountExists(account.username).then(async (val) => {
            console.log(val)
            if (!val) {
                let userRepo = this.connection.getRepository(User);
                let user = new User();
                user.ID = account.id;
                user.Username = account.username;
                user.Password = account.password;
                user.Email = account.email;
                console.log("Creating account")
                await userRepo.save(user).catch((err) => {console.log(err)})
            }
        })
    }

    login(socket: Socket) {
        socket.on(`${this.name}-login`, (account : UserModel)=> {
            console.log('Attempting user login')
            this.accountCorrect(account).then((val) => {
                console.log(val)
                if (val) {
                    console.log('Successfully logged in')
                    socket.emit(`${this.name}-log-in`, account);
                } else {
                    console.log('Failed to log in')
                    socket.emit(`${this.name}-log-in-failed`);
                }
            })

        })
    }

    delete(socket: Socket) {
        socket.on(`delete-${this.name}`, (username: string) => {
            this.accountExists(username).then((val) => {
                console.log(val)
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