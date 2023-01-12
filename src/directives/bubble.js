import Vue from "vue";
import { randomColor, randomNum } from "@/utils/";

Vue.directive("bubble", {
    bind(el, { value: type }) {
        el.addEventListener("click", e => {
            const { clientX, clientY } = e;
            const animatedDom = draw(type);
            animatedDom.classList.add("absolute");
            animatedDom.style.left = clientX - 12 + "px";
            animatedDom.style.top = clientY - 24 + "px";
            el.appendChild(animatedDom);
            setTimeout(() => {
                animatedDom.classList.add("animated", "fadeOutUp");
                animatedDom.addEventListener("animationend", function() {
                    this.remove();
                });
            }, 0);
        });
    }
});
const drawMap = {
    drawHeart: function() {
        const heart = document.createElement("i");
        heart.className = "popup-item iconfont icon-aixin";
        heart.style.color = randomColor();
        return heart;
    },
    drawImage: function(img, width, height) {
        const dog = document.createElement("img");
        dog.src = img;
        dog.width = width;
        dog.height = height;
        return dog;
    },
    drawText: function(text) {
        const textDom = document.createElement("span");
        textDom.innerHTML = text;
        return textDom;
    }
};
function draw(type) {
    if (type == "dog") {
        const imagePath = "/img/dog.jpg";
        return drawMap["drawImage"](imagePath, 20, 20);
    } else if (type == "party") {
        const arr = [
            "富强",
            "民主",
            "文明",
            "和谐",
            "自由",
            "平等",
            "公正",
            "法治",
            "爱国",
            "敬业",
            "诚信",
            "友善"
        ];
        const text = arr[randomNum(0, 11)];
        return drawMap["drawText"](text);
    } else {
        return drawMap["drawHeart"]();
    }
}
