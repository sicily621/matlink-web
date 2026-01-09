<template>
  <el-scrollbar class="flex-1 h-full">
    <div class="flex-1">
      <vue-office-docx v-if="fileType=='docx'" :src="src"  @rendered="renderedHandler" @error="errorHandler" />
      <vue-office-excel v-else-if="fileType=='xlsx'" :src="src" @rendered="renderedHandler" @error="errorHandler" />
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
// import VueOfficeExcel from '@vue-office/excel'
// import VueOfficeDocx from '@vue-office/docx'
// import '@vue-office/excel/lib/index.css'
// import '@vue-office/docx/lib/index.css'

defineProps<{
  fileType:string,
  src:string
}>();

function renderedHandler() {
  // handle successful render
}

function errorHandler(error: any) {
  // handle error
}

</script>