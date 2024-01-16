<template>
  <div>
    <BasicTable @register="registerTable" :rowSelection="{ type: 'checkbox' }">
      <template #authorizedType="{ record }">
        <Tag
          :key="index"
          color="green"
          v-for="(item, index) in record.authorizedGrantTypes.split(',')"
        >
          {{ systemStore.getDictMap[DITE_AUTHORIZED_KEY][item] }}
        </Tag>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('system.oauth_client:update'),
              icon: 'mdi:file-edit-outline',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('system.oauth_client:delete'),
              color: 'error',
              icon: 'mdi:delete-outline',
              popConfirm: {
                title: '是否删除？',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd" v-if="hasPermission('system.oauth_client:add')"
          >添加</a-button
        >
      </template>
    </BasicTable>
    <OauthClientDrawer @register="register" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, BasicColumn, FormProps, TableAction } from '@/components/Table';
  import { doOauthClientRemove, getOauthClientPage } from '@/api/sys/oauthClient';
  import { h } from 'vue';
  import { useSystemStore } from '@/store/modules/system';
  import { DITE_AUTHORIZED_KEY } from '@/enums/commonEnum';
  import { Tag } from 'ant-design-vue';
  import { useDrawer } from '@/components/Drawer';
  import OauthClientDrawer from './OauthClientDrawer.vue';
  import { usePermission } from '@/hooks/web/usePermission';
  const { hasPermission } = usePermission();
  const systemStore = useSystemStore();
  const [register, { openDrawer }] = useDrawer();

  const [registerTable, { reload }] = useTable({
    title: '客户端列表',
    api: getOauthClientPage,
    columns: getBasicColumns(),
    formConfig: getFormConfig(),
    bordered: true,
    useSearchForm: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'clientId',
    actionColumn: {
      width: 160,
      title: 'Action',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  function handleAdd() {
    openDrawer(true, { isUpdate: false, clientId: undefined });
  }
  function handleEdit(record: Recordable) {
    openDrawer(true, {
      isUpdate: true,
      clientId: record.clientId,
    });
  }
  const handleSuccess = () => {
    //刷新表单
    reload();
  };
  async function handleDelete(record: Recordable) {
    //删除
    await doOauthClientRemove({ clientId: record.clientId });
    //刷新表单
    reload();
  }

  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      autoSubmitOnEnter: true,
      schemas: [
        {
          field: `clientId`,
          label: `客户端ID`,
          component: 'Input',
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
        title: '客户端ID',
        dataIndex: 'clientId',
        fixed: 'left',
        width: 100,
      },
      {
        title: '资源id列表',
        dataIndex: 'resourceIds',
        fixed: 'left',
        width: 100,
      },
      {
        title: '客户端密钥',
        dataIndex: 'clientSecret',
        width: 100,
      },
      {
        title: '域',
        dataIndex: 'scope',
        width: 200,
      },
      {
        title: '授权方式',
        dataIndex: 'authorizedGrantTypes',
        width: 300,
        slots: { customRender: 'authorizedType' },
      },
      {
        title: '回调地址',
        dataIndex: 'webServerRedirectUri',
        width: 200,
      },
      {
        title: '权限列表',
        dataIndex: 'authorities',
        width: 200,
      },
      {
        title: '认证令牌时效(秒)',
        dataIndex: 'accessTokenValidity',
        width: 200,
      },
      {
        title: '刷新令牌时效(秒)',
        dataIndex: 'refreshTokenValidity',
        width: 200,
      },
      {
        title: '扩展信息',
        dataIndex: 'additionalInformation',
        width: 200,
      },
      {
        title: '是否自动放行',
        dataIndex: 'autoapprove',
        width: 200,
        customRender: ({ record }) => {
          const status = record.autoapprove;
          const enable = status === 'true';
          const color = enable ? 'green' : 'red';
          const text = enable ? '是' : '否';
          return h(Tag, { color: color }, () => text);
        },
      },
    ];
  }
</script>
