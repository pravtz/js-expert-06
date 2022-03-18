import {jest, expect, describe, test, beforeEach} from '@jest/globals'
import {Service} from '../../../server/service.js'
import TestUtil from '../_util/testUtil.js'
import fs from 'fs'
import fsPromises from 'fs/promises'
import config from '../../../server/config.js'

const {dir: {publicDirectory}} = config

describe("#Service suite test", () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })

    test("#createFileStream" , () => {
        const dataReadable = TestUtil.genereteReadableStream(['data'])

        jest.spyOn(fs, fs.createReadStream.name)
            .mockReturnValue(dataReadable)
        
        const service = new Service()
        const file = 'file.html'
        
        expect(service.createFileStream(file)).toStrictEqual(dataReadable)
        expect(fs.createReadStream).toHaveBeenCalledWith(file)
    })
    test("#getFileInfo", async () => {
        jest.spyOn(
            fsPromises,
            fsPromises.access.name
          ).mockResolvedValue()
        const file = "file.mp3"
        const service = new Service()
        const result = await service.getFileInfo(file)

        const expected = {
            type: '.mp3',
            name: `${publicDirectory}/${file}`
        }
        expect(result).toStrictEqual(expected)
    })
    test("#getFileStream", async () => {
        const file = 'file.mp3'
        const fullFilePath = `${publicDirectory}/${file}`
        const service = new Service()

        const returnGetFileInfo = {
            type: ".mp3",
            name: fullFilePath
        }
        const generateStream = TestUtil.genereteReadableStream(['valor'])

        jest.spyOn(service, service.getFileInfo.name)
            .mockResolvedValue(returnGetFileInfo)

        jest.spyOn(service, service.createFileStream.name)
            .mockReturnValue(generateStream)

        const result = await service.getFileStream(file)
        const expected = {
            stream: generateStream,
            type: returnGetFileInfo.type
        }

        expect(result).toStrictEqual(expected)
        expect(service.getFileInfo).toHaveBeenCalledWith(file)
        expect(service.createFileStream).toHaveBeenCalledWith(returnGetFileInfo.name)
    })
})