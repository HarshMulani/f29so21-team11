import { Server, Socket } from "socket.io";
import { Connection } from "typeorm";
import { User } from "../entities/User";
import { RoomSocket } from "./room-socket";
import { MessageSocket } from "./message-socket";


var server = (io: Server, connection: Connection) => {

    // const ws = new WhiteBoardSocket(io);
    const rs = new RoomSocket(io); // setting up functionality of rooms
    const ms = new MessageSocket(io, rs); // setting up functionality of messages

    io.on('connection', (socket: Socket) => { // user connects

        console.log("User with id " + socket.id + " joined")
        

/*  =======================================================================================================================================================================  */
/*  ===============================================================  Chat Room Management  ================================================================================  */
/*  =======================================================================================================================================================================  */

        rs.setupEvents(socket); // making listeners for recieving room events
        ms.setupEvents(socket); // making listeners for recieving chat message events


/*  =======================================================================================================================================================================  */
/*  =================================================================  Account Management  ================================================================================  */
/*  =======================================================================================================================================================================  */


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
            usersToDelete.forEach((user) => { if (user.Username != socket.id || user.Username != 'TestUser') { userRepo.remove(user); } });

            let Users = await userRepo.find();
            Users.forEach((user) => { console.log(`User: ${user.Username}`); });
        })


/*  =======================================================================================================================================================================  */
/*  ==================================================================  Socket Management  ================================================================================  */
/*  =======================================================================================================================================================================  */


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