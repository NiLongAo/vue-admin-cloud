<template>
  <Transfer
    :rowKey="(record)=>(record[stats.tabListTitle[props.activeKey].rowKey])"
    :target-keys="stats.idList" 
    :show-select-all="false" 
    :data-source="dataSource"
    @change="onChange"
  >
    <template #children="{direction,disabled:listDisabled,selectedKeys,filteredItems,onItemSelect,onItemSelectAll}">
      <BasicTable  
        :row-selection="onRowSelection(direction,listDisabled,selectedKeys,onItemSelect,onItemSelectAll)"
        :data-source="(direction=='left'?tableData:buildTree(filteredItems))"
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
  import { BasicTable } from '/@/components/Table';
  import { Tag,Transfer } from 'ant-design-vue';
  import { isEmpty } from '/@/utils/is';
  import {
    doPlatformGbChannelList,
    doPlatformChannelBindKey,
    doPlatformGbStreamList,
    doPlatformStreamBindKey
  } from '/@/api/video/platform';

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
  })

  const onChange = (keys) => {
    stats.idList = keys;
    
    console.log(keys);
  };

  //数据转换
  const dataSource = computed(() => {
    const data = handleSourceData(stats.dataData);
    return data;
  });

  const tableData = computed(() => {
    return handleTreeData(stats.dataData,stats.idList);
  });

  //转换eTreeData
  const handleSourceData = (data) => {
    const transferDataSource = [] as any;
    data.map((item) => {
      const { children, ...obj } = item;
      let entity = [];
      if (children) {
        entity = handleSourceData(children);
      }
      transferDataSource.push(obj, ...entity);
    });
    
    return transferDataSource;
  };

  //转换eTreeData
  const handleTreeData = (data, targetKeys) => {
    let tree = data.map((item) => {
      let tree1 = undefined;
      if (item.children) {
        tree1 = handleTreeData(item.children, targetKeys);
      }
      return { ...item, disabled: targetKeys.includes(item.id), children: tree1 };
    });
    return tree;
  };

  const buildTree = (data,parentId =null) =>{
    const tree = [] as Array<Object>;
    data.forEach(item => {
      if(item.hasOwnProperty('parentId') && item?.parentId == parentId){
        const children = buildTree(data, item.id);
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
      selectedRowKeys: (direction=='left'?[...selectedKeys,...stats.idList]:selectedKeys),
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
    const obj = stats.tabListTitle[activeKey] as any;
    stats.dataData = await obj.apiList()
  }

  const fetchBind = async (activeKey)=>{
    if( isEmpty(activeKey) || isEmpty(props.serverGbId) || isEmpty(props.catalogId)){
      return;
    }
    const obj = stats.tabListTitle[activeKey] as any;
    stats.idList = await obj.apiBind({
      platformId:props.serverGbId,
      catalogId:props.catalogId,
      isSub:1,
    });
  }
  watch(() => props.activeKey,
    () => {
      fetchList(props.activeKey);
      
    },
  );
  watch(() => props.catalogId,
    () => {
      fetchBind(props.activeKey);
    },
  );
  onMounted(()=>{
    fetchList(props.activeKey);
    fetchBind(props.activeKey);
  })

</script>