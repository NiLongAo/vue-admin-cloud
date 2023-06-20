<template>
  <PageWrapper dense fixedHeight contentFullHeight  @back="goBack" :title="`国标录像：` + stats.deviceId +`/`+stats.channelId">
    <div :class="`${prefixCls} flex flex-row h-full`">
      <div :class="`${prefixCls}-left bg-white w-66 my-4 ml-4 flex flex-col min-w-60`">
        <div>
          <DatePicker :class="`${prefixCls}-left-date-picker`" v-model:value="stats.recodeDate" value-format="YYYY-MM-DD" @change="onDatePickerChange"/>
        </div>
        <div :class="`${prefixCls}-left-list grow`" class="" v-if="stats.recordDateList.length > 0" >
          <List class="h-full" size="small" bordered :dataSource="stats.recordDateList">
              <template #renderItem ="{item}">
                  <ListItem ><Tag class="cursor-pointer text-center w-full " :color="`${ stats.clickListItme ===item.recorderId?'#108ee9' :''}`" @click="listItemClick(item)">{{ stringToFormatString(item.startTime,DATE_TIME_FORMAT,DATE_TIME)}} - {{ stringToFormatString(item.endTime,DATE_TIME_FORMAT,DATE_TIME)}}</Tag></ListItem>
              </template>
          </List>
        </div>
        <div class="grow flex justify-center items-center" v-else >
          <span class="text-xl font-medium text-stone-400">暂无数据</span>
        </div>
      </div>
      <div :class="`${prefixCls}-righ grow flex flex-col m-4 space-y-2 min-w-240`">
          <div :class="`${prefixCls}-right-top grow bg-black`">
            <VideoJessibucaPlay :videoUrl="stats.videoUrl"/>
          </div>
          <div :class="`${prefixCls}-right-bom h-30 bg-white px-6 flex flex-col `">
              <div class="h-15 w-full flex items-center">
                <TimeRangePicker 
                v-model:value="stats.rangePickerDate" 
                value-format="HH:mm:ss" 
                size="small"
                :disabledTime="disabledTime"
                />
              </div>
              <div class="h-15 w-full flex items-center ">
                <Slider 
                  v-model:value="stats.sliderDate"
                  class="w-full"
                  range
                  :disabled="(isEmpty(stats.recordDateList)?true:false)"
                  :marks="stats.marks"
                  :min="stats.minSliderDate" 
                  :max="stats.maxSliderDate" 
                  tooltip-placement="bottom"
                  :tooltip-visible="true"
                  :tipFormatter="tipFormatter"
                  @change="changeSlider"
                />
              </div>
          </div>
      </div>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { DatePicker,Slider,List,ListItem,Tag,TimeRangePicker} from 'ant-design-vue';
  import { useRoute } from 'vue-router';
  import { reactive,onMounted} from 'vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { PageWrapper } from '/@/components/Page';
  import { doRecordList } from '/@/api/video/record';
  import { isEmpty } from '/@/utils/is';
  import { RecordItem } from '/@/api/video/model/recordModel';
  import { VideoJessibucaPlay } from  '/@/components/Video/index';
  import { 
    formatToDateTime,
    stringToFormatString,
    formatToDate,
    tipFormatter,
    stringFormatTime,
    DATE_TIME_FORMAT,
    DATE_FORMAT,
    DATE_TIME
  } from '/@/utils/dateUtil';

  import { debounce } from 'lodash-es';
import { array } from 'vue-types';
  const { prefixCls } = useDesign('video-record-play');
  const go = useGo();
  const route = useRoute();
  const stats = reactive({
    deviceId: route.params?.deviceId as string,
    channelId: route.params?.channelId as string,
    //组件相关
    clickListItme:"",//选中的录像数据列表key 处理选中状态
    recodeDate: null as any,//查询录像时间
    recordDateList:[] as Array<RecordItem>,//返回录像数据列表
    sliderDate:[0,86399]  as any,//滑块默认时间
    rangePickerDate:['00:00:00','23:59:59']  as any,//时间范围选择器 时间
    minSliderDate:0,//最小滑块值
    maxSliderDate:86400,//最大滑块值
    //视频相关
    videoUrl:'',//录像播放地址
    //滑块时间范围
    marks:{
      0: "00:00",
      3600: "01:00",
      7200: "02:00",
      10800: "03:00",
      14400: "04:00",
      18000: "05:00",
      21600: "06:00",
      25200: "07:00",
      28800: "08:00",
      32400: "09:00",
      36000: "10:00",
      39600: "11:00",
      43200: "12:00",
      46800: "13:00",
      50400: "14:00",
      54000: "15:00",
      57600: "16:00",
      61200: "17:00",
      64800: "18:00",
      68400: "19:00",
      72000: "20:00",
      75600: "21:00",
      79200: "22:00",
      82800: "23:00",
      86400: "24:00",
    }
  });
  //选择日期时间 搜索 录像记录
  const onDatePickerChange = (_val,strVal:string) =>{
    getDataList(strVal+' 00:00:00',strVal+' 23:59:59');
  }
  //选择录像时间段
  const listItemClick = (item:RecordItem) =>{
    let startTime ,endTime;
    if(stats.clickListItme === item.recorderId){
      stats.clickListItme = "";
      startTime = 0;
      endTime = 86399;
    }else{
      stats.clickListItme = item.recorderId;
      startTime = stringFormatTime(item.startTime);
      endTime = stringFormatTime(item.endTime);
    }
    stats.minSliderDate=startTime;
    stats.maxSliderDate=endTime;
    handleTime(startTime,endTime);
    //触发播放事件
  }
  //触发滑块播放事件 0坐标 开始时间 1坐标 结束时间 debounce防抖动函数
  const changeSlider = debounce((val:[] | any)=>{
    const date = formatToDateTime(stats.recodeDate,DATE_FORMAT);
    const startTime = date+' '+tipFormatter(val[0]);
    const endTime = date+' '+tipFormatter(val[1]);
    //触发播放事件 //延迟执行
  },1000)
  //时间区域限制
  const disabledTime = (date, type) => {
    const val = formatToDateTime(stats.recodeDate,DATE_FORMAT);
    //取值只能去在开始丶结束时间之间
    const startTime = val+' '+tipFormatter(stats.sliderDate[0]);//开始时间
    const endTime = val+' '+tipFormatter(stats.sliderDate[1]);//结束时间
    return {
        disabledHours: () => {
          const startHour = new Date(startTime).getHours();
          const endHour = new Date(endTime).getHours();
          return [...Array(24).keys()].filter(h => h < startHour || h > endHour);
        },
        disabledMinutes: (hour) => {
          const startMinute = new Date(startTime).getMinutes();
          const endMinute = new Date(endTime).getMinutes();
          let disabled1 = [] as Array<number>;
          let disabled2 = [] as Array<number>;
          if (hour === new Date(startTime).getHours()) {
            disabled1 = [...Array(60).keys()].filter(m => m < startMinute || m >= 60);
          }
          if (hour === new Date(endTime).getHours()) {
            disabled2 = [...Array(60).keys()].filter(m => m > endMinute);
          }
          return [...disabled1,...disabled2];
        },
        disabledSeconds: (hour,minute) => {
          const startSecond = new Date(startTime).getSeconds();
          const endSecond = new Date(endTime).getSeconds();
          let disabled1 = [] as Array<number>;
          let disabled2 = [] as Array<number>;
          if (minute === new Date(startTime).getMinutes() && hour === new Date(startTime).getHours() ) {
            disabled1 = [...Array(60).keys()].filter(s => s < startSecond || s >= 60);
          }
          if (minute === new Date(endTime).getMinutes() && hour === new Date(endTime).getHours() ) {
            disabled2 = [...Array(60).keys()].filter(m => m > endSecond);
          }
          return [...disabled1,...disabled2];
        },
      };
  }

  //触发时间相关事件(hh-mm-ss)
  const handleTime = async (startTime:number,endTime:number) =>{
    stats.sliderDate=[startTime,endTime];
    stats.rangePickerDate=[tipFormatter(startTime),tipFormatter(endTime)];
  }

  //获取录像信息请求接口
  const getDataList = async(startTime:string,endTime:string) =>{
    // const {recordList} = await doRecordList({
    //   deviceGbId:stats.deviceId,
    //   channelId:stats.channelId,
    //   startTime:startTime,
    //   endTime:endTime,
    // })
    // stats.recordDateList = recordList;
    //返回数据格式
    stats.recordDateList = [
      {
        recorderId:'1',
        deviceId:stats.deviceId,
        startTime:'2023-06-18 08:00:33',
        endTime:'2023-06-18 09:00:37',
      },
      {
        recorderId:'2',
        deviceId:stats.deviceId,
        startTime:'2023-06-18 11:00:33',
        endTime:'2023-06-18 13:00:37',
      },
      {
        recorderId:'3',
        deviceId:stats.deviceId,
        startTime:'2023-06-18 15:00:33',
        endTime:'2023-06-18 17:00:37',
      },
    ]
  }
  
  // 此处可以得到用户ID
  function goBack() {
    // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
    go('/video/play/channel/'+stats.deviceId);
  }

  onMounted( async()=>{
    stats.recodeDate = formatToDateTime();
    onDatePickerChange(null,formatToDate());
  })
  
</script>
<style lang="less">
 @prefix-cls: ~'@{namespace}-video-record-play';
 .@{prefix-cls}{
  &-left{
    .ant-picker{
      width: 100%;
    }
    &-date-picker{
      .ant-picker-input input{
        text-align: center;
      }
    }
    &-list{
      .ant-tag{
        padding: 0 0;
        margin-right: 0;
      }
    }
  }
  &-right{
    &-top{

    }
  }
 }

</style>