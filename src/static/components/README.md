# static/components 目录说明

本目录为前端项目的通用自定义组件库，包含各类可复用的 Vue 组件，服务于全局及各业务模块。所有组件均遵循统一的开发、命名和国际化规范，便于团队协作和维护。

## 目录结构示例

- **amap/**  
  高德地图相关组件，支持地图展示、标记、交互等功能。
- **color/**  
  颜色选择与管理相关组件。
- **comModel/**  
  通用弹窗、模态框组件。
- **container/**  
  页面或模块级容器组件，支持布局与嵌套。
- **cropper/**  
  图片裁剪相关组件，支持头像、图片等裁剪操作。
- **dynamicGraph/**  
  动态图表组件，支持多种数据可视化场景。
- **echart/**  
  基于 ECharts 的图表组件，支持多种图表类型。
- **echarts/**  
  另一套 ECharts 相关组件，按需使用。
- **fileTable/**  
  文件列表、文件操作相关组件。
- **footer/**  
  页面底部通用组件。
- **handsontable/**  
  基于 Handsontable 的表格组件，支持复杂表格编辑。
- **header/**  
  页面头部通用组件。
- **headerChild/**  
  头部子组件，配合 header 使用。
- **iconSvg/**  
  SVG 图标组件，支持自定义图标集。
- **imgVerifyCode/**  
  图片验证码组件。
- **infoTable/**  
  信息展示表格组件。
- **inputPassword/**  
  密码输入框组件，支持可见/隐藏切换。
- **largeScreenCon/**  
  大屏展示相关容器组件。
- **map/**  
  地图相关组件，支持多种地图服务。
- **message/**  
  消息提示、通知组件。
- **moveBox/**  
  可拖拽弹窗、容器组件。
- **MultipleSelect/**  
  多选下拉、选择器组件。
- **notice/**  
  通知公告相关组件。
- **observer/**  
  观察者模式相关组件，支持事件监听与分发。
- **office/**  
  Office 文档预览、编辑相关组件。
- **pdf/**  
  PDF 文件预览组件。
- **redirect/**  
  路由重定向相关组件。
- **rTooltipOver/**  
  自定义 Tooltip 悬浮提示组件。
- **supermap/**  
  SuperMap 地图相关组件。
- **tags/**  
  标签、标签组组件。
- **themeImg/**  
  主题图片、背景相关组件。
- **thumbnail/**  
  缩略图展示组件。
- **tool/**  
  工具类组件集合。
- **topInfo/**  
  顶部信息栏组件。
- **treeTransfer/**  
  树形穿梭框组件，支持树结构数据的选择与转移。
- **verify/**  
  验证码输入、校验相关组件。
- **websocket/**  
  WebSocket 通信相关组件。
- **zElDrawer/**  
  基于 ElementUI 的抽屉组件。
- **zElMenu/**  
  基于 ElementUI 的菜单组件。
- **zModel/**  
  通用数据模型组件。

> 说明：如需了解具体组件用法，请参考各子目录下的 README.md 或组件源码。

## 开发规范

- 组件命名需简洁明了，避免歧义，目录结构与功能对应。
- 组件需具备良好复用性和可配置性，避免业务强耦合。
- 所有界面可见中文均需国际化，禁止硬编码。
- 组件应有必要的注释和文档，便于团队协作。

## 国际化支持

- 组件内所有界面可见文本均通过 i18nM 方法调用，国际化资源统一管理。
- 新增组件时，需同步补充国际化资源文件。
