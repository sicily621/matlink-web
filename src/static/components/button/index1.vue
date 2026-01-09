<style lang="scss" scoped>
@use "@static/css/common/size.scss" as *;
@use "@static/css/theme/update-element.scss" as *;
button {
  position: relative;
  padding: zrem(7) zrem(20);
  border-radius: zrem(4);
  border: zrem(1) solid rgb(61, 106, 255);
  font-size: zrem(14);
  text-transform: uppercase;
  //   font-weight: 600;
  //   letter-spacing: zrem(2);
  background: transparent;
  color: #fff;
  overflow: hidden;
  box-shadow: 0 0 0 0 transparent;
  -webkit-transition: all 0.2s ease-in;
  -moz-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
}

button:hover {
  background: var(--el-color-primary);
  box-shadow: 0 0 zrem(30) zrem(5) var(--el-primary-opacity-6);
  -webkit-transition: all 0.2s ease-out;
  -moz-transition: all 0.2s ease-out;
  transition: all 0.2s ease-out;
}

button:hover::before {
  -webkit-animation: sh02 0.5s 0s linear;
  -moz-animation: sh02 0.5s 0s linear;
  animation: sh02 0.5s 0s linear;
}

button::before {
  content: "";
  display: block;
  width: zrem(0);
  height: 86%;
  position: absolute;
  top: 7%;
  left: 0%;
  opacity: 0;
  background: #fff;
  box-shadow: 0 0 zrem(50) zrem(30) #fff;
  -webkit-transform: skewX(-20deg);
  -moz-transform: skewX(-20deg);
  -ms-transform: skewX(-20deg);
  -o-transform: skewX(-20deg);
  transform: skewX(-20deg);
}

@keyframes sh02 {
  from {
    opacity: 0;
    left: 0%;
  }

  50% {
    opacity: 1;
  }

  to {
    opacity: 0;
    left: 100%;
  }
}

button:active {
  box-shadow: 0 0 0 0 transparent;
  -webkit-transition: box-shadow 0.2s ease-in;
  -moz-transition: box-shadow 0.2s ease-in;
  transition: box-shadow 0.2s ease-in;
}
</style>

<template>
  <button>新增</button>
</template>
