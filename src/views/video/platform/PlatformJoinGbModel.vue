<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose 
    :maskClosable="false"
    :footer="null"
    @register="registerModal"
    width="90%"
  >
    <div :class="`${prefixCls} flex flex-row`">
      <div class="min-w-60">
          <BasicTree 
            toolbar
            search
            size="small"
            title="目录"
            defaultExpandAll
            ref="platformJoinTree"
            :selectedKeys="defaultKey"
            :fieldNames="stats.fieldNames"
            :clickRowToExpand="false"
            :treeData="treeData"
            @select="handleSelect"
          />
      </div>
      <div class="grow">
        <Card
          :tab-list="stats.cardTabList"
          :active-tab-key="stats.activeKey"
          @tabChange="onTabChange"
        >
         <Transfer :show-select-all="false" >
          <template #children="{direction,selectedKeys,onItemSelectAll}">
            <BasicTable  
              v-if="direction === 'left'" 
              :rowSelection="{ 
                columnWidth:'5px',
                type: 'checkbox',
                selectedRowKeys: stats.selectedRowKeys,
                onChange:(selectedRowKeys,selectedRows)=>{
                  stats.selectedRowKeys =selectedRowKeys,
                  onItemSelectAll(selectedRowKeys);
                  onTableChange(selectedKeys)
                }
              }"
              size="small"
              :isTreeTable="true"
              :striped="false"
              :defaultExpandAllRows= "true"
              :bordered="true"
              :showIndexColumn="false"
              :canResize="false"
              :pagination="false"
              :rowKey="stats.tabListTitle[stats.activeKey].rowKey"
              :api=stats.tabListTitle[stats.activeKey].api
              :columns=stats.tabListTitle[stats.activeKey].columns
              :searchInfo="{
                platformId:stats.data?.serverGbId,
                isOn:0,
                catalogId:isEmpty(defaultKey)?'':defaultKey[0]
              }"
            />
            <BasicTable  
              v-if="direction === 'right'" 
              :rowSelection="{ 
                columnWidth:'5px',
                type: 'checkbox',
                onChange:(selectedRowKeys,selectedRows)=>{
                  // 
                }
              }"
              size="small"
              :isTreeTable="true"
              :striped="false"
              :defaultExpandAllRows= "true"
              :bordered="true"
              :showIndexColumn="false"
              :canResize="false"
              :pagination="false"
              :rowKey="stats.tabListTitle[stats.activeKey].rowKey"
              :api=stats.tabListTitle[stats.activeKey].api
              :columns=stats.tabListTitle[stats.activeKey].columns
              :searchInfo="{
                platformId:stats.data?.serverGbId,
                isOn:1,
                catalogId:isEmpty(defaultKey)?'':defaultKey[0]
              }"
            />
          </template>
        </Transfer>
        </Card>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive,ref,unref,h,computed} from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { isEmpty } from '/@/utils/is';
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree';
  import { Tag ,Card,Transfer} from 'ant-design-vue';
  import {doPlatformCatalogTree,doPlatformGbChannelTree,doPlatformGbStreamTree} from '/@/api/video/platform';

  const { prefixCls } = useDesign('platform-join-model');
  const platformJoinTree = ref<Nullable<TreeActionType>>(null);
  const treeData = ref<TreeItem[]>([]);
  const defaultKey = ref([]) as any;



  const stats = reactive({
    data: {} as any,
    fieldNames:{
      key:"id",
      title:"name"
    },
    activeKey:"gbChannel",
    cardTabList:[
      {
        key: 'gbChannel',
        tab: '国标通道',
      },
      {
        key: 'gbStream',
        tab: '国标流',
      },
    ],
    selectedRowKeys:[] as any,
    tabListTitle:{
      gbChannel:{
        rowKey:'channelId',
        api: doPlatformGbChannelTree,
        columns:[
          {
            title: '通道编号',
            dataIndex: 'channelId',
            width: 10,
          },
          {
            title: '通道名称',
            dataIndex: 'name',
            width: 10,
          },
          {
            title: '通道状态',
            dataIndex: 'status',
            width: 10,
            customRender: ({ record }) => {
              const status = record.status;
              const enable = ~~status === 1;
              const color = enable ? 'green' : 'red';
              const text = enable ? '在线' : '离线';
              return h(Tag, { color: color }, () => text);
            },
          },
        ]
      },
      gbStream:{
        api: doPlatformGbStreamTree,
        columns:[
          {
            title: '流编号',
            dataIndex: 'channelId',
            width: 10,
          },
          {
            title: '流名称',
            dataIndex: 'name',
            width: 10,
          },
          {
            title: '通道状态',
            dataIndex: 'status',
            width: 10,
            customRender: ({ record }) => {
              const status = record.status;
              const enable = ~~status === 1;
              const color = enable ? 'green' : 'red';
              const text = enable ? '在线' : '离线';
              return h(Tag, { color: color }, () => text);
            },
          },
        ]
      },
    }
  });

  

  const fetch = async () => {
    treeData.value = (await doPlatformCatalogTree({platformId:stats.data?.serverGbId})) as unknown as TreeItem[];
    if (unref(treeData) && unref(treeData).length > 0) {
      defaultKey.value = [unref(treeData)[0]['id']];
      unref(platformJoinTree)?.setSelectedKeys(unref(defaultKey));
    }
  };

  const handleSelect = (_,info) => {
    defaultKey.value = [info.node.key];
  };

  const onTabChange = (key)=>{
    stats.activeKey = key;

  }

  const onTableChange = (selectedKeys)=>{
    console.log(selectedKeys);
    
  }


  const [registerModal] = useModalInner(async (data) => {
    console.log(data);
    if (!data) {
      return;
    }
    stats.data = data;
    fetch()
  });
</script>
<style lang="less">
 @prefix-cls: ~'@{namespace}-platform-join-model';


</style>