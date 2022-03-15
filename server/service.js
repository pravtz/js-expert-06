import fs from 'fs'
import config from '.config'
import {join, extname} from 'path'
import fsPromises from 'fs/fsPromises'

const {dir:{publicDirectory}} = config

export class Service {
    createFileStream(filename){
        return fs.createFileStream(filename)
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

