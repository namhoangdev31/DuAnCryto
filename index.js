import express, { json } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { notFound, errorHandler } from './middleware/errorHandler.js'
import sequelize from './dbConnection.js'
import { fileURLToPath } from 'url';
import { dirname , join} from 'path';

import User from './models/User.js'
import Article from './models/Article.js'
import Tag from './models/Tag.js'
import Comment from './models/Comments.js'

import userRoute from './routes/users.js'
import articleRoute from './routes/articles.js'
import commentRoute from './routes/comments.js'
import tagRoute from './routes/tags.js'
import profileRoute from './routes/profile.js'
import favouriteRoute from './routes/favourites.js'

const app = express()
const server = http.createServer(app);
const io = new SocketIOServer(server);
//CORS
app.use(cors({credentials: true, origin: [
    "http://localhost:5001"
]})) 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//RELATIONS:
//1 to many relation between user and article
User.hasMany(Article,{
    onDelete: 'CASCADE'
})
Article.belongsTo(User)

//many to many relation between article and taglist
Article.belongsToMany(Tag,{through: 'TagList',uniqueKey:false,timestamps:false})
Tag.belongsToMany(Article,{through: 'TagList',uniqueKey:false,timestamps:false})

//One to many relation between Article and Comments
Article.hasMany(Comment,{onDelete: 'CASCADE'})
Comment.belongsTo(Article)

//One to many relation between User and Comments
User.hasMany(Comment,{onDelete: 'CASCADE'})
Comment.belongsTo(User)

//Many to many relation between User and User
User.belongsToMany(User,{
    through:'Followers',
    as:'followers',
    timestamps:false,
})

//favourite Many to many relation between User and article
User.belongsToMany(Article,{through: 'Favourites',timestamps:false})
Article.belongsToMany(User,{through: 'Favourites',timestamps:false})



const sync = async () => await sequelize.sync({alter:true})
sync()

app.use(json())
app.use(morgan('tiny'))
app.use(express.static(join(__dirname, 'public')));
app.get('/',(req,res) => {
    res.json({status:"API is running"});
})

app.get('/test', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});
app.use('/api',userRoute)
app.use('/api/articles',articleRoute)
app.use('/api/articles',commentRoute)
app.use('/api/tags',tagRoute)
app.use('/api/profiles',profileRoute)
app.use('/api/articles',favouriteRoute)
app.use(notFound)
app.use(errorHandler)

io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for incoming chat messages
    socket.on('sendchat', (username, message) => {
        console.log(`${username}: ${message}`);

        // Broadcast the message to all clients except the sender
        socket.broadcast.emit('updatechat', username, message);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


const PORT = process.env.PORT || 8080

server.listen(PORT,() => {
    console.log(`Server running on http://localhost:8080`);
})