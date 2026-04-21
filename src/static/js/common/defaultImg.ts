import defaultFace from '@static/images/defaultFace.png';
import defaultEnterpriseLogo from '@static/images/defaultEnterpriseLogo.png';
import defaultEnterpriseImage from '@static/images/defaultEnterpriseImage.png'
import defaultSystemIcon from '@static/images/defaultSystemIcon.svg';
import defaultDevice from '@static/images/defaultDevice.png'
import defaultPark from '@static/images/defaultPark.png';
import defaultBuild from '@static/images/defaultBuild.png';
import defaultFloor from '@static/images/defaultFloor.png';
import defaultRoom from '@static/images/defaultRoom.png';
import defaultAreaLogo from '@static/images/defaultAreaLogo.svg';
import defaultAreaImage from '@static/images/defaultAreaImage.png';
import defaultSceneIcon from '@static/images/defaultSceneIcon.svg';
import defaultScene from '@static/images/defaultScene.png';
import defaultRunIcon from '@static/images/defaultRunIcon.gif';
import defaultStopIcon from '@static/images/defaultStopIcon.gif';
import defaultAlarmIcon from '@static/images/defaultAlarmIcon.gif';
import defaultFaultIcon from '@static/images/defaultFaultIcon.gif';
import defaultOfflineIcon from '@static/images/defaultOfflineIcon.gif';
import defaultProjectLogo from '@static/images/defaultProjectLogo.png';
import defaultProjectImage from '@static/images/defaultProjectImage.svg';

export const defaultImg = {
    defaultFace,  // 用户默认头像
    defaultEnterpriseLogo, //企业默认logo
    defaultEnterpriseImage, //企业默认图片
    defaultBrandLogo: '暂无', //品牌默认logo
    defaultSystemIcon, //系统默认icon
    defaultDevice, //设备类型默认缩略图
    defaultPark, //园区默认图片
    defaultBuild, //建筑默认图片
    defaultBuildLogo: '暂无', //建筑默认logo
    defaultFloor, //楼层默认图片
    defaultRoom, //房间默认图片
    defaultAreaLogo, //区域默认icon
    defaultAreaImage, //区域默认图片
    defaultSceneIcon, //场景默认icon
    defaultScene, //场景默认缩略图
    defaultRunIcon, //设备运行默认icon
    defaultStopIcon, //设备停止默认icon
    defaultAlarmIcon, //设备报警默认icon
    defaultFaultIcon, //设备故障默认icon
    defaultOfflineIcon, //设备离线默认icon
    defaultProjectLogo, //项目默认logo
    defaultProjectImage, //项目默认背景图
    adminLogo: '暂无', //管理平台Admin产品logo
    adminBackground: '暂无', //管理平台Admin产品背景
    makeLogo: '暂无', //Make平台产品logo
    makeBackground: '暂无',//Make平台产品背景
    smartLogo: '暂无', //Smart平台产品logo
    smartBackground: '暂无', //Smart平台产品背景
    mopaiLogo : '暂无',//Mopai平台产品logo
    mopaiBackground : '暂无', //Mopai平台产品背景
    iotLogo : '暂无', //Iot平台产品logo
    iotBackground : '暂无',//Iot平台产品背景
    portalLogo : '暂无', //Portal平台产品logo
    portalBackground : '暂无', //Portal平台产品背景
    masterLogo : '暂无', //Master平台产品logo
    masterBackground : '暂无', //Master平台产品背景
}

export enum defaultImgKey {
  defaultProjectLogo = 'defaultProjectLogo',
  defaultProjectImage = 'defaultProjectImage',
  defaultSystemIcon = 'defaultSystemIcon',
  defaultRunIcon = 'defaultRunIcon',
  defaultAlarmIcon = 'defaultAlarmIcon',
  defaultFaultIcon = 'defaultFaultIcon',
  defaultOfflineIcon = 'defaultOfflineIcon',
  defaultStopIcon = 'defaultStopIcon'
}
//将import的文件转为可以上传的文件格式
export const getImgFile = async (fileKey: string) => {
  const response = await fetch(defaultImg[fileKey as keyof typeof defaultImg]);
  const blob = await response.blob();
  const fileName = defaultImg[fileKey as keyof typeof defaultImg].split('/')[defaultImg[fileKey as keyof typeof defaultImg].split('/').length - 1];
  const newFile = new File([blob], fileName, { type: blob.type });
//   console.log('查看newFile:', newFile);
//   console.log('查看url:', URL.createObjectURL(newFile));
  return {
    file: newFile,
    img: defaultImg[fileKey as keyof typeof defaultImg]
  }
}
