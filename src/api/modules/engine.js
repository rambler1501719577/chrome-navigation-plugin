import instance from "@/api/axiosConfig";
import { engine } from "../urls";

// 所有搜索引擎
export function getEngineList() {
    return instance({
        url: engine.list,
        method: "get",
    });
}

// 添加搜索引擎
export function addEngine(data) {
    return instance({
        url: engine.add,
        method: "post",
        data: data,
    });
}

// 更新搜索引擎
export function updateEngine(data) {
    return instance({
        url: engine.update,
        method: "put",
        data,
    });
}

// 删除搜索引擎
export function destroyEngine(params) {
    return instance({
        url: engine.destory,
        method: "delete",
        params: params,
    });
}
