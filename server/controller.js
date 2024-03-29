import { Service } from './service.js'
import { logger } from './util.js'
export  class Controller {
    constructor() {
        this.service = new Service()
    }

    async getFileStream(filename){
        return this.service.getFileStream(filename)
    }

    async handleCommand({ command }) {
      
        logger.info(`command received: ${command}`)
        const result = {
          result: 'ok'
        }
    
        const cmd = command.toLowerCase()

        // se o comando for start
        if(cmd.includes('start')) {
          this.service.startStreamming()
          return result
        }
        
        //se o comando for stop
        if(cmd.includes('stop')) {
          this.service.stopStreamming()
          return result
        }
        return result
      }

      createClientStream() {
        const {
            id,
            clientStream
        } = this.service.createClientStream()

        const onClose = () =>{
            logger.info(`closing connection of ${id}`)
            this.service.removeClientStream(id)
        }
        return {
            stream: clientStream,
            onClose
        }
    }
}