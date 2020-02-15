import RequestWrap from "libs/requestWrap"
import { IdentityData } from "typings/API"
import { BASE_URL } from "consts"

export const identity = () =>  RequestWrap<IdentityData>({
    url: BASE_URL,
    endpoint: "/api/candidates/identity",
    method: "GET"
})
