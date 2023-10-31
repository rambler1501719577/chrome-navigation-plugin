# 快捷访问布局实现

注: 快捷访问中的元素称为"组件"
整体布局上通过 css 中的 grid 布局实现, 在进入系统之前加载用户数据(包含组件类型和大小), 并计算每个"组件"在 grid 布局中的位置和大小
计算过程: grid 布局分为行列, 于是通过二维数组来模拟整个布局, 通过两次遍历来模拟往"网格"中放置"组件"的过程, 如果一个组件放得下会依次向后排列,
否则会向下尝试, 当所以"组件"都放置完毕, 整体布局也就计算完毕, 容器行列也就确定

# 右键弹出菜单唯一

通过事件总线思路实现, 每个组件都有唯一 id, 在"组件"上鼠标右键时, 会向事件总线发送一个 widget-contextmenu 事件并发送当前组件 id, 所有组件在注册时会监听这个事件, 并比较负载 id 和当前组件 id, 如果不一致, 则关闭右键弹出菜单, 一致则更新位置(不需要操作)
注: 全局右键菜单层级 >> 组件右键菜单, 所以会存在覆盖问题
example

```javascript
this.$event.$on("widget-contextmenu", (payload) => {
    if (payload !== this.id && this.contextMenuVisible) {
        this.contextMenuVisible = false;
    }
});
```

# 续签 token

## 通过 localstorage 保存 refresh_token 安全性问题

鉴于 refresh_token 保存在本地, 不存在恶意续签获取 token 情况, 后面会考虑做非对称加密, 公钥放在客户端, 私钥放在服务端, 客户端对 token 做一次签名, 在服务端进行解密验证, 过滤部分恶意请求

## 过期验证

目前设置 token 有效时间是 24 小时, 第二天需要重新登录, 对用户非常不友好, 因此根据主流解决方案, 通过 access_token 短期 token 作为请求凭证, refresh_token 作为更新 token 的票据
access_token 过期后, 会拿 refresh_token 来更新 access_token, refresh_token 不主动过期, 只有当调用 replaceToken 接口时, 才在服务端验证票据是否过期
因此: 只有当服务端验证 refresh_token 过期, 客户端才算真正意义上的过期 !!!!!
