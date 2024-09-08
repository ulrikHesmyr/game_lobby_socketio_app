1. klient kobler til og blir plassert i lobby og får bekreftelse på det
    1.1 server: socket.join('lobby')
    1.2 server: socket.emit('lobby_joined')
    1.3 client: socket.on('lobby_joined')
2. når 8 klienter har koblet til og blitt plassert i lobby, så flyttes de inn i et game room
    2.1 server: socket.leave('lobby')
    2.2 sever: socket.join(`${roomName}`)
    2.3 server: socket.emit('game_start')
    2.4 client: socket.on('game_start')
    