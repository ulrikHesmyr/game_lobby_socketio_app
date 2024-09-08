1. klient kobler til og blir plassert i lobby og får bekreftelse på det
- 1.1 server: socket.join('lobby')
- 1.2 server: socket.emit('lobby_joined')
- 1.3 client: socket.on('lobby_joined', ...funksjon som displayer på frontend at man ble med i lobby)
2. når x antall klienter har koblet til og blitt plassert i lobby, så flyttes de inn i et game room og spillet begynner
- 2.1 server: socket.leave('lobby')
- 2.2 sever: socket.join(`${roomName}`)
- 2.3 server: socket.emit('game_start', ...)
- 2.4 client: socket.on('game_start', ...funksjon som displayer på frontend at spill har startet)
3. når én klient utfører en spill-handling, så får alle klienter oppdatering
- 3.1 klient: socket.emit('game_event', ...)
- 3.2 server: socket.on('game_event', ...spill logikk funksjon)
- 3.3 server: socket.to(roomName).emit('game_event', ...)

    