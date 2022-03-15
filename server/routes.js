import config from "./config"
import { Controller } from "./controller"
import { logger } from "./util"
const {location, pages: {homeHTML}} = config

async function routes(request,response){
    const {method , url} = request

    if(method === "GET" && url === '/'){
        response.writeHead(302, {
            "Location": location.home
        })
        response.end()
    }
    if(method ===GET && url === '/home'){
        const {stream} = await Controller.getFileStream(homeHTML)
        return stream.pipe(response)
    }

    return response.end('Hellow')
    
}

export function handler(request, response){
    return routes(request,response).catch(
        error=> logger.error(`Deu algo errado: ${error.stack}`)
    )
}