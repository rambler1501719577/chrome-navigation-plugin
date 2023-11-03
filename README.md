# 谷歌新标签页插件 ✈️

[项目官网](http://extension.suhaoblog.cn/)

# 一、整体功能介绍

chrome 新标签页插件, 支持快捷搜索, 快捷访问, 多端同步, 自定义组件, 一键换肤, 自定义桌面动效等功能
如果你是普通用户, 我们内置了很多自定义组件, 自由组合, 自定义程度很高
如果你是开发, 我们意在搭建一个像油猴的平台 , 允许你上传 html, js, css 等自定义自己的组件等

# 二、技术选型 ⚔️

由于插件是本地程序，不需要考虑构建后的体积和带宽问题，性能是技术选型的唯一因素了。
这个项目是基于很久之前的一个插件改造的，框架没有采用最新的 Vue3，也不会考虑升级（成本太大）
以下是当前项目的主要框架和库

-   vue@2、vuex@3.6、vue-router@3.5
-   element-ui@2.15
-   axios@0.19
-   lodash@4.17
-   less@4.1
-   其他第三方库

# 三、功能介绍 ⛪️

## 1. 搜索功能

作为最常用的功能, 在未激活(获取到焦点)时显示时间, 激活时支持在不同搜索引擎、本地书签、历史记录、快捷访问中进行搜索, 搜索结果将以列表展示， 支持通过键盘上下键切换搜索结果并通过回车跳转访问（新打开标签页）
以下是功能开发情况

-   搜索引擎配置
    -   添加搜索引擎 - ✅
    -   移除搜索引擎（右键或者悬浮显示移除） - ✅
    -   设置默认搜索引擎（百度） - ✅
-   待机状态显示时间 - ❌
-   搜索功能
    -   本地书签搜索 - ✅
    -   历史记录搜索 - ✅
    -   本地快捷访问搜索 - ✅
-   其他功能
    -   翻译 - ❌
    -   计算器运算功能 - ❌
    -   chat-gpt 问答(显示结果, 支持 regenerate) - ❌
-   more

## 2. 桌面鼠标右键

-   壁纸切换 ✅
-   撤销删除 ✅
-   系统设置 ❌

## 3. 快捷访问部分

占空间最大的区域, 主要展示常用组件和网站书签, 支持自定义添加和 DIY"组件"
注: 快捷访问的每一部分都被称为组件(widget)

-   书签组件
    -   添加书签 - ✅
    -   右键更改书签样式 - ✅
    -   右键选择新标签打开 - ✅
    -   隐藏书签 - ✅
    -   删除书签 - ✅
    -   右键书签自定义行为(类似手机百度 app 长按支持扫一扫等) - ✅
-   文件夹组件
    -   添加书签组件 - ❌
    -   自定义样式 - ❌
-   自定义组件
    -   待办
        -   添加待办 - ❌
        -   删除待办 - ❌
        -   置顶待办 - ❌
        -   多尺寸支持 - ❌
    -   倒计时
        -   添加倒计时 - ✅
        -   支持多尺寸组件 - ❌
        -   支持自定义样式 - ❌
        -   支持定义倒计时日期和标题 - ❌
        -   支持通过 window 通知提示用户 - ❌
    -   音乐播放器（之前做过相关，可参考）
        -   支持在网易、qq 音乐、酷狗音乐搜索并添加到歌单 - ❌
        -   支持声浪展示 - ❌
        -   自定义上传歌曲，打造自己的音乐库 - ❌
        -   支持播放模式切换 - ❌
        -   多尺寸组件 - ❌
    -   其他自定义组件， 如日历， 天气等

## 3. 背景

背景主要分为两层， 最底层是一个背景图， 上层是一个 canvas 的动效， 目前支持雪花和气泡两种， 后面将支持用户自定义背景和动效

-   背景切换 - ✅
-   上传多张自定义背景 - 20%
-   支持动态壁纸（gif | mp4） - ❌
-   自定义动效 - ❌

# 四、说明 ⚓️

欢迎提出 issue 或者一起开发这个插件 ‍❤️‍ ‍❤️‍ ‍❤️‍
