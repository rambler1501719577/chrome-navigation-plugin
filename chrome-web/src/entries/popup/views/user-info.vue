<template>
    <div class="user-box">
        <div class="bg"></div>
        <div class="user-info">
            <div class="avatar">
                <img
                    src="../../../assets/images/header.jpg"
                    width="100%"
                    alt=""
                />
            </div>
            <div class="name">
                <h1 class="username">Rambler</h1>
            </div>
            <div class="tags">
                <span v-for="(tag, index) of userTags">{{ tag }}</span>
            </div>
            <div class="exit">
                <button id="logout">退出</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "PopupUp",
    data() {
        return {
            userTags: ["Coding", "DJ", "Game"]
        };
    }
};
</script>

<style lang="less" scoped>
.user-box {
    background-color: #eee;
    height: 316px;
    overflow: hidden;
}

.bg {
    height: 120px;
    width: 100%;
    overflow: hidden;
    background-image: url(../../../assets/images/background.jpg);
    background-size: cover;
    background-repeat: no-repeat;
}

.user-info {
    width: 100%;
    position: relative;
    top: -50px;
}

.avatar {
    width: 100px;
    height: 100px;
    margin-left: 100px;
    position: relative;
    user-select: none;
}

.avatar img {
    border-radius: 50%;
}

.user-info .name h1 {
    text-align: center;
    color: #333;
    margin-top: 16px;
    font-size: 24px;
    font-weight: 500;
    user-select: none;
}

.tags {
    padding: 0 25px;
    margin-top: 16px;
    display: flex;
    justify-content: space-around;
}

.tags span {
    display: block;
    color: #666;
    position: relative;
    user-select: none;
}

.tags span:before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 5px;
    position: absolute;
    left: -15px;
    top: 7px;
}

.tags span:nth-child(1):before {
    background-color: #d2b56e;
}

.tags span:nth-child(2):before {
    background-color: #3d6493;
}

.tags span:nth-child(3):before {
    background-color: #58a890;
}

.exit {
    margin-top: 16px;
    text-align: center;
}

.exit button {
    user-select: none;
    display: inline-block;
    width: 96%;
    height: 40px;
    outline: none;
    background-color: #2d7c8b;
    border: none;
    color: #fff;
    cursor: pointer;
}

.exit button:hover {
    background-color: #125e73;
    color: #fff;
}
</style>
