<template>
  <div id="calendar"></div>
</template>

<script setup lang="ts">
import { Calendar, EventClickArg, } from "@fullcalendar/core"
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import { onMounted, ref, PropType, watch } from 'vue';
import { EventItem } from './types';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

let props = defineProps({
  //语言
  local: {
    type: String,
    default: 'zh-cn'
  },

  // 视图模式
  initalView: {
    type: String,
    default: 'dayGridMonth'
  },
  //按钮文字
  buttonText: {
    type: Object,
    default: () => {
      return {
        today: t('calendar.today'),
        month: t('calendar.month'),
        week: t('calendar.week'),
        day: t('calendar.day'),
        prevYear: t('calendar.prevYear'),
        nextYear: t('calendar.nextYear'),
        prev: t('calendar.prev'),
        next: t('calendar.next')
      }
    }
  },
  //头部工具栏
  headerToolbar: {
    type: Object,
    default: () => {
      return {
        start: 'title',
        center: '',
        end: 'prev today next',
      }
    }
  },
  //底部工具栏
  footerToolbar: {
    type: Object,
    default: () => {}
  },
  //事假源
  events: {
    type: Array as PropType<EventItem[]>
  },
  //结束时间
  displayEventEnd: {
    type: Boolean,
    default: false
  },
   // 自定义渲染内容方法
   eventContent: {
    type: Function
  }
})

let emits = defineEmits(['dateClick','eventClick'])
//日历实例
let calendar = ref<Calendar>()

let renderCalendar = () => {
  let el = document.getElementById('calendar')
  if (el) {
    calendar.value = new Calendar(el, {
      //日历插件
      plugins: [dayGridPlugin, interactionPlugin],
      locale: props.local,
      initialView: props.initalView,
      buttonText: props.buttonText,
      headerToolbar: props.headerToolbar,
      footerToolbar: props.footerToolbar,
      eventSources: [
        {
          events(e, callback) {
            if (props.events?.length) callback(props.events)
            else callback([])
          }
        }
      ],
      //点击日历上某一天
      dateClick(info: DateClickArg) {
        emits('dateClick',info)
      },
      eventClick(info: EventClickArg) {
        emits('eventClick',info)
      },
      displayEventEnd: props.displayEventEnd,
      // 自定义渲染内容
      eventContent: props.eventContent
    })
    calendar.value.render()
  }
}
onMounted(() => {
  renderCalendar()
})
//监听父组件传递的事件
watch(() => props.events, val => {
  renderCalendar()
},{deep: true})

</script>

<style scoped>

</style>