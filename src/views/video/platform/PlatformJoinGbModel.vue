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
         <Transfer 
         :show-select-all="false" 
         :data-source="stats.dataData"
         :target-keys="stats.idList"
         @change="onChange"
         >
          <template #children="{direction,disabled,selectedKeys,filteredItems,onItemSelect,onItemSelectAll}">
            <BasicTable  
              :rowSelection="getRowSelection(disabled,selectedKeys,onItemSelectAll,onItemSelect)"
              :data-source="(direction=='left'?stats.dataData:filteredItems)"
              :rowKey="stats.tabListTitle[stats.activeKey].rowKey"
              :columns=stats.tabListTitle[stats.activeKey].columns
              size="small"
              :isTreeTable="true"
              :striped="false"
              :defaultExpandAllRows= "true"
              :bordered="true"
              :showIndexColumn="false"
              :canResize="false"
              :pagination="false"
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
  import {
    doPlatformCatalogTree,
    doPlatformGbChannelList,
    doPlatformChannelBindKey,
    doPlatformGbStreamList,
    doPlatformStreamBindKey
  } from '/@/api/video/platform';

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
    idList:[],
    dataData:[],
    tabListTitle:{
      gbChannel:{
        rowKey:'id',
        apiList: doPlatformGbChannelList,
        apiBind: doPlatformChannelBindKey,
        columns:[
          {
            title: '通道编号',
            dataIndex: 'id',
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
        apiList: doPlatformGbStreamList,
        apiBind: doPlatformStreamBindKey,
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
    await onTabChange(stats.activeKey);
  };

  const handleSelect = (_,info) => {
    defaultKey.value = [info.node.key];
  };

  const onTabChange = async (key)=>{
    stats.activeKey = key;
    stats.dataData = await stats.tabListTitle[stats.activeKey].apiList()
    stats.idList = await stats.tabListTitle[stats.activeKey].apiBind({
      platformId:stats.data?.serverGbId,
      catalogId:(isEmpty(unref(defaultKey))?'':unref(defaultKey)[0]),
      isSub:1,
    });
  }

  const getRowSelection  = (disabled,selectedKeys,onItemSelectAll,onItemSelect)=>{
    return {
        type: 'checkbox',
        checkStrictly:false,
        columnWidth:'5px',
        getCheckboxProps: (item: Record<string, string | boolean>) => ({
          disabled: disabled || item.disabled,
        }),
        onSelectAll(selected: boolean, selectedRows: Record<string, string | boolean>[]) {
          const treeSelectedKeys = selectedRows.filter(item => !item.disabled).map(({ key }) => key);
          onItemSelectAll(treeSelectedKeys, selected);
        },
        onSelect({ key }: Record<string, string>, selected: boolean) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: selectedKeys,
      };
  }
  const onChange = (keys) => {
    stats.idList = keys;
  };

  const [registerModal] = useModalInner(async (data) => {
    console.log(data);
    if (!data) {
      return;
    }
    stats.data = data;
    await fetch();
  });
</script>
<style lang="less">
 @prefix-cls: ~'@{namespace}-platform-join-model';


</style>