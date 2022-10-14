<template>
  <div>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: record.isBind == 1 ? '解绑账户' : '绑定账户',
              popConfirm: {
                title: record.isBind == 1 ? '是否解绑账户' : '是否绑定账户',
                confirm: handleBind.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
  </div>
  <QrCodeBindModel @register="registerModal" @success="handleSuccess" />
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, BasicColumn, TableAction } from '/@/components/Table';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { Icon } from '/@/components/Icon';
  import { h } from 'vue';
  import { Tag, Avatar } from 'ant-design-vue';
  import { doFindUserBind, doUnBindMiniWeb } from '/@/api/sys/user';
  import { useModal } from '/@/components/Modal';

  type LoginType = 'wx_mini_user';

  const QrCodeBindModel = createAsyncComponent(() => import('./QrCodeBindModel.vue'));
  const [registerModal, { openModal, closeModal }] = useModal();

  const [registerTable, { reload }] = useTable({
    title: '账号绑定',
    api: doFindUserBind,
    columns: getBasicColumns(),
    pagination: false,
    striped: false,
    useSearchForm: false,
    showTableSetting: false,
    bordered: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: true,
    canResize: true,
    rowKey: 'loginType',
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  function getBasicColumns(): BasicColumn[] {
    return [
      {
        title: '绑定账号信息',
        dataIndex: 'menuName',
        fixed: 'left',
        width: 150,
        customRender: ({ record }) => {
          return h(Icon, { icon: getBindIcon(record.loginType), size: 32 });
        },
      },
      {
        title: '头像',
        dataIndex: 'image',
        width: 100,
        customRender: ({ record }) => {
          return h(Avatar, { src: record.image });
        },
      },
      {
        title: '是否绑定',
        dataIndex: 'isBind',
        width: 100,
        customRender: ({ record }) => {
          const status = record.isBind;
          const enable = ~~status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '是' : '否';
          return h(Tag, { color: color }, () => text);
        },
      },
    ];
  }

  const getBindIcon = (loginType: LoginType) => {
    switch (loginType) {
      case 'wx_mini_user':
        return 'ant-design:wechat-filled';
        break;
      default:
        break;
    }
  };

  const handleBind = async (res) => {
    switch (res.loginType) {
      case 'wx_mini_user':
        if (res.isBind == 1) {
          await doUnBindMiniWeb();
          reload();
        } else {
          openModal(true, { opne: 1 });
        }
        break;
      default:
        break;
    }
  };

  const handleSuccess = () => {
    closeModal();
    reload();
  };
</script>
