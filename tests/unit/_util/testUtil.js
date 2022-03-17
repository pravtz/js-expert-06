import {jest} from '@jest/globals'
import {Readable, Writable} from 'stream'

export default class TestUtil {
    static genereteReadableStream(data){
        return new Readable({
            read() {
                for(const iten of data){
                    this.push(iten)
                }
                this.push(null)
            }
        })
    }
    static generateWritableStream(onData){
        return new Writable({
            write(chunk, enc, cb){
                onData(chunk)

                cb(null, chunk)
            }
        })
    }

    static defaultHandlerParams() {
        const requestStream = TestUtil.genereteReadableStream(['body'])
        const response = TestUtil.generateWritableStream(()=> {})
        const data = {
            request: Object.assign(requestStream, {
                headers: {},
                method: "",
                url: ""
            }),
            response: Object.assign(response, {
                writeHead: jest.fn(),
                end: jest.fn()
            })
        }

        return {
            values: () => Object.values(data),
            ...data
        }
    }
}