import { userInfo } from "os";
import { Server, Socket } from "socket.io";
import { Connection } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { User } from "../entities/User";


let currentRooms: Array<{id: string, name: string}> = [];

var server = (io: Server, connection: Connection) => {
    io.on('connection', (socket: Socket) => {


        console.log("User with id " + socket.id + " joined")

        socket.on("message", ({ msg, id }: { msg: string; id: string }) => {
            console.log(`Recieved message: ${msg}`);

            io.emit("echo-message", { msg: `Echoed message: ${msg}`, id });
        });

        socket.on('account-created', async (acc) => {
            let userRepo = connection.getRepository(User);
            let user = new User();
            user.Username = acc.username;
            user.Password = acc.password;
            user.Email = null;
            await userRepo.save(user).then(() => { console.log("User saved to database") }).catch((err) => console.log(err));
            console.log(`Account created with Username: ${acc.username} and Password: ${acc.password}`);
            socket.on('login', async (account) => {
                let accUser = await userRepo.find({ Username: account.username });
                // if (accUser != null && accUser[0].Password == account.password) {

                // }
            });
        });

        socket.on('get-room-list', () => {
            socket.emit('room-list-update', currentRooms)
        })

        socket.on('createRoom', () => {
            const id = uuidv4(); // generated new ID for room

            currentRooms.push({id, name: 'name'});
            console.log(`Room created with id ${id}`);
            socket.on(id, (msg: string) => {
                console.log(msg);
                io.emit(id + 'msg', { id: uuidv4(), sentBy: 'Server', message: `Message from ${id} -> ${msg}` })
            })
            io.emit("room-list-update", currentRooms);
        })

        socket.on('delete-room', (id: string) => {
            if (!currentRooms.find((room) => room.id == id)) {
                console.log(`Room with ID: ${id} does not exist`);
                return;
            }
            io.emit("room-list-update", currentRooms);

            socket.leave(id);
        })

        socket.on('clear-users', async () => {
            let userRepo = connection.getRepository(User);
            let usersToDelete = await userRepo.find();
            usersToDelete.forEach((user) => { if (user.Username != socket.id || user.Username != 'TestUser') { userRepo.remove(user); } });

            let Users = await userRepo.find();
            Users.forEach((user) => { console.log(`User: ${user.Username}`); });
        })

        socket.on('disconnect', async (reason) => {
            console.log(`User with id ${socket.id} has disconnected`);
            let userRepo = connection.getRepository(User);
            let userToLeave = await userRepo.findOne({ Username: socket.id }).catch((err) => { console.log(err); });
            if (userToLeave) {
                await userRepo.remove(userToLeave).catch((err) => { console.log(err); });
            }
        })
    })
}

export { server };