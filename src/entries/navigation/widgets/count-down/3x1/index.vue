<template>
    <div class="box-wrapper">
        <div class="countdown-container-wrapper">
            <div class="countdown-container">
                <div class="countdown-inner-wrapper">
                    <div class="countdown-inner">
                        <div class="inner">
                            <div class="inner-wrapper">
                                <p>{{ title }}</p>
                                <div class="number-box">{{ lastDays }}</div>
                                <p>天</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "Count-Down-3_1",
    props: {
        title: String,
        lastDays: Number,
    },
};
</script>
<style lang="less" scoped>
@bottom-decoration-height: 5px;
@bottom-wrapper-bg: #519ea3;
@bottom-bg: #75c1c6;

@inner-decoration-height: 5px;
@inner-wrapper-bg: #bfbebb;
@inner-bg: #fffefa;

@global-radius: 3px;

.box-wrapper {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 100%;
    width: 100%;

    .countdown-container-wrapper {
        width: 100%;
        height: 100%;
        background: @bottom-wrapper-bg;
        border-radius: @global-radius;
        box-sizing: border-box;

        .countdown-container {
            width: 100%;
            height: calc(100% - @bottom-decoration-height);
            background-color: #75c1c6;
            border-radius: @global-radius;
            box-sizing: border-box;
            padding: 8px;

            .countdown-inner-wrapper {
                height: 100%;
                width: 100%;
                background-color: @inner-wrapper-bg;
                border-radius: @global-radius;
            }

            .countdown-inner {
                position: relative;
                top: @inner-decoration-height;
                width: 100%;
                height: calc(100% - @inner-decoration-height);
                background: @inner-bg;
                border-radius: @global-radius;

                .inner {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;

                    .inner-wrapper {
                        display: flex;
                        align-items: center;

                        p {
                            color: #333;
                            font-size: 20px;
                            margin-right: 10px;
                            font-family: "Gill Sans", "Gill Sans MT", Calibri,
                                "Trebuchet MS", sans-serif;
                        }

                        .number-box {
                            padding: 0 10px;
                            height: 25px;
                            background: #1d2647;
                            color: #fff;
                            line-height: 25px;
                            text-align: center;
                            margin-right: 10px;
                        }
                    }
                }
            }
        }
    }
}
</style>
