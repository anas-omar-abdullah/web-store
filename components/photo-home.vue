<template>
  <div class="all">
    <div class="img"></div>
    <div class="text-img">في الأسواق كلاسين بكل المقاسات صنع بثار</div>
  </div>
</template>
<style lang="scss" scoped>
.all {
  height: calc((100vh - 128px) / 2);
  display: flex;
  margin-bottom: 12px;
  .img {
    background-color: var(--primary-color);
    width: 100%;
  }
  .text-img {
    width: 100%;
    color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 25px;
  }
}
@media (max-width: 770px) {
  .all {
    display: block;
    margin-left: 8%;
    margin-right: 8%;
    .img {
      height: 50%;
      width: 100%;
    }

    .text-img {
      height: 50%;
      width: 100%;
      margin: 0;
      text-align: center;
    }
  }
}
</style>
