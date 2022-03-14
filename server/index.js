import server from './service.js'

server.listen(3000).on('listening', () => console.log('server running...'))