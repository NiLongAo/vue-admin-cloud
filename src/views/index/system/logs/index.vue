<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                ifShow: hasPermission('system.logs:detail'),
                icon: 'clarity:info-standard-line',
                tooltip: '详情',
                onClick: handleDetail.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <LogsDrawer @register="register" />
  </div>
</template>
<script lang="ts" setup>
  import LogsDrawer from './LogsDrawer.vue';
  import { BasicTable, useTable, BasicColumn, FormProps, TableAction } from '@/components/Table';
  import { doLogsPage } from '@/api/sys/logs';
  import { useDrawer } from '@/components/Drawer';
  import { useSystemStore } from '@/store/modules/system';
  import { LOGS_TYPE_ENUM } from '@/enums/commonEnum';
  import { h, computed } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { usePermission } from '@/hooks/web/usePermission';

  const { hasPermission } = usePermission();
  const [register, { openDrawer }] = useDrawer();
  const systemStore = useSystemStore();

  const logsEnum = computed(() => {
    const authorizedGrantTypes = systemStore.getDictMap[LOGS_TYPE_ENUM];
    const types = [] as any;
    Object.keys(authorizedGrantTypes).forEach((key) => {
      types.push({ label: authorizedGrantTypes[key], key: authorizedGrantTypes[key], value: key });
    });
    return types;
  });

  const [registerTable] = useTable({
    title: '系统日志',
    api: doLogsPage,
    columns: getBasicColumns(),
    formConfig: getFormConfig(),
    useSearchForm: true,
    bordered: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'id',
    defSort: {
      field: 'createTime',
      order: 'descend',
    },
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
    },
  });
  function handleDetail(record: Recordable) {
    openDrawer(true, {
      id: record.id,
    });
  }

  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      autoSubmitOnEnter: true,
      schemas: [
        {
          field: `type`,
          label: `日志类型`,
          component: 'Select',
          colProps: {
            xl: 6,
            xxl: 5,
          },
          componentProps: {
            options: logsEnum,
          },
        },
        {
          field: `ip`,
          label: `访问者ip`,
          component: 'Input',
          colProps: {
            xl: 6,
            xxl: 5,
          },
        },
        {
          field: `ipAttribution`,
          label: `网络地址`,
          component: 'Input',
          colProps: {
            xl: 6,
            xxl: 5,
          },
        },
        {
          field: `method`,
          label: `请求方式`,
          component: 'Input',
          colProps: {
            xl: 6,
            xxl: 5,
          },
        },
        {
          field: `api`,
          label: `访问接口`,
          component: 'Input',
          colProps: {
            xl: 6,
            xxl: 5,
          },
        },
        {
          field: `durationStart`,
          label: `开始持续时间`,
          component: 'InputNumber',
          colProps: {
            xl: 6,
            xxl: 5,
          },
        },
        {
          field: `durationEnd`,
          label: `持续时间结束`,
          component: 'InputNumber',
          colProps: {
            xl: 6,
            xxl: 5,
          },
        },
      ],
    };
  }

  function getBasicColumns(): BasicColumn[] {
    return [
      {
        title: '编号',
        dataIndex: 'id',
        fixed: 'left',
        width: 100,
      },
      {
        title: '日志类型',
        dataIndex: 'type',
        fixed: 'left',
        width: 100,
        customRender: ({ record }) => {
          const status = record.type;
          const enable = ~~status;
          const color = enable === 1 ? '#BBFF66' : enable === 2 ? '#FF8888' : '#FFDD55';
          return h(Tag, { color: color }, () => systemStore.getDictMap[LOGS_TYPE_ENUM][status]);
        },
      },
      {
        title: '访问者ip',
        dataIndex: 'ip',
        width: 100,
      },
      {
        title: '网络地址',
        dataIndex: 'ipAttribution',
        width: 100,
      },
      {
        title: '请求方式',
        dataIndex: 'method',
        width: 100,
      },
      {
        title: '访问接口',
        dataIndex: 'api',
        width: 200,
      },
      {
        title: '持续时间(ms)',
        dataIndex: 'duration',
        width: 100,
      },
      {
        title: '访问时间',
        width: 100,
        sorter: true,
        defaultSortOrder: 'descend',
        dataIndex: 'createTime',
      },
    ];
  }
</script>
