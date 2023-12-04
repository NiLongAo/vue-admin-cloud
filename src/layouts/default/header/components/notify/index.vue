<template>
  <div :class="prefixCls">
    <Popover title="" trigger="click" :overlayClassName="`${prefixCls}__overlay`">
      <Badge :count="count" dot :numberStyle="stats.numberStyle">
        <BellOutlined />
      </Badge>
      <template #content>
        <Tabs v-model:activeKey="activeKey" style="width: 300px">
          <template v-for="item in stats.tabList" :key="item.key">
            <TabPane>
              <template #tab>
                {{ item.name }}
                <span v-if="item.count !== 0">({{ item.count }})</span>
              </template>
              <!-- 绑定title-click事件的通知列表中标题是“可点击”的-->
              <NoticeList
                :list="stats.listParams.list"
                :pageSize="stats.params.pageSize"
                :total="stats.listParams.total"
                v-if="item.key === '1'"
                @update:currentPage="updatePage"
                @title-click="onNoticeClick"
              />
              <NoticeList
                :list="stats.listParams.list"
                :pageSize="stats.params.pageSize"
                :total="stats.listParams.total"
                @update:currentPage="updatePage"
                v-else
              />
            </TabPane>
          </template>
        </Tabs>
      </template>
    </Popover>
    <UserNoticeModel @register="registerModal" @afterClose="afterClose" />
  </div>
</template>
<script lang="ts" setup>
  import { computed, ref, reactive, unref, watch, onBeforeMount } from 'vue';
  import { Popover, Tabs, Badge } from 'ant-design-vue';
  import { BellOutlined } from '@ant-design/icons-vue';
  import { tabListData, ListItem } from './data';
  import UserNoticeModel from './UserNoticeModel.vue';
  import { useModal } from '@/components/Modal';
  import NoticeList from './NoticeList.vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useMessage } from '@/hooks/web/useMessage';
  import { SocketOutEvent, ResultEnum } from '@/enums/SocketEnum';
  import { getUserPublicNoticePage, doUserReadNoticeDetail } from '@/api/notice/publicNotice';
  import rootSocketEmitter from '@/hooks/socket/rootSocketEmitter';

  const [registerModal, { openModal }] = useModal();
  const stats = reactive({
    numberStyle:{},
    tabList: [
      {
        key: '1',
        name: '公告',
        count: 0,
      },
      {
        key: '2',
        name: '消息',
        count: 0,
      },
      {
        key: '3',
        name: '代办',
        count: 0,
      },
    ],
    params: {
      pageNumber: 1,
      pageSize: 5,
      sort: {
        field: 'createTime',
        order: 'descend',
      },
    },
    listParams: {
      list: [] as Array<ListItem>,
      total: 5,
    },
  });
  //不同分页接口
  let api = ref();
  //不同详情接口
  let apiDetail = ref();
  //不同数据组装
  let updateData = ref();
  //当前初始化页签位置
  const activeKey = ref('1');
  const { prefixCls } = useDesign('header-notify');
  const { notification, createMessage } = useMessage();

  const count = computed(() => {
    let count = 0;
    for (let i = 0; i < tabListData.length; i++) {
      count += tabListData[i].list.length;
    }
    return count;
  });
  //初始化表单数据源
  const initData = async () => {
    const data = await unref(api)(stats.params);
    stats.listParams.list = unref(updateData)(data);
    stats.listParams.total = data.total;
  };

  //点击分页时触发加载按钮
  async function updatePage(pageNumber) {
    stats.params.pageNumber = pageNumber;
    const data = await unref(api)(stats.params);
    stats.listParams.list = unref(updateData)(data);
    stats.listParams.total = data.total;
  }
  //公告分页数据组装
  const updatePublicNoticeData = (data) => {
    let dataList = [] as Array<ListItem>;
    data.data.forEach((element) => {
      let model;
      model = {
        id: element.id,
        avatar: '',
        description: '',
        url: element.content,
        titleDelete: element.readNotice == 1 ? true : false,
        title: element.title,
        datetime: element.createTime,
        type: '1',
        extra: element.readNotice == 1 ? '已读' : '未读',
        color: element.readNotice == 1 ? 'blue' : 'gold',
      } as ListItem;
      dataList.push(model);
    });
    stats.tabList[0].count = data.total;
    return dataList as Array<ListItem>;
  };
  //消息分页数据组装
  const updateMessagesData = () => {
    let dataList = [] as Array<ListItem>;

    let model = {
      id: '1',
      avatar: '',
      description: '',
      url: '',
      titleDelete: false,
      title: '开发中',
      datetime: '',
      type: '1',
      extra: '',
      color: '',
    } as ListItem;
    dataList.push(model);
    return dataList as Array<ListItem>;
  };

  //待办分页数据组装
  const updateNeedData = () => {
    let dataList = [] as Array<ListItem>;

    let model = {
      id: '1',
      avatar: '',
      description: '',
      url: '',
      titleDelete: false,
      title: '开发中',
      datetime: '',
      type: '1',
      extra: '',
      color: '',
    } as ListItem;
    dataList.push(model);
    return dataList as Array<ListItem>;
  };
  //点击标题触发 详情
  async function onNoticeClick(record: ListItem) {
    // createMessage.success('你点击了通知，ID=' + record.id);
    // 可以直接将其标记为已读（为标题添加删除线）,此处演示的代码会切换删除线状态
    // record.titleDelete = !record.titleDelete;
    const data = await unref(apiDetail)({ id: record.id });
    openModal(true, data);
  }
  //检测点击页签变化调用不同接口数据
  watch(
    () => unref(activeKey),
    (val) => {
      //公告相关
      if (val == '1') {
        api.value = getUserPublicNoticePage;
        apiDetail.value = doUserReadNoticeDetail;
        updateData.value = updatePublicNoticeData;
      }
      //消息相关
      else if (val == '2') {
        api.value = getUserPublicNoticePage;
        apiDetail.value = doUserReadNoticeDetail;
        updateData.value = updateMessagesData;
      }
      //代办相关
      else if (val == '3') {
        api.value = getUserPublicNoticePage;
        apiDetail.value = doUserReadNoticeDetail;
        updateData.value = updateNeedData;
      }
      initData();
    },
    {
      immediate: true,
    },
  );

  //model关闭时刷新分页
  const afterClose = () => {
    initData();
  };
  onBeforeMount(() => {
    rootSocketEmitter.on(SocketOutEvent.PUBLIC_MEMBER_EVENT, (obj) => {
     const  { code, message, data } = obj as any;
      if (code != ResultEnum.SUCCESS) {
        createMessage.error(message || '获取消息错误');
        return;
      }
      const { outType, message: msg } = data;
      if (outType == 1) {
        notification.info({
          message: '平台通知公告:',
          description: msg,
          duration: 5,
        });
        initData();
      }
    });
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-notify';

  .@{prefix-cls} {
    padding-bottom: 1px;

    &__overlay {
      max-width: 360px;
    }

    .ant-tabs-content {
      width: 300px;
    }

    .ant-badge {
      display: flex;
      align-items: center;
      font-size: 18px;

      .ant-badge-multiple-words {
        padding: 0 4px;
      }

      svg {
        width: 0.9em;
      }
    }
  }
</style>
