export default {
  beforeMount(el: any, binding: any) {
    if (!binding.arg) return;
    const selectDom = document.querySelector(`.${binding.arg} .el-select-dropdown__wrap`);
    function loadMore(this: any) {
      const isBase = this.scrollHeight - this.scrollTop <= this.clientHeight
      if (isBase) {
        binding.value && binding.value()
      }
    }
    el.selectDomInfo = selectDom
    el.userloadmore = loadMore
    if (selectDom) selectDom.addEventListener('scroll', loadMore)
  },
  beforeUnmount(el: any) {
    if(el.userloadmore) {
        el.selectDomInfo.removeEventListener('scroll', el.userloadmore)
        delete el.selectDomInfo
        delete el.userloadmore
    }
  }
}