import {jest, expect, describe, test, beforeEach} from '@jest/globals'
import TestUtil from '../_util/testUtil.js'
import {handler} from '../../../server/routes.js'
import config from '../../../server/config.js'
import { Controller } from '../../../server/controller.js'

const {location, pages, constants:{CONTENT_TYPE}} = config

describe('#Routes test suit for API response', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })

    test("GET / should redirect to home", async() => {
        const params = TestUtil.defaultHandlerParams()
        params.request.method = 'GET'
        params.request.url = '/'

        await handler(...params.values())

        expect(params.response.writeHead).toBeCalledWith(
            302,
            {'Location': location.home}
        )
        expect(params.response.end).toHaveBeenCalled()

    })
    test("GET /home should response with home/index.js file stream", async() => {
        const params = TestUtil.defaultHandlerParams()
        params.request.method = 'GET'
        params.request.url = '/home'
        const mockFileStream = TestUtil.genereteReadableStream(['data'])

        jest.spyOn(Controller.prototype,Controller.prototype.getFileStream.name)
            .mockResolvedValue({
                stream: mockFileStream,
                
            })
        jest.spyOn(mockFileStream, "pipe")
            .mockReturnValue()

        await handler(...params.values())

        expect(Controller.prototype.getFileStream).toBeCalledWith(pages.homeHTML)
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
        

    })
    test("GET /controller should response with controller/index.js file stream", async() => {
        const params = TestUtil.defaultHandlerParams()
        params.request.method = 'GET'
        params.request.url = '/controller'
        const mockFileStream = TestUtil.genereteReadableStream(['data'])

        jest.spyOn(Controller.prototype,Controller.prototype.getFileStream.name)
            .mockResolvedValue({
                stream: mockFileStream,
                
            })
        jest.spyOn(mockFileStream, "pipe")
            .mockReturnValue()

        await handler(...params.values())

        expect(Controller.prototype.getFileStream).toBeCalledWith(pages.constrollerHTML)
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
        

    })
    test("GET /index.html should response with file stream", async() => {
        const params = TestUtil.defaultHandlerParams()
        const filename = '/index.html'
        params.request.method = 'GET'
        params.request.url = filename
        const mockFileStream = TestUtil.genereteReadableStream(['data'])
        const expectType = ".html"

        jest.spyOn(Controller.prototype,Controller.prototype.getFileStream.name)
            .mockResolvedValue({
                stream: mockFileStream,
                type: expectType
                
            })
        jest.spyOn(mockFileStream, "pipe")
            .mockReturnValue()

        await handler(...params.values())

        expect(Controller.prototype.getFileStream).toBeCalledWith(filename)
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
        expect(params.response.writeHead).toBeCalledWith(
            200,
            {
                "Content-Type": CONTENT_TYPE[expectType]
            }
            
        )
        

    })
    test("GET /file.exe should response with file stream", async() => {
        const params = TestUtil.defaultHandlerParams()
        const filename = '/file.exe'
        params.request.method = 'GET'
        params.request.url = filename
        const mockFileStream = TestUtil.genereteReadableStream(['data'])
        const expectType = ".exe"

        jest.spyOn(Controller.prototype,Controller.prototype.getFileStream.name)
            .mockResolvedValue({
                stream: mockFileStream,
                type: expectType
                
            })
        jest.spyOn(mockFileStream, "pipe")
            .mockReturnValue()

        await handler(...params.values())

        expect(Controller.prototype.getFileStream).toBeCalledWith(filename)
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
        expect(params.response.writeHead).not.toBeCalled()
        

    })
    test("POST /unknown given an inexistent route it should response with 404", async() => {
        const params = TestUtil.defaultHandlerParams()
        params.request.method = 'POST'
        params.request.url = '/unknown'

        await handler(...params.values())

        expect(params.response.writeHead).toBeCalledWith(404)
        expect(params.response.end).toHaveBeenCalled()

    })
})
describe("exceptions", () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })
    test("given inexistent file should respond with 404", async() => {
        const params = TestUtil.defaultHandlerParams()
        params.request.method = 'GET'
        params.request.url = '/index.png'

        jest.spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
            .mockRejectedValue(new Error('Error: ENOENT: no such file or directory'))

        await handler(...params.values())

        expect(params.response.writeHead).toBeCalledWith(404)
        expect(params.response.end).toHaveBeenCalled()

    })
    test("given an error it should with 500", async() => {
        const params = TestUtil.defaultHandlerParams()
        params.request.method = 'GET'
        params.request.url = '/index.png'

        jest.spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
            .mockRejectedValue(new Error('Error: '))

        await handler(...params.values())

        expect(params.response.writeHead).toBeCalledWith(500)
        expect(params.response.end).toHaveBeenCalled()

    })
})