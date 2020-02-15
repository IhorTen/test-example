import UserStore from 'stores/UserStore'
import * as Superagent from "superagent"
import { BASE_URL } from 'consts'

export type Params = {
    url: string,
    endpoint: string,
    method: "POST" | "GET" | "PUT" | "DELETE"
    headers?: any
}

export interface AbortableRequest<T> {
    run?: ( data?: any ) => Promise<T>,
    abort?: () => void
}

function RequestWrap<T = any>(params: Params): AbortableRequest<T> {
    let { method, endpoint, url, headers = {} } = params
    const getRequest = (): Superagent.SuperAgentRequest => {
        switch(method) {
            case "POST":
                return Superagent.post(url + endpoint)
            case "GET":
                return Superagent.get(url + endpoint)
            case "PUT":
                return Superagent.put(url + endpoint)
            case "DELETE":
                return Superagent.delete(url + endpoint)
        }
    }

    var request = getRequest()

    return {
        run: ( data ) => {
            return new Promise((resolve, reject) => {
        
                var refreshHeader = {"Authorization": `Bearer ${UserStore.refreshToken}`}
                var accessHeader = {"Authorization": `Bearer ${UserStore.accessToken}`}
                var defaultHeaders = {
                    ...headers,
                    ...accessHeader
                }
            
                request
                    .set(defaultHeaders)
                    ;(method == "GET"
                        ? request.query(data)
                        : request.send(data)
                    ).then((res) => {
                        resolve(res.body as T)
                    })
                    .catch((error: Superagent.ResponseError) => {
                        if (!error.status)
                            return reject()

                        request = Superagent.post(`${BASE_URL}/api/auth/refresh`)
                        request
                            .set(refreshHeader)
                            .send()
                            .then((res) => {
                                UserStore.setAccessToken(res.body.access_token)
                                request = getRequest()
                                request
                                    .set({"Authorization": `Bearer ${UserStore.accessToken}`})
                                    .send(data)
                                    .then((res) => {
                                        resolve(res.body as T)
                                    })
                                    .catch(reject)
                            })
                            .catch(() => {
                                reject()
                                UserStore.logout()
                            })
                    })
            })
        },
        abort: () => request && request.abort()
    }
}
export default RequestWrap