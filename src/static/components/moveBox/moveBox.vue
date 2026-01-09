<template>
    <div class="move-box-con" :id="boxId" :style="countStyle()" :class="{
        'open-move-box': openFlag,
        'show-move-box': showFlag,
        'transition-4': transitionFlag || reduceFlag
    }">
        <template v-if="reduceFlag">
            <div class="reduce-box-img-con" @click="reduceBox()">
                <img :src="moveBoxCamera" />
            </div>
        </template>
        <template v-if="!reduceFlag">
            <div class="move-box-header d-flex align-items-center justify-content-between"
                @mousedown="dragStart($event)" @mousemove="dragMove($event)" @mouseup="dragUp()"
                @mouseleave="dragLeave()">
                <div class="m-l-10">{{ $t('moveBox.liveVideo') }}</div>
                <div class="d-flex align-items-center">
                    <div class="m-r-10 pointer" @click="reduceBox()">
                        <el-icon>
                            <Minus />
                        </el-icon>
                    </div>
                    <div class="m-r-10 pointer" @click="fullBox()">
                        <el-icon>
                            <FullScreen />
                        </el-icon>
                    </div>
                    <div class="m-r-10 pointer" @click="closeModel()">
                        <el-icon>
                            <Close />
                        </el-icon>
                    </div>
                </div>
            </div>
            <div class="move-box-content">
                <div class="move-box-content-tree" v-if="fullFlag">
                    <tree :data="treeData" :currentNodeKey="currentNode?.id" ref="treeRef"
                        @changeNode="changeNode($event)" :placeholder="$t('moveBox.inputSpaceName')" :searchFlag="true"
                        :default-expand-all-flag="true">
                    </tree>
                </div>
                <div class="move-box-content-content border-ui">
                    <div v-if="videoWindowType === 1" class="video-content-con-1">
                        <template
                            v-if="!playInfos.length || (playInfos[0].Factory != dahuaFactory && playInfos[0].Factory != haikangFactory)">
                            <div class="d-flex align-items-center justify-content-center"
                                style="width: 100%;height: 100%">
                                <img id="video-1" class="video-img-wh"
                                    :class="{ 'video-img-default-wh': !playStatus[0] }" :src="defaultVideoImg" />
                            </div>
                            <div id="video-content-word-1" class="video-content-word">{{ $t('moveBox.waitingPlay') }}
                            </div>
                        </template>
                        <template v-if="playInfos.length && playInfos[0].Factory == dahuaFactory">
                            <!-- 这里也是用版本判断，需要调取接口的大华，用div，其他的保持原有逻辑 -->
                            <div v-if="playInfos[0].Version == '1'" id="dahua-video-1" class="video-img-wh"></div>
                            <template v-else>
                                <video id="dahua-video-1" class="video-img-wh"
                                    :class="{ 'video-img-wh-0': playInfos[0].decodeMode == 'canvas' }"></video>
                                <canvas id="dahua-canvas-1" class="video-img-wh"
                                    :class="{ 'video-img-wh-0': playInfos[0].decodeMode != 'canvas' }"></canvas>
                            </template>
                        </template>
                        <template v-if="playInfos.length && playInfos[0].Factory == haikangFactory">
                            <div id="haikang-video-1" class="video-img-wh"></div>
                        </template>
                    </div>
                    <template v-if="videoWindowType === 4">
                        <div class="video-content-con-4 border-ui" v-for="index of [1, 2, 3, 4]"
                            @click="optionVideoConFunc(index - 1)"
                            :class="{ 'active-video-content-con': optionVideoConNum == index - 1 }">
                            <template
                                v-if="!playInfos.length || !playInfos[index - 1] || (playInfos[index - 1].Factory != dahuaFactory && playInfos[index - 1].Factory != haikangFactory)">
                                <div class="d-flex align-items-center justify-content-center"
                                    style="width: 100%;height: 100%">
                                    <img :id="'video-' + (index)" class="video-img-wh"
                                        :class="{ 'video-img-default-wh': !playStatus[index - 1] }"
                                        :src="defaultVideoImg"></img>
                                </div>
                                <div :id="'video-content-word-' + index" class="video-content-word">{{
                                    $t('moveBox.waitingPlay') }}</div>
                            </template>
                            <template
                                v-if="playInfos.length && playInfos[index - 1] && playInfos[index - 1].Factory == dahuaFactory">
                                <div v-if="playInfos[index - 1].Version == '1'" :id="'dahua-video-' + index"
                                    class="video-img-wh"></div>
                                <template v-else>
                                    <video :id="'dahua-video-' + index" class="video-img-wh"
                                        :class="{ 'video-img-wh-0': playInfos[index - 1].decodeMode == 'canvas' }"></video>
                                    <canvas :id="'dahua-canvas-' + index" class="video-img-wh"
                                        :class="{ 'video-img-wh-0': playInfos[index - 1].decodeMode != 'canvas' }"></canvas>
                                </template>
                            </template>
                            <template
                                v-if="playInfos.length && playInfos[index - 1] && playInfos[index - 1].Factory == haikangFactory">
                                <div :id="'haikang-video-' + index" class="video-img-wh"></div>
                            </template>
                        </div>
                    </template>
                    <template v-if="videoWindowType === 9">
                        <div class="video-content-con-9 border-ui" v-for="index of [1, 2, 3, 4, 5, 6, 7, 8, 9]"
                            @click="optionVideoConFunc(index - 1)"
                            :class="{ 'active-video-content-con': optionVideoConNum == index - 1 }">
                            <template
                                v-if="!playInfos.length || !playInfos[index - 1] || (playInfos[index - 1].Factory != dahuaFactory && playInfos[index - 1].Factory != haikangFactory)">
                                <div class="d-flex align-items-center justify-content-center"
                                    style="width: 100%;height: 100%">
                                    <img :id="'video-' + (index)" class="video-img-wh"
                                        :class="{ 'video-img-default-wh': !playStatus[index - 1] }"
                                        :src="defaultVideoImg"></img>
                                </div>
                                <div :id="'video-content-word-' + index" class="video-content-word">{{
                                    $t('moveBox.waitingPlay') }}</div>
                            </template>
                            <template
                                v-if="playInfos.length && playInfos[index - 1] && playInfos[index - 1].Factory == dahuaFactory">
                                <div v-if="playInfos[index - 1].Version == '1'" :id="'dahua-video-' + index"
                                    class="video-img-wh"></div>
                                <template v-else>
                                    <video :id="'dahua-video-' + index" class="video-img-wh"
                                        :class="{ 'video-img-wh-0': playInfos[index - 1].decodeMode == 'canvas' }"></video>
                                    <canvas :id="'dahua-canvas-' + index" class="video-img-wh"
                                        :class="{ 'video-img-wh-0': playInfos[index - 1].decodeMode != 'canvas' }"></canvas>
                                </template>
                            </template>
                            <template
                                v-if="playInfos.length && playInfos[index - 1] && playInfos[index - 1].Factory == haikangFactory">
                                <div :id="'haikang-video-' + index" class="video-img-wh"></div>
                            </template>
                        </div>
                    </template>
                </div>
                <div class="move-box-content-operator" v-if="fullFlag">
                    <div class="move-box-content-operator-title m-b-10 d-flex align-items-center">
                        <div class="move-box-content-operator-title-icon"></div>
                        <div>{{ $t('moveBox.camera') }}</div>
                    </div>
                    <div class="remote-control-con">
                        <div class="remote-control-button-1" @mousedown="rotateControlling('UP', true)"
                            @mouseup="rotateControlling('UP', false)">
                            <div class="arrow-ui arr-ui-rotate360"></div>
                        </div>
                        <div class="remote-control-button-2" @mousedown="rotateControlling('LEFT_UP', true)"
                            @mouseup="rotateControlling('LEFT_UP', false)">
                            <div class="arrow-ui arr-ui-rotate315"></div>
                        </div>
                        <div class="remote-control-button-3" @mousedown="rotateControlling('LEFT', true)"
                            @mouseup="rotateControlling('LEFT', false)">
                            <div class="arrow-ui arr-ui-rotate270"></div>
                        </div>
                        <div class="remote-control-button-4" @mousedown="rotateControlling('LEFT_DOWN', true)"
                            @mouseup="rotateControlling('LEFT_DOWN', false)">
                            <div class="arrow-ui arr-ui-rotate225"></div>
                        </div>
                        <div class="remote-control-button-5" @mousedown="rotateControlling('DOWN', true)"
                            @mouseup="rotateControlling('DOWN', false)">
                            <div class="arrow-ui arr-ui-rotate180"></div>
                        </div>
                        <div class="remote-control-button-6" @mousedown="rotateControlling('RIGHT_DOWN', true)"
                            @mouseup="rotateControlling('RIGHT_DOWN', false)">
                            <div class="arrow-ui arr-ui-rotate135"></div>
                        </div>
                        <div class="remote-control-button-7" @mousedown="rotateControlling('RIGHT', true)"
                            @mouseup="rotateControlling('RIGHT', false)">
                            <div class="arrow-ui arr-ui-rotate90"></div>
                        </div>
                        <div class="remote-control-button-8" @mousedown="rotateControlling('RIGHT_UP', true)"
                            @mouseup="rotateControlling('RIGHT_UP', false)">
                            <div class="arrow-ui arr-ui-rotate45"></div>
                        </div>
                        <div class="remote-control-button-9" @click="rotateControlling('GOTO_PRESET', true)">{{
                            $t('moveBox.reset') }}
                        </div>
                        <canvas id="remote-control" width="260" height="260"></canvas>
                    </div>
                    <div class="buttons-con d-flex align-items-center justify-content-between">
                        <el-button type="primary" class="w-80 margin-none" @click="disableZoom">{{ $t('moveBox.zoomOut')
                            }}</el-button>
                        <el-button type="primary" class="w-80 margin-none" @click="enableZoom">{{ $t('moveBox.zoomIn')
                            }}</el-button>
                        <template
                            v-if="!playInfos[getPlayInfosIndex()] || playInfos[getPlayInfosIndex()].Factory != dahuaFactory || playInfos[getPlayInfosIndex()].Version != '1'">
                            <el-button type="primary" class="w-80 margin-none"
                                @mousedown="rotateControlling('FOCUS_NEAR', true)"
                                @mouseup="rotateControlling('FOCUS_NEAR', false)">{{ $t('moveBox.focusPlus')
                                }}</el-button>
                        </template>
                        <template v-else>
                            <el-button type="primary" class="w-80 margin-none" @click="focusAdd()">{{
                                $t('moveBox.focusPlus') }}</el-button>
                        </template>
                    </div>
                    <div class="buttons-con m-b-20 d-flex align-items-center justify-content-between">
                        <template
                            v-if="!playInfos[getPlayInfosIndex()] || playInfos[getPlayInfosIndex()].Factory != dahuaFactory || playInfos[getPlayInfosIndex()].Version != '1'">
                            <el-button type="primary" class="w-80 margin-none"
                                @mousedown="rotateControlling('FOCUS_FAR', true)"
                                @mouseup="rotateControlling('FOCUS_FAR', false)">{{ $t('moveBox.focusMinus')
                                }}</el-button>
                            <el-button type="primary" class="w-80 margin-none"
                                @mousedown="rotateControlling('IRIS_ENLARGE', true)"
                                @mouseup="rotateControlling('IRIS_ENLARGE', false)">{{ $t('moveBox.irisPlus')
                                }}</el-button>
                            <el-button type="primary" class="w-80 margin-none"
                                @mousedown="rotateControlling('IRIS_REDUCE', true)"
                                @mouseup="rotateControlling('IRIS_REDUCE', false)">{{ $t('moveBox.irisMinus')
                                }}</el-button>
                        </template>
                        <template v-else>
                            <el-button type="primary" class="w-80 margin-none" @click="focusReduce()">{{
                                $t('moveBox.focusMinus') }}</el-button>
                            <el-button type="primary" class="w-80 margin-none" @click="apertureAdd()">{{
                                $t('moveBox.irisPlus') }}</el-button>
                            <el-button type="primary" class="w-80 margin-none" @click="apertureReduce()">{{
                                $t('moveBox.irisMinus') }}</el-button>
                        </template>
                    </div>
                    <!--
                    <div class="move-box-content-operator-title m-b-20 d-flex align-items-center">
                        <div class="move-box-content-operator-title-icon"></div>
                        <div>{{ $t('moveBox.presetPosition') }}</div>
                    </div>
                    <div class="d-flex align-items-center m-b-20">
                        <el-select v-model="presetPosition" :placeholder="$t('moveBox.pleaseSelect')" class="m-r-10">
                            <el-option v-for="item of presetPositionOptions" :key="item.id" :value="item.id"
                                :label="item.name"></el-option>
                        </el-select>
                        <el-button type="primary" @click="rotateControlling('GOTO_PRESET', true)">{{ $t('moveBox.set')
                            }}</el-button>
                    </div>
                    -->
                    <div class="buttons-con m-b-20 d-flex align-items-center justify-content-between">
                        <el-button type="primary" class="w-80 margin-none" @click="stop">{{ $t('moveBox.stopPlay')
                            }}</el-button>
                        <el-button type="primary" class="w-80 margin-none" @click="allStop">{{ $t('moveBox.stopAll')
                            }}</el-button>
                        <el-button type="primary" class="w-80 margin-none" @click="capturePicture">{{
                            $t('moveBox.capture')
                            }}</el-button>
                    </div>
                    <!--
                    <div class="move-box-content-operator-title m-b-20 d-flex align-items-center">
                        <div class="move-box-content-operator-title-icon"></div>
                        <div>{{ $t('moveBox.screenPush') }}</div>
                    </div>
                    <div class="d-flex align-items-center m-b-10">
                        <span class="m-r-10">{{ $t('moveBox.wallId') }}</span>
                        <el-select v-model="presetPosition1" :placeholder="$t('moveBox.pleaseSelect')"
                            class="m-r-10 flex-1">
                            <el-option v-for="item of presetPositionOptions1" :key="item.id" :value="item.id"
                                :label="item.name"></el-option>
                        </el-select>
                    </div>
                    <div class="d-flex align-items-center m-b-10">
                        <span class="m-r-10">{{ $t('moveBox.screenId') }}</span>
                        <el-select v-model="presetPosition1" :placeholder="$t('moveBox.pleaseSelect')"
                            class="m-r-10 flex-1">
                            <el-option v-for="item of presetPositionOptions1" :key="item.id" :value="item.id"
                                :label="item.name"></el-option>
                        </el-select>
                    </div>
                    <div class="d-flex align-items-center m-b-10">
                        <span class="m-r-10">{{ $t('moveBox.window') }}</span>
                        <el-select v-model="presetPosition1" :placeholder="$t('moveBox.pleaseSelect')"
                            class="m-r-10 flex-1">
                            <el-option v-for="item of presetPositionOptions1" :key="item.id" :value="item.id"
                                :label="item.name"></el-option>
                        </el-select>
                    </div>
                    <div class="d-flex align-items-center m-b-10">
                        <span class="m-r-10">{{ $t('moveBox.scene') }}</span>
                        <el-select v-model="presetPosition1" :placeholder="$t('moveBox.pleaseSelect')"
                            class="m-r-10 flex-1">
                            <el-option v-for="item of presetPositionOptions1" :key="item.id" :value="item.id"
                                :label="item.name"></el-option>
                        </el-select>
                    </div>
                    <div class="d-flex align-items-center justify-content-center">
                        <el-button class="w-200" type="primary">{{ $t('moveBox.switchScene') }}</el-button>
                    </div>
                    -->
                    <div class="move-box-content-operator-title m-b-20 d-flex align-items-center">
                        <div class="move-box-content-operator-title-icon"></div>
                        <div>{{ $t('moveBox.window') }}</div>
                    </div>
                    <div class="d-flex align-items-center">
                        <el-radio-group v-model="videoWindowType" @change="videoWindowTypeChange">
                            <el-radio-button :label="1">{{ $t('moveBox.singleGrid')
                                }}</el-radio-button>
                            <el-radio-button :label="4">{{ $t('moveBox.fourGrid')
                                }}</el-radio-button>
                            <el-radio-button :label="9">{{ $t('moveBox.nineGrid')
                                }}</el-radio-button>
                        </el-radio-group>
                        <el-button type="primary" class="m-l-10" @click="openPlayBackFunc">{{ $t('moveBox.playback')
                            }}</el-button>
                    </div>
                </div>
            </div>
        </template>
    </div>
    <div class="playback-box-con"
        :class="{ 'open-playback-con': openPlayBackFlag, 'show-playback-con': showPlayBackFlag }">
        <div class="playback-box-header">
            <div class="playback-box-header-title">{{ $t('moveBox.playback') }}</div>
            <div class="playback-box-header-close pointer" @click="closePlayBackFunc">
                <el-icon>
                    <Close />
                </el-icon>
            </div>
        </div>
        <div class="playback-box-video-operator">
            <div class="playback-box-video">
                <template v-if="playInfos.length &&
                    playInfos[videoWindowType == 1 ? 0 : optionVideoConNum] &&
                    playInfos[videoWindowType == 1 ? 0 : optionVideoConNum].Factory == dahuaFactory &&
                    playInfos[videoWindowType == 1 ? 0 : optionVideoConNum].Version == '1'
                ">
                    <div :id="'dahua-video-playback'" class="video-img-wh"></div>
                </template>

                <template
                    v-if="playInfos.length && playInfos[videoWindowType == 1 ? 0 : optionVideoConNum] && playInfos[videoWindowType == 1 ? 0 : optionVideoConNum].Factory == haikangFactory">
                    <div :id="'haikang-video-playback'" class="video-img-wh"></div>
                </template>
            </div>
            <div class="playback-box-operator">
                <div class="move-box-content-operator-title m-b-20 d-flex align-items-center">
                    <div class="move-box-content-operator-title-icon"></div>
                    <div>{{ $t('moveBox.operation') }}</div>
                </div>
                <div class="d-flex align-items-center m-b-10">
                    <span class="w-40">{{ $t('moveBox.start') }}</span>
                    <el-date-picker v-model="startDate" type="date" :placeholder="$t('moveBox.selectStartDate')" />
                </div>
                <div class="d-flex align-items-center m-b-10">
                    <span class="w-40"></span>
                    <el-time-picker v-model="startTimer" :placeholder="$t('moveBox.selectStartTime')" />
                </div>
                <div class="d-flex align-items-center m-b-10">
                    <span class="w-40">{{ $t('moveBox.end') }}</span>
                    <el-date-picker v-model="endDate" type="date" :placeholder="$t('moveBox.selectEndDate')" />
                </div>
                <div class="d-flex align-items-center m-b-10">
                    <span class="w-40"></span>
                    <el-time-picker v-model="endTimer" :placeholder="$t('moveBox.selectEndTime')" />
                </div>
                <div class="d-flex align-items-center m-b-10">
                    <span class="w-40"></span>
                    <el-button type="primary" class="w-100" @click="findPlayback">{{ $t('moveBox.search') }}</el-button>
                </div>
            </div>
        </div>
        <div class="playback-box-process"
            v-if="!playInfos[getPlayInfosIndex()] || playInfos[getPlayInfosIndex()].Factory != dahuaFactory || playInfos[getPlayInfosIndex()].Version != '1'">
            <el-slider v-model="videoProcess" @input="videoProcessInput" />
        </div>
        <div class="playback-box-table-buttons">
            <div class="playback-box-table">
                <baseTable border :columns="columns" :table-data="tableData" :hideTableEmptyImg="true"
                    @row-click="optionPlayback">
                    <template #beginTime="scope">
                        <div>{{ formatDate(scope.scope.row.beginTime || scope.scope.row.startTime) }}</div>
                    </template>
                    <template #endTime="scope">
                        <div>{{ formatDate(scope.scope.row.endTime) }}</div>
                    </template>
                    <template #fileName="scope">
                        <div>{{ scope.scope.row.recordName || '--' }}</div>
                    </template>
                </baseTable>
            </div>
            <div class="playback-box-buttons">
                <div><el-button type="primary" @click="resumePlayback">{{ $t('moveBox.play') }}</el-button></div>
                <div><el-button type="primary" @click="pausePlayback">{{ $t('moveBox.pause') }}</el-button></div>
                <div><el-button type="primary" @click="stopPlayback">{{ $t('moveBox.stop') }}</el-button></div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import tree from "@static/elementUI/tree/tree.vue";
import { getCssVar } from "@static/js/theme/var";
import moveBoxCamera from '@static/images/move-box-camera.svg';
import useStyleStore from '@static/js/store/style';
import { floorsGetSpaceTree, devicePage, deviceGetListByCondition, startPlay, stopPlay } from './moveBox';
import { nameToLabelLevel, nameToLabel } from "@static/js/page/data";
import baseTable from "@static/table/baseTable/baseTable.vue";
import { io } from 'socket.io-client';
import defaultVideoImg from '@static/images/shexiangtou.png';
import { haikangHttp } from './haikang';
import { dahuaHttp } from './dahua';
import { AnyColumn } from 'element-plus/es/components/table-v2/src/common.mjs';
import { useI18n } from 'vue-i18n';
import { RSAEncrypt } from "@static/js/common/crypto";
let clientId = Date.now();
// PlayerControl
let socket = io(``, {
    path: `/videoWss`,
    query: { client_id: clientId }  // 使用query属性来传递参数
});
const treeRef = ref();
const styleStore = useStyleStore();
const elColorPrimary = getCssVar('--el-color-primary');
const currentNode = ref<any>({ id: 0 });
const treeData = ref([]);
const presetPosition = ref();
const presetPositionOptions = ref<any[]>([]);
const presetPosition1 = ref();
const presetPositionOptions1 = ref<any[]>([]);
const videoWindowType = ref(1);
const optionVideoConNum = ref(-1);
const deviceInfo = ref<any>({});
const deviceParam = ref<any>({});
const playInfos = ref<any[]>([]);
let backPlayer: any = null;
let playbackUrl: any = null;
const haikangFactory = '1';
const dahuaFactory = '2';
const videoProcess = ref(0);
let videoProcessTimer: any = null;
let playbackStartTime: any = null;
let playbackEndTime: any = null;
let playbackDuration: any = null;
let playbackStatus: number = 0; //0未播放 1暂停 2播放
const tableData = ref([]);
const { t } = useI18n();
const columns = ref([
    { prop: "index", label: t('moveBox.index'), type: 1, width: "100%" },
    { prop: "beginTime", label: t('moveBox.beginTime'), type: 2 },
    { prop: "endTime", label: t('moveBox.endTime'), type: 2 },
    { prop: "fileName", label: t('moveBox.fileName'), type: 2 },
]);
const startDate = ref(new Date().getTime() - 60 * 60 * 1000);
const startTimer = ref(new Date().getTime() - 60 * 60 * 1000);
const endDate = ref(new Date().getTime());
const endTimer = ref(new Date().getTime());
const openPlayBackFlag = ref(false);
const showPlayBackFlag = ref(false);
const openPlayBackFunc = () => {
    openPlayBackFlag.value = true;
    setTimeout(() => {
        showPlayBackFlag.value = true;
    })
}
const formatDate = (content: any) => {
    let dateTime = content;
    if (playInfos.value[0].Factory == dahuaFactory && playInfos.value[0].Version == '1') {
        dateTime = Number(content) * 1000;
    }
    const dateStr = new Date(dateTime).toLocaleString('en-CA', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // 使用 24 小时制
    });
    return dateStr.replace(/,/g, '') // 去掉逗号
        .replace(/\//g, '-') // 将斜杠替换为横杠
        .replace(/\s/g, ' ')
}
const handlerDate = (date: string | number) => {
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth();
    const day = new Date(date).getDate();
    const hour = new Date(date).getHours();
    const minute = new Date(date).getMinutes();
    const second = new Date(date).getSeconds();
    return new Date(Date.UTC(year, month, day, hour, minute, second)).toISOString().replace('Z', '+08:00');
}
//获取当前选中的视频框下标
const getPlayInfosIndex = () => videoWindowType.value == 1 ? 0 : optionVideoConNum.value;
declare const JSPlugin: any;
const findPlayback = () => {
    const index = getPlayInfosIndex();
    if (playInfos.value[index].Factory == dahuaFactory) {
        if (playInfos.value[index].Version != '1') return;
        dahuaHttpGetToken((token: string) => {
            const year = new Date(startDate.value).getFullYear();
            const month = new Date(startDate.value).getMonth() + 1;
            const day = new Date(startDate.value).getDate();
            const hour = new Date(startTimer.value).getHours();
            const minute = new Date(startTimer.value).getMinutes();
            const second = new Date(startTimer.value).getSeconds();
            const year1 = new Date(endDate.value).getFullYear();
            const month1 = new Date(endDate.value).getMonth() + 1;
            const day1 = new Date(endDate.value).getDate();
            const hour1 = new Date(endTimer.value).getHours();
            const minute1 = new Date(endTimer.value).getMinutes();
            const second1 = new Date(endTimer.value).getSeconds();
            const startTime = new Date(`${year}-${month}-${day} ${hour}:${minute}:${second}`).getTime();
            const endTime = new Date(`${year1}-${month1}-${day1} ${hour1}:${minute1}:${second1}`).getTime();
            dahuaHttp({
                url: `/evo-apigw/admin/API/SS/Record/QueryRecords`,
                method: `POST`,
                params: {
                    data: {
                        "channelId": playInfos.value[index].Channel,
                        "recordSource": "2",
                        "startTime": String(Math.floor(startTime / 1000)),
                        "endTime": String(Math.floor(endTime / 1000)),
                        "streamType": "1",
                        "recordType": "1"
                    }
                },
                token,
                cb: (res: any) => {
                    if (!Array.isArray(res.data.records) || !res.data.records.length) return;
                    tableData.value = res.data.records;
                    try {
                        backPlayer = new WSPlayer.WSPlayer({
                            el: 'dahua-video-playback',
                            type: 'record', /** real - 实时预览  record - 录像回放 **/
                            prefixUrl: '../', // 解码库资源前缀
                            playerAdapter: 'stretching', // 默认实际比例, selfAdaption 实际比例 | stretching 画面铺满
                            config: {
                                maxNum: 25,  /** 一个播放器上限能播放的路数，可根据实际情况设置，支持 1 4 9 16 25 **/
                                num: 1,   /** 初始化，页面显示的路数 **/
                                showControl: false, /** 是否显示工具栏，默认显示 **/
                                showTopOperate: false,
                                showIcons: {
                                    streamChangeSelect: false, // 主辅码流切换
                                    replayIcon: false, // 刷新重播按钮
                                    ivsIcon: false, // 控制智能帧按钮
                                    talkIcon: false, // 对讲功能按钮
                                    localRecordIcon: false, // 本地录像功能按钮
                                    audioIcon: false, // 开启关闭声音按钮
                                    snapshotIcon: false, // 抓图按钮
                                    closeIcon: false, // 关闭视频按钮
                                },
                                recordProgressStyle: {
                                    fontSize: 12,
                                    centerFontSize: 14,
                                    rulerLength: {
                                        short: 6,
                                        middle: 12,
                                        long: 18
                                    },
                                    fontOffsetX: 55,
                                    centerFontOffsetX: 90,
                                    recordsColor: "#318efd"
                                }, // 录像进度条样式
                                showRecordProgressBar: true, //是否显示底部进度条
                                draggable: true, //是否支持拖拽
                                isWebView: true,  //是否webView引擎
                            },
                            isRTPStream: false, /** true-标准码流拉流 false-私有码流拉流 **/
                            receiveMessageFromWSPlayer: (methods: any, data: any, err: any) => { /* 回调函数，可以在以下回调函数里面做监听 */
                                switch (methods) {
                                    case 'initializationCompleted':
                                        // 初始化完成，可以调用拉流方法，实现播放器加载后立即显示画面
                                        break;
                                    case "recordSuccess": // 录像回放成功
                                        console.log("录像回放成功")
                                        break;
                                    case "recordError": // 录像回放失败
                                        console.log("录像回放失败", err)
                                        break;
                                    case "recordFinish": // 录像回放完成
                                        console.log("录像回放完成");
                                        break;
                                    case "dblclickWindow":
                                        console.log("双击回调", data)
                                        break;
                                    // 拖拽时间戳的回调
                                    case 'switchStartTime':
                                        // data.timeStamp 时间戳
                                        // data.channelData 通道信息
                                        // {timeStamp, channelData: player.options.channelData, hasVideoRecord: true}
                                        // palyerManager.recordByUrl(recordPlayer.recordByUrl({
                                        //     wsURL: '', // ws地址
                                        //     rtspURL: '', // 重新请求后的rtsp
                                        //     channelId , // 必传, 通道id
                                        //     records: records, // 录像列表
                                        //     selectIndex: 0, // 必传
                                        //     playRecordByTime: false // 必传false
                                        // }))
                                        break;
                                    case 'selectWindowChanged': // 选中的窗口发生改变
                                        console.log(data, "返回窗口信息")
                                        break;
                                    case 'windowNumChanged': // 播放器显示的路数发生改变
                                        console.log(data, "返回显示的窗口数量")
                                        break;
                                    case 'closeVideo': // 视频关闭回调
                                        // 点击关闭按钮引发的视频关闭进行提示
                                        // 切换视频引发的视频关闭不进行提示
                                        if (!data.changeVideoFlag) {
                                            console.log(`窗口${data.selectIndex}的视频已关闭`)
                                        }
                                        break;
                                    case 'statusChanged': // 视频状态发生改变

                                        break;
                                    case 'errorInfo': // 错误信息汇总
                                        console.log(data, "可打印查看错误消息");
                                }
                            }
                        })
                    } catch (error) {
                        console.error('录像插件初始化错误：', error);
                    }
                }
            })
        })
    } else {
        if (videoWindowType.value == 1) {
            if (playInfos.value[0].Factory != haikangFactory) return;
        } else {
            if (!playInfos.value.length || playInfos.value[optionVideoConNum.value].Factory != haikangFactory) return;
        }

        const year = new Date(startDate.value).getFullYear();
        const month = new Date(startDate.value).getMonth();
        const day = new Date(startDate.value).getDate();
        const hour = new Date(startTimer.value).getHours();
        const minute = new Date(startTimer.value).getMinutes();
        const second = new Date(startTimer.value).getSeconds();
        const sDate = new Date(Date.UTC(year, month, day, hour, minute, second)).toISOString().replace('Z', '+08:00');
        const year1 = new Date(endDate.value).getFullYear();
        const month1 = new Date(endDate.value).getMonth();
        const day1 = new Date(endDate.value).getDate();
        const hour1 = new Date(endTimer.value).getHours();
        const minute1 = new Date(endTimer.value).getMinutes();
        const second1 = new Date(endTimer.value).getSeconds();
        const eDate = new Date(Date.UTC(year1, month1, day1, hour1, minute1, second1)).toISOString().replace('Z', '+08:00');
        haikangHttp({
            url: `/haikang/video/v2/cameras/playbackURLs`,
            params: {
                "cameraIndexCode": playInfos.value[videoWindowType.value == 1 ? 0 : optionVideoConNum.value].Channel,
                "streamType": 0,
                "protocol": "ws",
                "transmode": 1,
                "expand": "transcode=0",
                "streamform": "rtp",
                "beginTime": sDate,
                "endTime": eDate,
            },
            appKey: playInfos.value[videoWindowType.value == 1 ? 0 : optionVideoConNum.value].Username,
            appSecret: playInfos.value[videoWindowType.value == 1 ? 0 : optionVideoConNum.value].Password,
            method: 'POST',
            cb: (res: any) => {
                if (!Array.isArray(res.data.list) || !res.data.list.length) return;
                playbackUrl = res.data.url;
                tableData.value = res.data.list;
                playbackStartTime = new Date(res.data.list[0].beginTime).getTime();
                playbackEndTime = new Date(res.data.list[0].endTime).getTime();
                backPlayer = new JSPlugin({
                    szId: `haikang-video-playback`, //父窗口id，需要英文字母开头 必填
                    szBasePath: '/', // 必填,与h5player.min.js的引用目录一致
                    mseWorkerEnable: false,//是否开启多线程解码，分辨率大于1080P建议开启，否则可能卡顿
                    bSupporDoubleClickFull: true,//是否支持双击全屏，true-双击是全屏；false-双击无响应
                    // 当容器div#play_window有固定宽高时，可不传iWidth和iHeight，窗口大小将自适应容器宽高
                    // iWidth: 600,
                    // iHeight: 400,

                    // 分屏播放，默认最大分屏4*4
                    // iMaxSplit: 4,
                    // iCurrentSplit: 1,
                })
            },
            err: () => { }
        })
    }
}
const rotateControlling = (command: string, action: boolean) => {
    const index = getPlayInfosIndex();
    if (playInfos.value[index].Factory == dahuaFactory && playInfos.value[index].Version == '1') {
        const optzObj: any = {
            'UP': 1,
            'DOWN': 2,
            'LEFT': 3,
            'RIGHT': 4,
            'LEFT_UP': 5,
            'LEFT_DOWN': 6,
            'RIGHT_UP': 7,
            'RIGHT_DOWN': 8
        };
        dahuaHttpGetToken((token: string) => {
            dahuaHttp({
                url: `/evo-apigw/admin/API/DMS/Ptz/OperateDirect`,
                method: `POST`,
                params: {
                    data: {
                        channelId: playInfos.value[index].Channel,
                        direct: optzObj[command], //方向控制
                        stepX: '2', //速度
                        stepY: '2',
                        command: action ? '1' : '0', // 0停止 1开始
                        extend: '',//扩展数据，无，空字符串即可
                    }
                },
                token,
                cb: (res: any) => {
                    console.log('查看控制回调信息：', res.data);
                }
            })
        })
    } else {
        if (command == 'GOTO_PRESET') {
            if (Array.isArray(presetPositionOptions.value) && presetPositionOptions.value.length && !presetPosition.value) {
                presetPosition.value = presetPositionOptions.value[0];
            }
            if (!presetPosition.value) return;
        }
        haikangHttp({
            url: `/haikang/video/v1/ptzs/controlling`,
            params: {
                "cameraIndexCode": playInfos.value[videoWindowType.value == 1 ? 0 : optionVideoConNum.value].Channel,
                "action": action ? 0 : 1,
                "command": command,
                "speed": 20,
                "presetIndex": presetPosition.value || null
            },
            appKey: playInfos.value[videoWindowType.value == 1 ? 0 : optionVideoConNum.value].Username,
            appSecret: playInfos.value[videoWindowType.value == 1 ? 0 : optionVideoConNum.value].Password,
            method: 'POST',
            cb: (res: any) => { },
            err: () => { }
        })
    }
}
const optionPlayback = (e: any) => {
    const index = videoWindowType.value == 1 ? 0 : optionVideoConNum.value;
    if (playInfos.value[index].Factory == dahuaFactory && playInfos.value[index].Version == '1') {
        dahuaHttp({
            url: `/evo-apigw/evo-oauth/1.0.0/oauth/public-key`,
            method: `GET`,
            cb: (res: any) => {
                dahuaHttp({
                    url: `/evo-apigw/evo-oauth/1.0.0/oauth/extend/token`,
                    method: `POST`,
                    params: {
                        grant_type: 'password',
                        username: playInfos.value[index].Username,
                        password: RSAEncrypt(playInfos.value[index].Password, res.data.publicKey),
                        client_id: playInfos.value[index].ClientId,
                        client_secret: playInfos.value[index].ClientSecret,
                        public_key: res.data.publicKey
                    },
                    cb: (res: any) => {
                        dahuaHttp({
                            url: `/evo-apigw/admin/API/SS/Playback/StartPlaybackByTime`,
                            method: `POST`,
                            params: {
                                data: {
                                    channelId: playInfos.value[index].Channel,
                                    recordSource: '2',
                                    startTime: e.startTime,
                                    endTime: e.endTime,
                                    streamType: '1',
                                    recordType: '1'
                                }
                            },
                            token: `${res.data.token_type} ${res.data.access_token}`,
                            cb: (res: any) => {
                                const wsUrlPrefix = location.protocol == 'https:' ? 'wss' : 'ws';
                                const protContent = location.protocol == 'https:' ? '9322' : '9320';
                                playbackStartTime = e.startTime;
                                playbackEndTime = e.endTime;
                                try {
                                    backPlayer.recordByUrl({
                                        wsURL: `${wsUrlPrefix}://${res.data.innerIp}:${protContent}`,
                                        rtspURL: res.data.url + `?token=${res.data.token}`,
                                        channelId: playInfos.value[index].Channel,
                                        streamType: `1`, // 必传, 码流类型，
                                        playerAdapter: 'stretching', // 选传, selfAdaption 自适应 | stretching 拉伸
                                        records: tableData.value, //录像列表
                                        channelData: {  // 建议传, 通道树信息
                                            // id: channelCode, // {String} 通道编码
                                            // deviceCode: deviceCode, // {String} 设备编码
                                            // deviceType: deviceType, // {String} 设备类型
                                            // channelSeq: channelSeq, // {String|Number} 通道序号
                                        }, // 选传
                                    })
                                } catch (error) {
                                    console.error('录像播放错误：', error);
                                }
                            }
                        })
                    }
                })
            }
        })
    } else {
        backPlayer.JS_Play(playbackUrl, {
            playURL: playbackUrl, // 流媒体播放时必传
            mode: 0, // 解码类型：0=普通模式; 1=高级模式 默认为0
            PlayBackMode: 1,//1：绝对时间正放; 3 绝对时间倒放 默认为1
            keepDecoder: 0 // 0:回收解码资源; 1:不回收解码资源。为1时相同的编码格式，通过直接调用js_play接口切换点位不黑屏。默认0
        }, 0, e.beginTime, e.endTime).then(() => {
            videoProcess.value = 0;
            playbackStatus = 2;
            playbackStartTime = new Date(e.beginTime).getTime();
            playbackEndTime = new Date(e.endTime).getTime();
            playbackDuration = playbackEndTime - playbackStartTime;
            videoProcessTimer = setTimeout(() => {
                videoProcess.value++;
                if (videoProcess.value >= 100) {
                    clearTimeout(videoProcessTimer);
                }
            }, playbackDuration / 100);
        }, (err: any) => {
            console.info('playback failed:', err);
        })
    }
}
let videoProcessInputTimer: any = null;
const videoProcessInput = () => {
    const index = videoWindowType.value == 1 ? 0 : optionVideoConNum.value;
    if (playInfos.value[index].Factory == haikangFactory) {
        clearTimeout(videoProcessTimer);
        clearTimeout(videoProcessInputTimer);
        const seekStartTime = playbackStartTime + Math.floor(playbackDuration * videoProcess.value / 100);
        videoProcessInputTimer = setTimeout(() => {
            backPlayer.JS_Seek(0, handlerDate(seekStartTime), handlerDate(playbackEndTime)).then(
                () => {
                    videoProcessTimer = setTimeout(() => {
                        videoProcess.value++;
                        if (videoProcess.value >= 100) {
                            clearTimeout(videoProcessTimer);
                        }
                    }, playbackDuration / 100);
                    // do you want...
                },
                (err: any) => {
                    console.info('JS_Seek failed:', err);
                    // do you want...
                }
            );
        }, 400);
    }
}
const dahuaHttpGetToken = (cbFunc: Function) => {
    const index = getPlayInfosIndex();
    dahuaHttp({
        url: `/evo-apigw/evo-oauth/1.0.0/oauth/public-key`,
        method: `GET`,
        cb: (res: any) => {
            dahuaHttp({
                url: `/evo-apigw/evo-oauth/1.0.0/oauth/extend/token`,
                method: `POST`,
                params: {
                    grant_type: 'password',
                    username: playInfos.value[index].Username,
                    password: RSAEncrypt(playInfos.value[index].Password, res.data.publicKey),
                    client_id: playInfos.value[index].ClientId,
                    client_secret: playInfos.value[index].ClientSecret,
                    public_key: res.data.publicKey
                },
                cb: (res: any) => {
                    cbFunc(`${res.data.token_type} ${res.data.access_token}`);
                }
            })
        }
    })
}
const resumePlayback = () => {
    if (!backPlayer) return;
    const index = getPlayInfosIndex();
    if (playInfos.value[index].Factory == dahuaFactory && playInfos.value[index].Version == '1') {
        if (playbackStatus == 1) { //暂停重播
            backPlayer.play();
            playbackStatus = 2;
        } else if (playbackStatus == 0) { //停止重播
            dahuaHttpGetToken((token: string) => {
                dahuaHttp({
                    url: `/evo-apigw/admin/API/SS/Playback/StartPlaybackByTime`,
                    method: `POST`,
                    params: {
                        data: {
                            channelId: playInfos.value[index].Channel,
                            recordSource: '2',
                            startTime: playbackStartTime,
                            endTime: playbackEndTime,
                            streamType: '1',
                            recordType: '1'
                        }
                    },
                    token,
                    cb: (res: any) => {
                        try {
                            const wsUrlPrefix = location.protocol == 'https:' ? 'wss' : 'ws';
                            const protContent = location.protocol == 'https:' ? '9322' : '9320';
                            backPlayer.recordByUrl({
                                wsURL: `${wsUrlPrefix}://${res.data.innerIp}:${protContent}`,
                                rtspURL: res.data.url + `?token=${res.data.token}`,
                                channelId: playInfos.value[index].Channel,
                                streamType: `1`, // 必传, 码流类型，
                                playerAdapter: 'stretching', // 选传, selfAdaption 自适应 | stretching 拉伸
                                channelData: {  // 建议传, 通道树信息
                                    // id: channelCode, // {String} 通道编码
                                    // deviceCode: deviceCode, // {String} 设备编码
                                    // deviceType: deviceType, // {String} 设备类型
                                    // channelSeq: channelSeq, // {String|Number} 通道序号
                                }, // 选传
                            })
                            playbackStatus = 2;
                        } catch (error) {
                            console.error('录像播放错误：', error);
                        }
                    }
                })
            })
        }
    } else {
        if (playbackStatus == 1) {
            backPlayer.JS_Resume(0).then(
                () => {
                    console.info('JS_Resume success');
                    // do you want...
                },
                (err: any) => {
                    console.info('JS_Resume failed: ', err);
                    // do you want...
                }
            );
        } else {
            backPlayer.JS_Play(playbackUrl, {
                playURL: playbackUrl, // 流媒体播放时必传
                mode: 0, // 解码类型：0=普通模式; 1=高级模式 默认为0
                PlayBackMode: 1,//1：绝对时间正放; 3 绝对时间倒放 默认为1
                keepDecoder: 0 // 0:回收解码资源; 1:不回收解码资源。为1时相同的编码格式，通过直接调用js_play接口切换点位不黑屏。默认0
            }, 0, handlerDate(playbackStartTime), handlerDate(playbackEndTime)).then(() => {
                playbackStatus = 2;
                videoProcessTimer = setTimeout(() => {
                    videoProcess.value++;
                    if (videoProcess.value >= 100) {
                        clearTimeout(videoProcessTimer);
                    }
                }, playbackDuration / 100);
            }, (err: any) => {
                console.info('playback failed:', err);
            })
        }
    }
}
const pausePlayback = () => {
    if (!backPlayer) return;
    if (playbackStatus != 2) return; //未播放，无需暂停
    const index = getPlayInfosIndex();
    if (playInfos.value[index].Factory == dahuaFactory && playInfos.value[index].Version == '1') {
        backPlayer.pause(index);
        playbackStatus = 1;
    } else {
        backPlayer.JS_Pause(0).then(
            () => {
                console.info('JS_Pause success');
                playbackStatus = 1;
                // do you want...
            },
            (err: any) => {
                console.info('JS_Pause failed:', err);
                // do you want...
            }
        );
    }
}
const stopPlayback = () => {
    if (!backPlayer) return;
    if (playbackStatus == 0) return; //已停止，无需再次停止
    const index = getPlayInfosIndex();
    if (playInfos.value[index].Factory == dahuaFactory && playInfos.value[index].Version == '1') {
        backPlayer.close(index, 'api');
        playbackStatus = 0;
    } else {
        backPlayer.JS_Stop(0).then(
            () => {
                console.info('JS_Stop success');
                // do you want...
                videoProcess.value = 0;
                playbackStatus = 0;
            },
            (err: AnyColumn) => {
                console.info('JS_Stop failed:', err);
                // do you want...
            }
        );
    }
}
const closePlayBackFunc = () => {
    showPlayBackFlag.value = false;
    setTimeout(() => {
        openPlayBackFlag.value = false;
    }, 400);
    stopPlayback();
}
const playStatus = ref<boolean[]>([]);
//是否可以拖拽
let dragFlag = false;
//是否停止缩放
let stopFlag = false;
//盒子距离浏览器左边的距离
let boxOffsetLeft: number = 0;
//盒子距离游览器上边的距离
let boxOffsetTop: number = 0;
//拖拽时 鼠标点下的位置x轴 可以理解为距离左边的位置
let eClientX = 0;
//拖拽时 鼠标点下的位置y轴 可以理解为距离上边的位置
let eClientY = 0;
//弹框id
const boxId = `zc-move-box-240706`;
//是否全屏
const fullFlag = ref(false);
//是否最小化
const reduceFlag = ref(false);
//定位左偏移
const leftNum = ref('200px');
//定位上偏移
const topNum = ref('200px');
//全屏或者最小化时记录原缩放左偏移量
const oldLeft = ref('');
//全屏或者最小化时记录原缩放上偏移量
const oldTop = ref('');
//全屏或者最小化时记录原缩放宽度
const oldWidth = ref('');
//全屏或者最小化时记录原缩放高度
const oldHeight = ref('');
//宽度
const width = ref('800px');
//高度
const height = ref('600px');
//暂时没用
const whProportion = ref(4 / 3);
//是否打开弹框
const openFlag = ref(false);
//是否显示弹框
const showFlag = ref(false);
//是否有过度动画
const transitionFlag = ref(false);
//dahua摄像头播放器对象
let player: any = null;
//dahua摄像头播放器对象列表
const players: any = [];
// const generateUniqueId() {
//     // 使用当前时间戳和四位随机数组合成一个简单的唯一ID
//     return 'c_' + Date.now();
// }
/**
 * 开始拖拽
 * 先判断是否全屏或者最小化了
 * 记录当前鼠标距离盒子边距的距离
 * 记录盒子距离浏览的距离
 */
const dragStart = (e: any) => {
    if (fullFlag.value || reduceFlag.value) return;
    dragFlag = true;
    const box: any = document.getElementById(boxId);
    boxOffsetLeft = box.offsetLeft;
    boxOffsetTop = box.offsetTop;
    eClientX = e.clientX;
    eClientY = e.clientY;
}
/**
 * 拖拽中
 * 左偏移量 盒子左距离浏览器的位置 加上 鼠标移动的正数或者负数
 * 上偏移量 同理 
 */
const dragMove = (e: any) => {
    if (!dragFlag) return;
    if (fullFlag.value || reduceFlag.value) return;
    leftNum.value = boxOffsetLeft + (e.clientX - eClientX) + "px";
    topNum.value = boxOffsetTop + (e.clientY - eClientY) + "px";
}
/**
 * 拖拽结束 （鼠标松开）
 */
const dragUp = () => {
    dragFlag = false;
}
/**
 * 拖拽结束（鼠标移出了盒子）
 */
const dragLeave = () => {
    dragFlag = false;
}
/**
 * 全屏
 * 全屏是 必不是最小化
 * 根据flag 切换是否全屏
 * 全屏时 记录历史拖拽位置和缩放大小
 * 取消全屏时 回到历史拖拽位置和缩放大小
 */
const fullBox = () => {
    fullFlag.value = fullFlag.value ? false : true;
    if (fullFlag.value) {
        getContentInfo();
        setTimeout(() => {
            const remoteControlConDom: any = document.getElementById("remote-control");
            const ctx = remoteControlConDom.getContext("2d");
            ctx.lineWidth = 40;
            const arcList = [
                { start: 1.85, end: 0.15 },
                { start: 0.17, end: 0.33 },
                { start: 0.35, end: 0.65 },
                { start: 0.67, end: 0.83 },
                { start: 0.85, end: 1.15 },
                { start: 1.17, end: 1.33 },
                { start: 1.35, end: 1.65 },
                { start: 1.67, end: 1.83 }
            ];
            for (let item of arcList) {
                ctx.beginPath();
                ctx.arc(130, 130, 100, item.start * Math.PI, item.end * Math.PI);
                ctx.strokeStyle = elColorPrimary;
                ctx.stroke();
            }
        })
    }
    if (fullFlag.value && !reduceFlag.value) {
        oldLeft.value = leftNum.value;
        oldTop.value = topNum.value;
        oldWidth.value = width.value;
        oldHeight.value = height.value;
    } else if (!fullFlag.value) {
        leftNum.value = oldLeft.value;
        topNum.value = oldTop.value;
        width.value = oldWidth.value;
        height.value = oldHeight.value;
    }
    reduceFlag.value = false;
    for (let i = 0; i < playInfos.value.length; i++) {
        if (playInfos.value[i].Factory == haikangFactory) {
            setTimeout(() => {
                players[i].JS_Resize();
            }, 400);
        }
    }
}

const getContentInfo = () => {
    floorsGetSpaceTree({
        projectId: (window as any).$HyGlobal.getCurrentProject().projects[0].projectId
    }, (res: any) => {
        nameToLabelLevel(res.data.children, 'name');
        treeData.value = res.data.children;
        if (deviceInfo.value.id && !currentNode.value.id) {
            deviceGetListByCondition({
                parkId: deviceInfo.value.parkId,
                buildingId: deviceInfo.value.buildingId,
                floorId: deviceInfo.value.floorId,
                bigClassId: '130194926711808'
            }, (res: any) => {
                const node = treeRef.value.getNode(deviceInfo.value.floorId);
                node.data.children = nameToLabel(res.data);
                setTimeout(() => {
                    currentNode.value = JSON.parse(JSON.stringify(deviceInfo.value));
                })
            })
        }
    })
}

const changeNode = (e: any) => {
    currentNode.value = e;
    if (e.srcDate && e.srcDate.parkId && e.srcDate.buildingId) {
        deviceGetListByCondition({
            parkId: e.srcDate.parkId,
            buildingId: e.srcDate.buildingId,
            floorId: e.id,
            bigClassId: '130194926711808'
        }, (res: any) => {
            e.children = nameToLabel(res.data);
        })
    } else {
        devicePage({
            ids: [e.id]
        }, (res: any) => {
            if (res.data && Array.isArray(res.data.content) && res.data.content.length) {
                deviceInfo.value = res.data.content[0];
                const params = JSON.parse(deviceInfo.value.param);
                if (Array.isArray(params) && params.length) {
                    const paramItem: any = {};
                    for (let item of params) {
                        deviceParam.value[item.key] = item.value;
                        paramItem[item.key] = item.value;
                    }
                    let i = 0;
                    if (videoWindowType.value == 1) {
                        i = 0;
                    } else if (optionVideoConNum.value != -1) {
                        i = optionVideoConNum.value;
                    } else {
                        for (let index = 0; index < playStatus.value.length; index++) {
                            if (!playStatus.value[index]) i = index;
                        }
                    }
                    playInfos.value[i] = paramItem;
                    if (playStatus.value[i]) {
                        if (playInfos.value[i] && playInfos.value[i].Factory == dahuaFactory) {
                            dahuaStopPlayFunc(i + 1);
                            dahuaStartPlayFunc(i + 1);
                        } else if (playInfos.value[i] && playInfos.value[i].Factory == haikangFactory) {
                            haikangStopPlayFunc(i + 1);
                            haikangStartPlayFunc(i + 1);
                        } else {
                            stopPlay({
                                selectedId: i + 1,
                                clientId: clientId
                            }, () => {
                                playStatus.value[i] = false;
                                const img: any = document.getElementById('video-' + (i + 1));
                                if (img) img.src = defaultVideoImg;
                                const box: any = document.getElementById('video-content-word-' + (i + 1));
                                if (box) box.innerText = '等待播放中...';
                                socket.on(`v_${clientId}_${i + 1}`, function (frame: any) {
                                    if (frame && frame.image) {
                                        const img: any = document.getElementById('video-' + (i + 1));
                                        if (img) img.src = frame.image;
                                    } else {
                                        console.error("收到无效的视频帧");
                                    }
                                });

                                socket.on(`m_${clientId}_${i + 1}`, function (msg: any) {
                                    if (msg && msg.msg) {
                                        const box: any = document.getElementById('video-content-word-' + (i + 1));
                                        box.innerText = msg.msg;
                                    } else {
                                        console.error("收到无效的消息帧");
                                    }
                                });
                                startPlay({
                                    factory: deviceParam.value.Factory,
                                    username: deviceParam.value.Username,
                                    password: deviceParam.value.Password,
                                    ip: deviceParam.value.IP,
                                    port: deviceParam.value.PORT,
                                    channel: deviceParam.value.Channel,
                                    selectedId: i + 1,
                                    clientId: clientId,
                                    type: deviceParam.value.Type || 1
                                }, () => {
                                    playStatus.value[i] = true;
                                })
                            })
                        }
                    } else {
                        if (playInfos.value[i] && playInfos.value[i].Factory == dahuaFactory) {
                            dahuaStopPlayFunc(i + 1);
                            dahuaStartPlayFunc(i + 1);
                        } else if (playInfos.value[i] && playInfos.value[i].Factory == haikangFactory) {
                            haikangStopPlayFunc(i + 1);
                            haikangStartPlayFunc(i + 1);
                        } else {
                            socket.on(`v_${clientId}_${i + 1}`, function (frame: any) {
                                if (frame && frame.image) {
                                    const img: any = document.getElementById('video-' + (i + 1));
                                    if (img) img.src = frame.image;
                                } else {
                                    console.error("收到无效的视频帧");
                                }
                            });

                            socket.on(`m_${clientId}_${i + 1}`, function (msg: any) {
                                if (msg && msg.msg) {
                                    const box: any = document.getElementById('video-content-word-' + (i + 1));
                                    if (box) box.innerText = msg.msg;
                                } else {
                                    console.error("收到无效的消息帧");
                                }
                            });
                            startPlay({
                                factory: deviceParam.value.Factory,
                                username: deviceParam.value.Username,
                                password: deviceParam.value.Password,
                                ip: deviceParam.value.IP,
                                port: deviceParam.value.PORT,
                                channel: deviceParam.value.Channel,
                                selectedId: i + 1,
                                clientId: clientId,
                                type: deviceParam.value.Type || 1
                            }, () => {
                                playStatus.value[i] = true;
                            })
                        }
                    }
                }
            }
        })
    }
}

/**
 * 最小化
 * 和全屏同理
 */
const reduceBox = () => {
    reduceFlag.value = reduceFlag.value ? false : true;
    if (reduceFlag.value && !fullFlag.value) {
        oldLeft.value = leftNum.value;
        oldTop.value = topNum.value;
        oldWidth.value = width.value;
        oldHeight.value = height.value;
    } else if (!reduceFlag.value) {
        leftNum.value = oldLeft.value;
        topNum.value = oldTop.value;
        width.value = oldWidth.value;
        height.value = oldHeight.value;
    }
    fullFlag.value = false;
}
/**
 * 计算样式
 * 根据是否全屏 是否最小化 返回不同样式
 */
const countStyle = (): any => {
    let obj = {};
    if (fullFlag.value) {
        return {
            width: '100%',
            height: '100%',
            left: 0,
            top: 0
        };
    }
    if (reduceFlag.value) {
        return {
            width: '30px',
            height: '30px',
            left: styleStore.getMenuWidth + 20 + 'px',
            bottom: '3px'
        };
    }
    if (!fullFlag.value && !reduceFlag.value) {
        return {
            left: leftNum.value,
            top: topNum.value,
            width: '800px',
            height: '600px',
            resize: 'both',
        }
    }
    return {
        left: leftNum.value,
        top: topNum.value,
        width: width.value,
        height: height.value,
        resize: 'both',
    }
}
// .JS_Resize()
/**
 * 监听盒子样式
 * 定义一个定时器 用于节流
 * 因为缩放停止时 要根据4 /3 比例再次改变一次大小 所以定义stopFlag 用于缩放停止时 不会因为鼠标还在原位置 导致缩放大小又回来了 
 * 如果宽高没有改变 不做计算 不然会递归重复计算
 * 根据比例比较一下 宽度和高度 哪一个相对更长 选择更长的 作为基准 根据比例 定义大小
 */
const handleWh = () => {
    const box: any = document.getElementById(boxId);
    let resizeTimer: any = null;
    const handleResize = (entries?: any) => {
        if (stopFlag) return stopFlag = false;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const box: any = document.getElementById(boxId);
            if ((box.clientWidth + 'px') === width.value && (box.clientHeight + 'px') === height.value) {
                return;
            }
            const widthNum = box.clientWidth / 4;
            const heightNum = box.clientHeight / 3;
            if (widthNum > heightNum) {
                width.value = box.clientWidth + `px`;
                height.value = box.clientWidth * 3 / 4 + `px`;
            } else {
                width.value = box.clientHeight * 4 / 3 + `px`;
                height.value = box.clientHeight + `px`;
            }
            stopFlag = true;
        }, 400);
    };
    const observer = new ResizeObserver(handleResize);
    observer.observe(box);
}
/**
 * 打开弹框
 * 先打开弹框 （让dom渲染一会）
 * 再显示弹框
 * 中间加一个过度 为什么打开之后要关掉这个过度呢 因为打开之后 还要移动和缩放 所以不能有过度
 */
const openModel = (deviceId: number | number[]) => {
    let ids: number[];
    if (deviceId instanceof Array) {
        ids = deviceId;
    } else {
        ids = [deviceId]
    }
    devicePage({
        ids: ids
    }, (res: any) => {
        if (res.data && Array.isArray(res.data.content) && res.data.content.length) {
            if (res.data.content.length <= 9 && res.data.content.length > 4) {
                videoWindowType.value = 9;
            } else if (res.data.content.length <= 4 && res.data.content.length > 1) {
                videoWindowType.value = 4;
            } else {
                videoWindowType.value = 1;
            }
            playInfos.value = [];
            for (let i = 0; i < res.data.content.length; i++) {
                deviceInfo.value = res.data.content[i];
                const params = JSON.parse(deviceInfo.value.param);
                const paramItem: any = {};
                if (Array.isArray(params) && params.length) {
                    for (let item of params) {
                        deviceParam.value[item.key] = item.value;
                        paramItem[item.key] = item.value;
                    }
                }
                playInfos.value.push(paramItem);
                setTimeout(() => {
                    if (paramItem.Factory == dahuaFactory) {
                        dahuaStartPlayFunc(i + 1);
                    } else if (paramItem.Factory == haikangFactory) {
                        haikangStartPlayFunc(i + 1);
                    } else {
                        startPlayFunc(i + 1, true);
                    }
                })
            }
            if (res.data.content.length == 1) {
                optionVideoConFunc(1);
            }
        }
    })
    openFlag.value = true;
    transitionFlag.value = true;
    setTimeout(() => {
        showFlag.value = true;
        if (ids.length == 1) {
            videoWindowType.value = 1;
        } else if (ids.length > 1 && ids.length < 5) {
            videoWindowType.value = 4
        } else if (ids.length > 5 && ids.length < 11) {
            videoWindowType.value = 9
        }
    }, 50);
    setTimeout(() => {
        transitionFlag.value = false;
        handleWh();
    }, 450);
}
declare const PlayerControl: any;
declare const WSPlayer: any;
const dahuaStartPlayFunc = (i: number) => {
    // 这里也是根据设备-编辑-地址设置的版本判断
    console.log('------------------看看参数：', playInfos.value[i - 1]);
    if (playInfos.value[i - 1].Version == '1') {

        dahuaHttpGetToken((token: string) => {
            dahuaHttp({
                url: `/evo-apigw/admin/API/MTS/Video/StartVideo`,
                method: `POST`,
                params: {
                    data: {
                        channelId: playInfos.value[i - 1].Channel,
                        dataType: '1',
                        streamType: '1'
                    },
                },
                token,
                cb: (res: any) => {
                    const wsUrlPrefix = location.protocol == 'https:' ? 'wss' : 'ws';
                    const protContent = location.protocol == 'https:' ? '9102' : '9100';
                    const videoData = res.data;
                    try {
                        WSPlayer.WSPlayer.prototype.processPrefixUrl = function (e: string) {
                            // 直接返回传入的路径，不自动添加斜杠
                            return e;
                        };
                        players[i - 1] = new WSPlayer.WSPlayer({
                            el: `dahua-video-` + i,
                            type: 'real',
                            prefixUrl: '../', // 解码库资源前缀
                            playerAdapter: 'stretching', // 默认实际比例, selfAdaption 实际比例 | stretching 画面铺满
                            config: {
                                maxNum: 25,  /** 一个播放器上限能播放的路数，可根据实际情况设置，支持 1 4 9 16 25 **/
                                num: 1,   /** 初始化，页面显示的路数 **/
                                showControl: false, /** 是否显示工具栏，默认显示 **/
                                showTopOperate: false,
                                showIcons: {
                                    streamChangeSelect: false, // 主辅码流切换
                                    replayIcon: false, // 刷新重播按钮
                                    ivsIcon: false, // 控制智能帧按钮
                                    talkIcon: false, // 对讲功能按钮
                                    localRecordIcon: false, // 本地录像功能按钮
                                    audioIcon: false, // 开启关闭声音按钮
                                    snapshotIcon: false, // 抓图按钮
                                    closeIcon: false, // 关闭视频按钮
                                }
                            },
                            receiveMessageFromWSPlayer: (methods: any, data: any, err: any) => { /* 回调函数，可以在以下回调函数里面做监听 */
                                switch (methods) {
                                    case 'initializationCompleted':
                                        console.log('初始化完成')
                                        players[i - 1].setPlayerAdapter("stretching");
                                        playStatus.value[i - 1] = true;
                                        // 初始化完成，可调用播放方法（适用于动态加载解码库）
                                        // 若回调未触发时就使用实时预览/录像回放，则无法播放。
                                        // 此时我们可以调用一个
                                        break;
                                    case "changeStreamType": // 主/辅码流切换回调
                                        console.log(data.channelData) // 通道数据
                                        console.log(data.streamType) // 码流类型 0-主码流  1-辅码流1  2-辅码流2
                                        console.log(data.selectIndex) // 窗口序号，从 0
                                        break;
                                    case "realSuccess": // 实时预览成功
                                        console.log("实时预览成功")
                                        break;
                                    case "realError": // 实时预览失败
                                        console.log("实时预览失败", err)
                                        break;
                                    case "notifyTalk":
                                        // 点击窗口上的对讲按钮触发的事件回调
                                        console.log("notifyTalk", data)
                                    case "talkError": // 对讲失败
                                        console.log("对讲失败");
                                        break;
                                    case 'selectWindowChanged': // 选中的窗口发生改变
                                        console.log(data, "返回窗口信息")
                                        break;
                                    case 'windowNumChanged': // 播放器显示的路数发生改变
                                        console.log(data, "返回显示的窗口数量")
                                        break;
                                    case 'closeVideo': // 视频关闭回调
                                        // 点击关闭按钮引发的视频关闭进行提示
                                        // 切换视频引发的视频关闭不进行提示
                                        if (!data.changeVideoFlag) {
                                            console.log(`窗口${data.selectIndex}的视频已关闭`)
                                        }
                                        break;
                                    case 'statusChanged': // 视频状态发生改变

                                        break;
                                    case "dblclickWindow":
                                        console.log("双击回调", data)
                                        break;
                                    case 'errorInfo': // 错误信息汇总
                                        console.log(data, "可打印查看错误消息");
                                }
                            }
                        })
                        players[i - 1].realByUrl({
                            rtspURL: `${videoData.url}?token=${videoData.token}`, // 必传
                            wsURL: `${wsUrlPrefix}://${videoData.innerIp}:${protContent}`, // 必传
                            selectIndex: 0, // 必传, 播放窗口号
                            channelId: playInfos.value[i - 1].Channel, // 必传, 通道id
                            streamType: `1`, // 必传, 码流类型，
                            playerAdapter: 'stretching', // 选传, selfAdaption 自适应 | stretching 拉伸
                            channelData: {  // 建议传, 通道树信息
                                // id: channelCode, // {String} 通道编码
                                // deviceCode: deviceCode, // {String} 设备编码
                                // deviceType: deviceType, // {String} 设备类型
                                // channelSeq: channelSeq, // {String|Number} 通道序号
                            }, // 选传
                        })
                    } catch (error) {
                        console.error('播放器错误：', error);
                    }
                }
            })
        })
    } else {
        const wsUrlPrefix = location.protocol == 'https:' ? 'wss' : 'ws';
        var options = {
            wsURL: `${wsUrlPrefix}://${playInfos.value[i - 1].IP}:${playInfos.value[i - 1].PORT}/rtspoverwebsocket`,
            rtspURL: `rtsp://${playInfos.value[i - 1].IP}:${playInfos.value[i - 1].PORT}/cam/realmonitor?channel=${playInfos.value[i - 1].Channel}&subtype=0&proto=Private3`,
            username: playInfos.value[i - 1].Username,
            password: playInfos.value[i - 1].Password,
            lessRateCanvas: true,
            wndIndex: i,
            h265AccelerationEnabled: true
        };
        players[i - 1] = new PlayerControl(options);
        players[i - 1].on('MSEResolutionChanged', function (e: any) {
            console.log(e)
        });
        players[i - 1].on('PlayStart', function (e: any) {
            console.log(e);
        });
        players[i - 1].on('WorkerReady', function () {
            players[i - 1].connect();
            playStatus.value[i - 1] = true;
        });
        players[i - 1].on('DecodeStart', function (e: any) {
            playInfos.value[i - 1].decodeMode = e.decodeMode;
        })
        setTimeout(() => {
            var videoplayerObj = document.getElementById(`dahua-video-` + i);
            var canvasplayerObj = document.getElementById('dahua-canvas-' + i);
            players[i - 1].init(canvasplayerObj, videoplayerObj);
        })
    }
}
const dahuaStopPlayFunc = (i: number, windowTypeFlag?: boolean) => {
    if (Array.isArray(players) && players[i - 1]) {
        players[i - 1].close();
        if (!windowTypeFlag) playStatus.value[i - 1] = false;
    }
}
const haikangStartPlayFunc = (i: number) => {
    haikangHttp({
        url: `/haikang/video/v2/cameras/previewURLs`,
        params: {
            "cameraIndexCode": playInfos.value[i - 1].Channel,
            "streamType": 0,
            "protocol": "ws",
            "transmode": 1,
            "expand": "transcode=0",
            "streamform": "rtp"
        },
        appKey: playInfos.value[i - 1].Username,
        appSecret: playInfos.value[i - 1].Password,
        method: 'POST',
        cb: (res: any) => {
            players[i - 1] = new JSPlugin({
                szId: `haikang-video-${i}`, //父窗口id，需要英文字母开头 必填
                szBasePath: '/', // 必填,与h5player.min.js的引用目录一致
                mseWorkerEnable: false,//是否开启多线程解码，分辨率大于1080P建议开启，否则可能卡顿
                bSupporDoubleClickFull: true,//是否支持双击全屏，true-双击是全屏；false-双击无响应
                // 当容器div#play_window有固定宽高时，可不传iWidth和iHeight，窗口大小将自适应容器宽高
                // iWidth: 600,
                // iHeight: 400,

                // 分屏播放，默认最大分屏4*4
                // iMaxSplit: 4,
                // iCurrentSplit: 1,
            })
            players[i - 1].JS_Play(res.data.url, {
                playURL: res.data.url, // 流媒体播放时必传
                mode: 0, // 解码类型：0=普通模式; 1=高级模式 默认为0
                PlayBackMode: 1,//1：绝对时间正放; 3 绝对时间倒放 默认为1
                keepDecoder: 0 // 0:回收解码资源; 1:不回收解码资源。为1时相同的编码格式，通过直接调用js_play接口切换点位不黑屏。默认0
            }, 0).then(() => {
                console.info('JS_Play success');
                playStatus.value[i - 1] = true;
            }, (err: any) => {
                console.info('JS_Play failed:', err);
            })
        },
        err: (err: any) => {
            console.log('查看错误：', err);
        }
    })
}
const dahuaHttpOperateCamera = (obj: any) => {
    dahuaHttpGetToken((token: string) => {
        dahuaHttp({
            url: `/evo-apigw/admin/API/DMS/Ptz/OperateCamera`,
            method: `POST`,
            params: {
                data: {
                    channelId: obj.Channel,
                    operateType: obj.operateType,
                    direct: obj.direct,
                    step: '8',
                    command: '1', //0停1开
                    extend: '', //扩展信息，暂时没用
                }
            },
            token,
            cb: (res: any) => {
                console.log('大华摄像头镜头控制回调数据：', res.data);
            }
        })
    })
    setTimeout(() => {
        dahuaHttpGetToken((token: string) => {
            dahuaHttp({
                url: `/evo-apigw/admin/API/DMS/Ptz/OperateCamera`,
                method: `POST`,
                params: {
                    data: {
                        channelId: obj.Channel,
                        operateType: obj.operateType,
                        direct: obj.direct,
                        step: '8',  //可以理解为步幅，对于镜头控制来说（非方向控制），保持为8吧
                        command: '0', //0停1开
                        extend: '', //扩展信息，暂时没用
                    }
                },
                token,
                cb: (res: any) => {
                    console.log('大华摄像头镜头控制回调数据：', res.data);
                }
            })
        })
    })
}
const enableZoom = () => {
    const index = getPlayInfosIndex();
    if (playInfos.value[index].Factory == dahuaFactory && playInfos.value[index].Version == '1') {
        dahuaHttpOperateCamera({
            Channel: playInfos.value[index].Channel,
            operateType: '1', //操作类型：1=变倍，2=变焦，3=光圈
            direct: '1', //1=增加，2=减小
        })
    } else {
        haikangHttp({
            url: `/haikang/video/v1/ptzs/selZoom`,
            params: {
                "cameraIndexCode": playInfos.value[videoWindowType.value == 1 ? 0 : optionVideoConNum.value].Channel,
                "startX": 20,
                "startY": 20,
                "endX": 20,
                "endY": 20
            },
            appKey: playInfos.value[videoWindowType.value == 1 ? 0 : optionVideoConNum.value].Username,
            appSecret: playInfos.value[videoWindowType.value == 1 ? 0 : optionVideoConNum.value].Password,
            method: 'POST',
            cb: (res: any) => {
                console.log('放大成功');
            },
            err: (err: any) => {
                console.log('查看错误：', err);
            }
        })
    }
}
const disableZoom = () => {
    const index = getPlayInfosIndex();
    if (playInfos.value[index].Factory == dahuaFactory && playInfos.value[index].Version == '1') {
        dahuaHttpOperateCamera({
            Channel: playInfos.value[index].Channel,
            operateType: '1', //操作类型：1=变倍，2=变焦，3=光圈
            direct: '2', //1=增加，2=减小
        })
    } else {
        haikangHttp({
            url: `/haikang/video/v1/ptzs/selZoom`,
            params: {
                "cameraIndexCode": playInfos.value[videoWindowType.value == 1 ? 0 : optionVideoConNum.value].Channel,
                "startX": 0,
                "startY": 0,
                "endX": 0,
                "endY": 0
            },
            appKey: playInfos.value[videoWindowType.value == 1 ? 0 : optionVideoConNum.value].Username,
            appSecret: playInfos.value[videoWindowType.value == 1 ? 0 : optionVideoConNum.value].Password,
            method: 'POST',
            cb: (res: any) => {
                console.log('缩小成功回调数据：', res);
            },
            err: (err: any) => {
                console.log('查看错误：', err);
            }
        })
    }
}
const focusAdd = () => {
    const index = getPlayInfosIndex();
    if (playInfos.value[index].Factory == dahuaFactory && playInfos.value[index].Version == '1') {
        dahuaHttpOperateCamera({
            Channel: playInfos.value[index].Channel,
            operateType: '2', //操作类型：1=变倍，2=变焦，3=光圈
            direct: '1', //1=增加，2=减小
        })
    }
}
const focusReduce = () => {
    const index = getPlayInfosIndex();
    if (playInfos.value[index].Factory == dahuaFactory && playInfos.value[index].Version == '1') {
        dahuaHttpOperateCamera({
            Channel: playInfos.value[index].Channel,
            operateType: '2', //操作类型：1=变倍，2=变焦，3=光圈
            direct: '2', //1=增加，2=减小
        })
    }
}
const apertureAdd = () => {
    const index = getPlayInfosIndex();
    if (playInfos.value[index].Factory == dahuaFactory && playInfos.value[index].Version == '1') {
        dahuaHttpOperateCamera({
            Channel: playInfos.value[index].Channel,
            operateType: '3', //操作类型：1=变倍，2=变焦，3=光圈
            direct: '1', //1=增加，2=减小
        })
    }
}
const apertureReduce = () => {
    const index = getPlayInfosIndex();
    if (playInfos.value[index].Factory == dahuaFactory && playInfos.value[index].Version == '1') {
        dahuaHttpOperateCamera({
            Channel: playInfos.value[index].Channel,
            operateType: '3', //操作类型：1=变倍，2=变焦，3=光圈
            direct: '2', //1=增加，2=减小
        })
    }
}
const capturePicture = () => {
    if (playInfos.value[videoWindowType.value == 1 ? 0 : optionVideoConNum.value].Factory != haikangFactory) return;
    let fileName = 'img';
    let fileType = 'JPEG';
    //下载到本地
    players[videoWindowType.value == 1 ? 0 : optionVideoConNum.value].JS_CapturePicture(0, fileName, fileType).then(
        () => {
            console.info('JS_CapturePicture success');
            // do you want...
        },
        (err: any) => {
            console.info('JS_CapturePicture failed:', err);
            // do you want...
        }
    );
}
const haikangStopPlayFunc = (i: number, windowTypeFlag?: boolean) => {
    if (!players[i - 1]) return;
    players[i - 1].JS_Stop(0).then(
        () => {
            console.info('JS_Stop success');
            // do you want...
            if (!windowTypeFlag) playStatus.value[i - 1] = false;
        },
        (err: any) => {
            console.info('JS_Stop failed:', err);
            // do you want...
        }
    );
}
const videoWindowTypeChange = () => {
    if (playStatus.value.length > videoWindowType.value) {
        for (let i = playStatus.value.length - videoWindowType.value; i > videoWindowType.value; i--) {
            if (playInfos.value[i].Factory == dahuaFactory) {
                dahuaStopPlayFunc(i + 1, true);
            } else if (playInfos.value[i].Factory == haikangFactory) {
                haikangStopPlayFunc(i + 1, true);
            } else {
                stopPlayFunc(i + 1);
            }
        }
    }
    for (let i = 0; i < playStatus.value.length; i++) {
        if (playInfos.value[i] && playInfos.value[i].Factory == dahuaFactory) {
            //这里要加一个版本(在设备管理-编辑-地址里)，专门针对于，大华摄像头新的sdk请求获取连接播放的版本，和其他大华版本的区别是，这个版本要先关闭，才可以重新启动。
            if (playInfos.value[i].Version == '1') {
                dahuaStopPlayFunc(i + 1, true);
                setTimeout(() => {
                    dahuaStartPlayFunc(i + 1);
                })
            } else {
                dahuaStartPlayFunc(i + 1);
            }
        }
        if (playInfos.value[i] && playInfos.value[i].Factory == haikangFactory) {
            setTimeout(() => {
                haikangStartPlayFunc(i + 1);
            })
        }
    }
}
const startPlayFunc = (i: number, noValidFlag?: boolean) => {
    if (playStatus.value[i - 1] && !noValidFlag) return;
    socket.on(`v_${clientId}_${i}`, function (frame: any) {
        if (frame && frame.image) {
            const img: any = document.getElementById('video-' + i);
            if (img) img.src = frame.image;
        } else {
            console.error("收到无效的视频帧");
        }
    });

    socket.on(`m_${clientId}_${i}`, function (msg: any) {
        if (msg && msg.msg) {
            const box: any = document.getElementById('video-content-word-' + i);
            if (box) box.innerText = msg.msg;
        } else {
            console.error("收到无效的消息帧");
        }
    });
    startPlay({
        factory: deviceParam.value.Factory,
        username: deviceParam.value.Username,
        password: deviceParam.value.Password,
        ip: deviceParam.value.IP,
        port: deviceParam.value.PORT,
        channel: deviceParam.value.Channel,
        selectedId: i,
        clientId: clientId,
        type: deviceParam.value.Type || 1
    }, () => {
        playStatus.value[i - 1] = true;
    })
}

const stopPlayFunc = (i: number) => {
    if (!playStatus.value[i - 1]) return;
    stopPlay({
        selectedId: i,
        clientId: clientId
    }, () => {
        const img: any = document.getElementById('video-' + i);
        if (img) img.src = defaultVideoImg;
        const box: any = document.getElementById('video-content-word-' + i);
        if (box) box.innerText = '等待播放中...';
        playStatus.value[i - 1] = false;
    })
}
/**
 * 关闭弹框
 * 和打开弹框反过来
 */
const closeModel = () => {
    allStop();
    transitionFlag.value = true;
    setTimeout(() => {
        showFlag.value = false;
    }, 50);
    setTimeout(() => {
        transitionFlag.value = false;
        openFlag.value = false;
    }, 450);
}
/**
 * 定义到全局 在任何地方都可以调用
 */
(window as any).moveBoxOpenModel = openModel;
(window as any).moveBoxCloseModel = closeModel;


const optionVideoConFunc = (i: number) => {
    optionVideoConNum.value = i;
    const index = videoWindowType.value == 1 ? 0 : optionVideoConNum.value;
    if (playInfos.value && playInfos.value[index] && playInfos.value[index].Factory != haikangFactory) return;
    haikangHttp({
        url: `/haikang/video/v1/presets/searches`,
        params: {
            "cameraIndexCode": playInfos.value[i - 1].Channel,
        },
        appKey: playInfos.value[i - 1].Username,
        appSecret: playInfos.value[i - 1].Password,
        method: 'POST',
        cb: (res: any) => {
            if (Array.isArray(res.data.list) && res.data.list.length) {
                presetPositionOptions.value = res.data.list;
            }
        },
        err: (err: any) => {
            console.log('查看错误：', err);
        }
    })
}

const stop = () => {
    if (videoWindowType.value == 1) {
        if (!playInfos.value[0] || playInfos.value[0].Factory != dahuaFactory) {
            stopPlayFunc(1);
        } else {
            dahuaStopPlayFunc(1);
        }
    } else {
        if (optionVideoConNum.value < 0 || optionVideoConNum.value > 8) {
            return;
        }

        if (playInfos.value[optionVideoConNum.value] && playInfos.value[optionVideoConNum.value].Factory == haikangFactory) {
            haikangStopPlayFunc(optionVideoConNum.value + 1);
        } else if (playInfos.value[optionVideoConNum.value] && playInfos.value[optionVideoConNum.value].Factory == dahuaFactory) {
            dahuaStopPlayFunc(optionVideoConNum.value + 1);
        } else {
            stopPlayFunc(optionVideoConNum.value + 1);
        }
    }
}

const allStop = () => {
    for (let i = 0; i < videoWindowType.value; i++) {
        if (playInfos.value[i] && playInfos.value[i].Factory == haikangFactory) {
            haikangStopPlayFunc(i + 1);
        } else if (playInfos.value[i] && playInfos.value[i].Factory == dahuaFactory) {
            dahuaStopPlayFunc(i + 1);
        } else {
            stopPlayFunc(i + 1);
        }
    }
}
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;

.move-box-con {
    background: var(--el-fill-color);
    position: absolute;
    z-index: 100;
    overflow: hidden;
    display: none;
    transform: translateY(10%);
    opacity: 0;
    box-shadow: var(--el-box-shadow);

    .move-box-header {
        width: 100%;
        height: zrem(32);
        box-sizing: border-box;
        border-bottom: zrem(1) solid var(--el-border-color);
    }

    .move-box-resize {
        width: zrem(100);
        height: zrem(100);
        position: absolute;
        right: 0;
        bottom: 0;
        background: skyblue;
        cursor: crosshair;
    }

    .move-box-content {
        width: 100%;
        height: calc(100% - zrem(32));
        display: flex;
        box-sizing: border-box;
        padding: zrem(2);

        .move-box-content-tree {
            width: zrem(220);
            height: 100%;
            box-sizing: border-box;
            padding: 0 zrem(10);
            margin-right: zrem(10);
        }

        .move-box-content-content {
            flex: 1;
            height: 100%;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;

            .video-content-con-1 {
                width: 100%;
                height: 100%;
                background: black;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .video-content-word {
                    position: absolute;
                    bottom: zrem(20);
                    left: zrem(20);
                    font-size: zrem(14);
                }
            }

            .video-content-con-4 {
                width: 50%;
                height: 50%;
                background: black;
                box-sizing: border-box;
                position: relative;

                .video-content-word {
                    position: absolute;
                    bottom: zrem(20);
                    left: zrem(20);
                    font-size: zrem(14);
                }
            }

            .video-content-con-9 {
                width: 33.33333333%;
                height: 33.3333333%;
                background: black;
                box-sizing: border-box;
                position: relative;

                .video-content-word {
                    position: absolute;
                    bottom: zrem(20);
                    left: zrem(20);
                    font-size: zrem(14);
                }
            }

            .active-video-content-con {
                border: zrem(1) solid red;
            }
        }

        .border-ui {
            border: zrem(1) solid var(--el-border-color);
        }

        .move-box-content-operator {
            width: zrem(300);
            height: 100%;
            background: var(--el-fill-color);
            margin-left: zrem(10);
            box-sizing: border-box;
            padding-left: zrem(10);
        }

        .move-box-content-operator-title {
            .move-box-content-operator-title-icon {
                width: zrem(6);
                height: zrem(20);
                margin-right: zrem(10);
                background: var(--el-color-primary);
            }
        }
    }
}

.reduce-box-img-con {
    width: zrem(30);
    height: zrem(30);
    border-radius: zrem(8);
    background: var(--el-color-primary);
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: zrem(16);
        height: zrem(16);
    }
}

.open-move-box {
    display: block;
}

.transition-4 {
    transition: .4s;
}

.show-move-box {
    opacity: 1;
    transform: translateY(0);
}

.button-wh-1 {
    width: zrem(46);
    height: zrem(36);
}

.w-70 {
    width: zrem(70);
}

.m-r-4 {
    margin-right: zrem(10);
}

.w-164 {
    width: zrem(164);
}

.w-80 {
    width: zrem(80);
}

.buttons-con {
    width: zrem(280);
    margin: 0 auto zrem(10);
}

.margin-none {
    margin: 0 !important;
}

.remote-control-con {
    width: 260px;
    height: 260px;
    position: relative;
    border-radius: 130px;
    box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.75);
    margin: 0 auto 10px;

    .remote-control-button-1 {
        width: 100px;
        height: 40px;
        position: absolute;
        left: 80px;
        top: 12px;
        border-radius: 20px;
        cursor: pointer;
    }

    .remote-control-button-2 {
        width: 48px;
        height: 48px;
        position: absolute;
        left: 35px;
        top: 35px;
        border-radius: 23px;
        cursor: pointer;
    }

    .remote-control-button-3 {
        width: 40px;
        height: 100px;
        position: absolute;
        left: 12px;
        top: 80px;
        border-radius: 20px;
        cursor: pointer;
    }

    .remote-control-button-4 {
        width: 48px;
        height: 48px;
        position: absolute;
        left: 35px;
        bottom: 35px;
        border-radius: 23px;
        cursor: pointer;
    }

    .remote-control-button-5 {
        width: 100px;
        height: 40px;
        position: absolute;
        left: 80px;
        bottom: 12px;
        border-radius: 20px;
        cursor: pointer;
    }

    .remote-control-button-6 {
        width: 48px;
        height: 48px;
        position: absolute;
        right: 35px;
        bottom: 35px;
        border-radius: 23px;
        cursor: pointer;
    }

    .remote-control-button-7 {
        width: 40px;
        height: 100px;
        position: absolute;
        right: 12px;
        top: 80px;
        border-radius: 20px;
        cursor: pointer;
    }

    .remote-control-button-8 {
        width: 48px;
        height: 48px;
        position: absolute;
        right: 35px;
        top: 35px;
        border-radius: 23px;
        cursor: pointer;
    }

    .remote-control-button-9 {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        position: absolute;
        left: 60px;
        top: 60px;
        background: var(--el-color-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .arrow-1 {
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 20px solid var(--el-text-primary-color);
        position: absolute;
        left: 120px;
        top: 20px;
    }

    .arrow-2 {
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 20px solid red;
        position: absolute;
        left: 194px;
        top: 46px;
        transform: rotate(45deg);
    }

    .arrow-ui {
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 20px solid var(--el-text-color-primary);
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .arr-ui-rotate45 {
        transform: translate(-50%, -50%) rotate(45deg);
    }

    .arr-ui-rotate90 {
        transform: translate(-50%, -50%) rotate(90deg);
    }

    .arr-ui-rotate135 {
        transform: translate(-50%, -50%) rotate(135deg);
    }

    .arr-ui-rotate180 {
        transform: translate(-50%, -50%) rotate(180deg);
    }

    .arr-ui-rotate225 {
        transform: translate(-50%, -50%) rotate(225deg);
    }

    .arr-ui-rotate270 {
        transform: translate(-50%, -50%) rotate(270deg);
    }

    .arr-ui-rotate315 {
        transform: translate(-50%, -50%) rotate(315deg);
    }

    .arr-ui-rotate360 {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}

.playback-box-con {
    width: zrem(940);
    height: zrem(784);
    background: var(--el-fill-color);
    border: zrem(2) solid var(--el-fill-color);
    position: absolute;
    left: 50%;
    top: 60%;
    transform: translate(-50%, -50%);
    z-index: 100;
    transition: .4s;
    opacity: 0;
    display: none;

    .playback-box-header {
        width: 100%;
        height: zrem(40);
        border-bottom: zrem(1) solid var(--el-border-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0 zrem(20);
    }

    .playback-box-video-operator {
        display: flex;
        border-bottom: zrem(1) solid var(--el-border-color);

        .playback-box-video {
            width: zrem(667);
            height: zrem(500);
            background: black;
        }

        .playback-box-operator {
            width: zrem(260);
            height: zrem(500);
            padding: zrem(20);
            box-sizing: border-box;

            .move-box-content-operator-title {
                .move-box-content-operator-title-icon {
                    width: zrem(6);
                    height: zrem(20);
                    margin-right: zrem(10);
                    background: var(--el-color-primary);
                }
            }
        }
    }

    .playback-box-process {
        width: zrem(667);
        box-sizing: border-box;
        padding: 0 zrem(10);
        margin: zrem(10) 0;
    }

    .playback-box-table-buttons {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding-left: zrem(10);

        .playback-box-table {
            width: zrem(657);
            height: zrem(180);
        }

        .playback-box-buttons {
            width: zrem(260);
            height: zrem(180);
            box-sizing: border-box;
            padding: zrem(30) zrem(20);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    }
}

.open-playback-con {
    display: block;
}

.show-playback-con {
    opacity: 1;
    top: 50%;
}

.w-40 {
    width: zrem(40);
}

.video-img-wh {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .sub-wnd {
        border: none !important;
    }
}

.video-img-wh-0 {
    width: 0;
    height: 0;
}

.video-img-default-wh {
    width: zrem(65);
    height: zrem(55);
}
</style>