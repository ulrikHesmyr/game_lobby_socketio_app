const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const MAX_PLAYERS_PER_GAME = 4; // Number of players required to start a game
let lobby = []; // List of players in the lobby
let gameCount = 0; // To keep track of game instances


app.use(express.static('client'))

// Handle players connecting
io.on('connection', (socket) => {
    console.log(`Player ${socket.id} connected`);

    // Add player to the lobby
    lobby.push(socket);
    socket.join('lobby'); // Place the player in the lobby room

    // Notify the player they have joined the lobby
    socket.emit('lobby_joined', { message: 'You have joined the lobby' });

    // Check if the lobby is full
    if (lobby.length >= MAX_PLAYERS_PER_GAME) {
        createGameRoom();
    }

    // Listen for player disconnection
    socket.on('disconnect', () => {
        console.log(`Player ${socket.id} disconnected`);
        lobby = lobby.filter((s) => s !== socket); // Remove player from lobby
    });
});

// Function to create a game room
function createGameRoom() {
    const roomName = `game_${gameCount++}`; // Create a unique room name for the game
    const players = lobby.splice(0, MAX_PLAYERS_PER_GAME); // Take players from the lobby

    console.log(`Creating new game room: ${roomName} with players: ${players.map(p => p.id).join(', ')}`);

    // Add each player to the new game room
    players.forEach((socket) => {
        socket.leave('lobby'); // Remove player from the lobby room
        socket.join(roomName); // Place the player in the new game room
        socket.emit('game_start', { roomName, playerId: socket.id }); // Notify players to switch to the game
    });

    // Start the game logic in the room
    startGame(roomName, players);
}

// Function to handle game logic
function startGame(roomName, players) {
    console.log(`Starting game in room: ${roomName}`);

    // Listen for game events from each player
    players.forEach((socket) => {
        socket.on('game_event', (data) => {
            console.log(`Received game event from ${socket.id} in room ${roomName}:`, data);

            // Broadcast the event to other players in the same game room
            socket.to(roomName).emit('game_event', data);
        });

        socket.on('disconnect', () => {
            console.log(`Player ${socket.id} disconnected from game room ${roomName}`);
            // Handle player disconnection logic, such as ending the game or notifying other players
        });
    });
}

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
