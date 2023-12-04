<template>
  <Transfer
    :rowKey="(record)=>(record[stats.tabListTitle[props.activeKey].rowKey])"
    :target-keys="stats.useCatalogGbIdList" 
    :show-select-all="false" 
    :data-source="stats.dataData"
    @change="onChange"
  >
    <template #children="{direction,disabled:listDisabled,selectedKeys,filteredItems,onItemSelect,onItemSelectAll}">
      <BasicTable  
        :row-selection="onRowSelection(direction,listDisabled,selectedKeys,onItemSelect,onItemSelectAll)"
        :data-source="(direction=='left'?buildTree(tableData):buildTree(filteredItems))"
        :rowKey="stats.tabListTitle[props.activeKey].rowKey"
        :columns=stats.tabListTitle[props.activeKey].columns
        size="small"
        :isTreeTable="true"
        :striped="false"
        :bordered="true"
        :showIndexColumn="false"
        :canResize="false"
        :pagination="false"
      />
    </template>
  </Transfer>
</template>
<script lang="ts" setup>
  import { reactive,h,computed,onMounted,watch} from 'vue';
  import { BasicTable } from '@/components/Table';
  import { Tag,Transfer } from 'ant-design-vue';
  import { isEmpty } from '@/utils/is';
  import {
    doPlatformGbChannelList,
    doPlatformChannelBindKey,
    doPlatformGbChannelInsert,
    doPlatformGbChannelDelete,
    doPlatformGbStreamList,
    doPlatformStreamBindKey,
    doPlatformGbStreamInsert,
    doPlatformGbStreamDelete
  } from '@/api/video/platform';

  const props = defineProps({
    serverGbId: {
      type: String,
    },
    activeKey: {
      type: String,
      default: '',
    },
    catalogId: {
      type: String,
      default: '',
    },
  });


  const stats  = reactive({
    allGbIdList:[],
    useCatalogGbIdList:[],
    dataData:[],
    tabListTitle:{
      gbChannel:{
        rowKey:'id',
        apiList: doPlatformGbChannelList,
        apiBind: doPlatformChannelBindKey,
        apiInsert:doPlatformGbChannelInsert,
        apiDelete:doPlatformGbChannelDelete,
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
        rowKey:'gbId',
        apiList: doPlatformGbStreamList,
        apiBind: doPlatformStreamBindKey,
        apiInsert:doPlatformGbStreamInsert,
        apiDelete:doPlatformGbStreamDelete,
        columns:[
          {
            title: '国标编号',
            dataIndex: 'gbId',
            width: 10,
          },
          {
            title: '流名称',
            dataIndex: 'name',
            width: 10,
          },
          {
            title: '应用名',
            dataIndex: 'app',
            width: 10,
          },
          {
            title: '流编号',
            dataIndex: 'stream',
            width: 10,
          },
        ]
      },
    }
  })

  const onChange = async (targetKeys,direction,moveKeys) => {
    const obj = stats.tabListTitle[props.activeKey] as any;
    if(direction === 'left'){
     await obj.apiDelete({
        platformId:props.serverGbId,
        catalogId:props.catalogId,
        isSub:0,
        isAll:0,
        gbIdList:moveKeys,
      })
    }else{
      await obj.apiInsert({
        platformId:props.serverGbId,
        catalogId:props.catalogId,
        isSub:0,
        isAll:0,
        gbIdList:moveKeys
      })
    }
    refresh();
  };

  const tableData = computed(() => {
    return handleTreeData(stats.dataData,stats.allGbIdList);
  });

  //转换eTreeData
  const handleTreeData = (data, targetKeys) => {
    let tree = data.map((item) => {
      let tree1 = undefined;
      if (item.children) {
        tree1 = handleTreeData(item.children, targetKeys);
      }
      return { ...item, disabled: targetKeys.includes(item[stats.tabListTitle[props.activeKey].rowKey]), children: tree1 };
    });
    return tree;
  };

  const buildTree = (data,parentId =null) =>{
    const tree = [] as Array<Object>;
    data.forEach(item => {
      if(!item.hasOwnProperty('parentId')){
        tree.push(item);
      }else if(item?.parentId == parentId){
        const children = buildTree(data, item[stats.tabListTitle[props.activeKey].rowKey]);
        if (children.length) {
          item.children = children;
        }
        tree.push(item);
      }
    });
    return tree;
  }

  const onRowSelection = (direction,listDisabled,selectedKeys,onItemSelect,onItemSelectAll) =>{
    return {
      checkStrictly:false,
      columnWidth:'5px',
      selectedRowKeys: (direction=='left'?[...selectedKeys,...stats.useCatalogGbIdList]:selectedKeys),
      getCheckboxProps: (item) => ({
        disabled: item.disabled,
      }),
      onSelect( _ , selected,selectedAllRows) {
        const treeSelectedKeys = selectedAllRows.filter(item => !item.disabled).map(( val ) => val[stats.tabListTitle[props.activeKey].rowKey]);
        onItemSelectAll(treeSelectedKeys, selected);
      },
      onSelectAll(selected, selectedAllRows) {
        const treeSelectedKeys = selectedAllRows.filter(item => !item.disabled).map(( val ) => val[stats.tabListTitle[props.activeKey].rowKey]);
        onItemSelectAll(treeSelectedKeys, selected);
      }
    }
  }

  const fetchList = async (activeKey)=>{
    if(isEmpty(activeKey)){
      return;
    } 
    stats.dataData = [];
    stats.allGbIdList=[];
    stats.useCatalogGbIdList=[];
    const obj = stats.tabListTitle[activeKey] as any;
    stats.dataData = await obj.apiList();
  }

  const fetchBind = async (activeKey)=>{
    if( isEmpty(activeKey) || isEmpty(props.serverGbId) || isEmpty(props.catalogId)){
      return;
    }
    const obj = stats.tabListTitle[activeKey] as any;
    const {allGbIdList,useCatalogGbIdList} = await obj.apiBind({
      platformId:props.serverGbId,
      catalogId:props.catalogId,
      isSub:0,
    });
    stats.allGbIdList=allGbIdList;
    stats.useCatalogGbIdList=useCatalogGbIdList;
  }

  const refresh = () =>{
    fetchList(props.activeKey);
    fetchBind(props.activeKey);
  }

  watch(() => props.activeKey,
    () => {
      fetchList(props.activeKey);
      fetchBind(props.activeKey);
    },
  );
  watch(() => props.catalogId,
    () => {
      fetchBind(props.activeKey);
    },
  );

  

  onMounted(()=>{
    fetchList(props.activeKey);
  })
  defineExpose({ refresh });
</script>