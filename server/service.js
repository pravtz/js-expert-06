import fs from 'fs'
import config from './config.js'
import {join, extname} from 'path'
import fsPromises from 'fs/promises'
import { randomUUID } from 'crypto'
import { PassThrough, Writable } from 'stream'
import  childProcess  from 'child_process'
import Throttle from 'throttle'
import streamPromises from 'stream/promises'
import { once } from 'events'
import {logger} from './util.js'

const {
    dir:{publicDirectory},
    constants:{
        fallbackBitRate, 
        englishConversation, 
        bitRateDivisor}
} = config

export class Service {
    constructor(){
        this.clientStreams = new Map()
        this.currentSong = englishConversation
        this.currentBitRate = 0
        this.throttleTranform = {}
        this.currentReadable = {}

        //this.startStream() // temporário
    }

    //cria o clinete
    createClientStream() {
        const id = randomUUID()
        const clientStream = new PassThrough()
        this.clientStreams.set(id,clientStream)

        return {
            id,
            clientStream
        }
    }

    //remove o cliente do map
    removeClientStream(id) {
        this.clientStreams.delete(id)
    }

    // função para execultar os comandos
    _executeSoxCommand(args){
        return childProcess.spawn('sox', args)
    }

    async getBitRate(song) {
        try {
            const args = [
                '--i',
                '-B',
                song
            ]
            const {
                stderr,
                stdout
                
            } = this._executeSoxCommand(args)

            //necessário para esperar a stream estar pronta para receber os dados
            await Promise.all([
                once(stdout, 'readable'),
                once(stderr, 'readable')
            ])

            const [sucess, error] = [stdout, stderr].map(stream => stream.read())
            if(error) return await Promise.reject(error)
            return sucess.toString().trim().replace(/k/,'000')
            
        } catch (error) {
            logger.info(`Error in the bitRate: ${error}`)
            return fallbackBitRate
        }
    }

    broadCast(){
        return new Writable({
            write: (chunk, enc, cb) => {
                for(const [key, stream] of this.clientStreams){
                    //se o cliente desconectou, não mandar mais chunks pra ele
                    if(stream.writableEnded){
                        this.clientStreams.delete(id)
                        continue;
                    }
                    stream.write(chunk)
                }
                cb()
            }
        })
    }
    async startStreamming() {
        logger.info(`starting with ${this.currentSong}`)
        const bitRate = this.currentBitRate = (await this.getBitRate(this.currentSong)) / bitRateDivisor
        const throttleTransform = this.throttleTransform = new Throttle(bitRate)
        const songReadable = this.currentReadable = this.createFileStream(this.currentSong)
        return streamPromises.pipeline(
          songReadable,
          throttleTransform,
          this.broadCast()
        )
      }
    stopStreamming(){
        this.throttleTransform?.end?.()
    }

    createFileStream(filename){
        return fs.createReadStream(filename)
    }

    async getFileInfo(file){
        const fullFilePath = join(publicDirectory,file)
        //valida se existe, caso não exista, retorna um erro!
        await fsPromises.access(fullFilePath)
        const fileType = extname(fullFilePath)
        return {
            type: fileType,
            name: fullFilePath
        }
    }

    async getFileStream(file){
        const { name, type } = await this.getFileInfo(file)
        return {
            stream: this.createFileStream(name),
            type
        }
    }
}

