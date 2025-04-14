const express = require('express');
const path = require('path');
const { Server } = require('socket.io');
const http = require('http');
const time = new Date().toLocaleTimeString();
const date = new Date().toLocaleDateString();
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 7550;

// Serve static files
app.use(express.static(path.join(__dirname, '/public')));

// Socket.IO logic
io.on('connection', (socket) => {
    console.log("User Connected...!");

    // Join chat room
    socket.on('join chat', ({ username, room, }) => {
        socket.join(room);
        socket.username = username;
        socket.room = room;
        // Notify others
        socket.to(room).emit('chat message', {
            username: 'System',
            message: `${username} joined the chat. `,
            date,
            time
        });
    });

    // Receive and broadcast chat messages
    socket.on('chat message', ({ username, room, message }) => {
        io.to(room).emit('chat message',
            {
                username,
                message,
                time,
                date
               

            });
            console.log(`[${room}] ${username} (${time}): ${message}`);
    });

    // Typing indicator
    socket.on('typing', () => {
        socket.to(socket.room).emit('typing', socket.username);
    });

    socket.on('stop typing', () => {
        socket.to(socket.room).emit('stop typing');
    });

    // Optional: handle disconnect
    socket.on('disconnect', () => {
        if (socket.username && socket.room) {
            socket.to(socket.room).emit('chat message', {
                username: 'System',
                message: `${socket.username} left the chat.`,
                date,
                time
            });
        }
        console.log("User Disconnected.");
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});
// Start server
server.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});
