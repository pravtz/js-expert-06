import {jest, expect, describe, test, beforeEach} from '@jest/globals'
import {Controller} from '../../../server/Controller.js'
import {Service} from '../../../server/service.js'
import TestUtil from '../_util/testUtil.js'

describe("#Controller suite test", () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })

    test('#getFileStream', async () => {
        const mockStream = TestUtil.genereteReadableStream(['data'])
        const mockType = '.html'
        const mockFileName = 'test.html'
    
        jest.spyOn(Service.prototype,Service.prototype.getFileStream.name,)
            .mockResolvedValue({
                stream: mockStream,
                type: mockType
            })
    
        const controller = new Controller()
        const { stream, type } = await controller.getFileStream(mockFileName)
    
        expect(stream).toStrictEqual(mockStream)
        expect(type).toStrictEqual(mockType)
      })
})