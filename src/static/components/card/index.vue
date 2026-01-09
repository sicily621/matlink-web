<style lang="scss" scoped>
@use "@static/css/common/size.scss" as *;
@use "@static/css/theme/update-element.scss" as *;
.card {
  --white: hsl(0, 0%, 100%);
  --black: hsl(240, 15%, 9%);
  --paragraph: hsl(0, 0%, 83%);
  --line: hsl(240, 9%, 17%);
  --primary: hsl(189, 92%, 58%);

  position: relative;

  display: flex;
  flex-direction: column;
  gap: zrem(10);

  padding: zrem(10);
  width: zrem(190);
  height: zrem(190);
  border-radius: zrem(10);
  background: #000;
}

.card .card__border {
  overflow: hidden;
  pointer-events: none;

  position: absolute;
  z-index: -10;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 102%;
  height: 102%;

  border-radius: zrem(6);
}

.card .card__border::before {
  content: "";
  pointer-events: none;

  position: fixed;
  z-index: 200;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%), rotate(0deg);
  transform-origin: left;

  width: 200%;
  height: zrem(100);
  background-image: linear-gradient(0deg, hsla(0, 0%, 100%, 0) 0%, hsl(189, 100%, 50%) 40%, hsl(189, 100%, 50%) 60%, hsla(0, 0%, 40%, 0) 100%);

  animation: rotate 8s linear infinite;
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

.card-wrap {
  z-index: 1;
  padding: zrem(5);
}
</style>

<template>
  <div class="card-wrap">
    <div class="card">
      <div class="card__border"></div>
    </div>
  </div>
</template>
