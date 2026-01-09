<template>
  <div class="result">
    <el-popover v-model:visible="visible" placement="bottom-start" :width="400" trigger="click">
      <template #reference>
        <div @click="toggleRotation">
          {{ result }}
          <el-icon-arrowdown :class="{ 'rotate-180': visible }"></el-icon-arrowdown>
        </div>
      </template>
      <div class="container">
        <el-row>
          <el-col :span="8">
            <el-radio-group v-model="radioValue" size="small">
              <el-radio-button :label="$t('elementUI.chooseCity.city')"></el-radio-button>
              <el-radio-button :label="$t('elementUI.chooseCity.province')"></el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span="14" :offset="2">
            <el-select v-model="selectValue" filterable :placeholder="$t('elementUI.chooseCity.searchPlaceholder')" size="small" class="select" :filter-method="filterMethod" @change="changeSelect">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-col>
        </el-row>
        <template v-if="radioValue === $t('elementUI.chooseCity.city')">
          <div class="city">
            <div @click="clickChat(item)" class="item" v-for="(item, index) in Object.keys(cities)" :key="index">{{ item }}</div>
          </div>
          <el-scrollbar max-height="300px">
            <template v-for="(value, key) in cities" ::key="key">
              <el-row style="margin-bottom: 10px;" :id="key">
                <el-col :span="2">{{ key }}</el-col>
                <el-col :span="22" class="ct-name">
                  <div @click="clickItem(item)" class="ct-name-item" v-for="(item, index) in value" :key="item.id">
                    <div>{{ item.name }}</div>
                  </div>
                </el-col>
              </el-row>
            </template>
          </el-scrollbar>
        </template>
        <template v-else>
          <div class="province">
            <div  @click="clickChat(item)"  class="item" v-for="(item, index) in Object.keys(provinces)" :key="index">
              {{ item }}
            </div>
          </div>
          <el-scrollbar max-height="300px">
            <template v-for="(item, index) in Object.values(provinces)" :key="index">
              <template v-for="(item1, index1) in item" :key="index1">
                <el-row style="margin-bottom: 10px;" :id="item1.id">
                <el-col :span="4">{{ item1.name }}</el-col>
                <el-col :span="20" class="ct-name">
                  <div  @click="clickProvince(item2)" class="ct-name-item" v-for="(item2, index2) in item1.data" :key="index2">
                    <div>{{ item2 }}</div>
                  </div>
                </el-col>
              </el-row>
              </template>
            </template>
          </el-scrollbar>
        </template>
      </div>
    </el-popover>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import city from './lib/city'
import { City } from './type';
import province from './lib/province.json'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
//分发事件
let emits = defineEmits(['changeCity','changeProvince'])

let result = ref<string>(t('chooseCity.pleaseSelect'))
let visible = ref<boolean>(false)
let radioValue = ref<string>(t('chooseCity.byProvince'))
let selectValue = ref<string>('')
let cities = ref(city.cities)
let provinces = ref(province)
const options = ref<any[]>([])
let searchValue = ref<string>()
let allCity = ref<any[]>([])
onMounted(() => {
  //获取下拉框的数据
  let values = Object.values(cities.value).flat(Infinity)
  options.value = values
  allCity.value = values
})
//自定义搜索过滤
let filterMethod = (val: string) => {
  let values = Object.values(cities.value).flat(2)
  if (val === '') {
    options.value = values
  } else {
    if (radioValue.value === t('chooseCity.byCity')) {
      // 中文和拼音一起过滤
      options.value = values.filter(item => {
        return item.name.includes(val) || item.spell.includes(val)
      })
    } else {
      // 中文过滤
      options.value = values.filter(item => {
        return item.name.includes(val)
      })
    }
  }
}
//下拉框选择
const changeSelect = (val: City) => {
  let city = allCity.value.find(item => item.id === val!)
  result.value = city.name
  visible.value = false
  if (radioValue.value === t('chooseCity.byCity') ) {
    emits('changeCity',city)
  } else {
    emits('changeProvince',city.name)
  }
}
const clickItem = (item: City) => {
  result.value = item.name
  visible.value = false
  emits('changeCity', item)
}

const toggleRotation = () => {
  visible.value = !visible
}

//点击字母区域
const clickChat = (item: string) => {
  let el = document.getElementById(item)
  if (el) el.scrollIntoView()
}
const clickProvince = (item: string) => {
  result.value = item
  visible.value = false
  emits('changeProvince', item)
}
</script>

<style scoped lang="scss">
.result {
  display: flex;
  align-items: center;
  width: fit-content;
  cursor: pointer;
}

svg {
  width: 1em;
  height: 1em;
  position: relative;
  top: 2px;
  margin-left: 4px;
  transition: all .25s linear;
}

.rotate-180 {
  transform: rotate(180deg);

}

.container {
  padding: 6px;
}

.select {
  margin-top: 3px;
}

.city, .province {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 10px;
  cursor: pointer;

  .item {
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 10px;
    margin-left: 2px;
    margin-right: 2px;
    margin-bottom: 6px;
    padding: 8px;
  }
}

.ct-name {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  &-item {
    margin-right: 6px;
    margin-bottom: 6px;
    cursor: pointer;
  }
}</style>