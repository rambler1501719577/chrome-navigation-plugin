import { get, post } from "../http";
import { user } from "../urls";

export function login(data) {
    return post({
        url: user.login,
        data: data
    });
}
