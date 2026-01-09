<template>
  <div></div>
</template>
<script lang="ts" setup>
import useMenuStore from '@static/js/store/menu';
const menuStore = useMenuStore();
menuStore.setMenu(JSON.parse(JSON.stringify(menuStore.getHistoryMenu)));

</script>
<style lang="scss" scoped></style>