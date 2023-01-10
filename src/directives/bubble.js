import Vue from "vue";
function randomColor() {
    function random() {
        return parseInt(Math.random() * 255 - 1);
    }
    return `rgb(${random()},${random()},${random()})`;
}
Vue.directive("bubble", {
    bind(el) {
        el.addEventListener("click", e => {
            const { clientX, clientY } = e;
            const dom = document.createElement("i");
            dom.className = "popup-item iconfont icon-aixin";
            dom.style.left = clientX - 12 + "px";
            dom.style.top = clientY - 24 + "px";
            dom.style.color = randomColor();
            el.appendChild(dom);
            setTimeout(() => {
                dom.classList.add("animated", "fadeOutUp");
                dom.addEventListener("animationend", function() {
                    this.remove();
                });
            }, 0);
        });
    }
});
