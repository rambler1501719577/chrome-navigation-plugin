import instance from "@/api/axiosConfig";
import { todo } from "../urls";

// 所有书签
export function getTodos(params, token) {
    return instance({
        url: todo.list,
        method: "get",
        params: params,
        headers: {
            Authorization: token
        }
    });
}
