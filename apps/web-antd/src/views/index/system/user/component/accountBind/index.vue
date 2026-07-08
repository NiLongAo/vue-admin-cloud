<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { TenantModel } from '#/api/sys/tenant';

import { computed } from 'vue';

import { useAccess } from '@vben/access';
import { confirm, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { doFindUserBind, doUnBindMiniWeb } from '#/api/sys/user';

import QrCodeBindModel from './QrCodeBindModel.vue';

type LoginType = 'wx_mini_user';
const { hasAccessByCodes } = useAccess();

const [QrCodeModal, formModalApi] = useVbenModal({
  connectedComponent: QrCodeBindModel,
  destroyOnClose: true,
});

const getBindIcon = computed(() => {
  return (loginType: LoginType) => {
    switch (loginType) {
      case 'wx_mini_user': {
        return 'ant-design:wechat-filled';
      }
      default: {
        return '';
      }
    }
  };
});
/**
 * 绑定，解绑
 */
const handleBind = async (res: any) => {
  switch (res.loginType) {
    case 'wx_mini_user': {
      if (res.isBind === 1) {
        await doUnBindMiniWeb();
        refreshGrid();
      } else {
        formModalApi.setData({ open: 1 }).open();
      }
      break;
    }
    default: {
      break;
    }
  }
};
/**
 * 表格操作按钮的回调函数
 */
function onActionClick({ code, row }: OnActionClickParams<TenantModel>) {
  switch (code) {
    case 'bind': {
      confirm(row.isBind === 1 ? '是否解绑账户' : '是否绑定账户')
        .then(() => {
          handleBind(row);
        })
        .catch(() => {
          message.error('用户取消操作');
        });

      break;
    }
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { type: 'seq', title: '序号', width: 80 },
      {
        field: 'menuName',
        title: '绑定账号信息',
        minWidth: 240,
        slots: { default: 'menuName' },
      },
      {
        field: 'image',
        cellRender: {
          name: 'CellImage',
        },
        title: '头像',
        minWidth: 160,
      },
      {
        field: 'isBind',
        cellRender: {
          name: 'CellTag',
          options: [
            {
              color: 'error',
              label: '否',
              value: 0,
            },
            {
              color: 'success',
              label: '是',
              value: 1,
            },
          ],
        },
        title: '是否绑定',
        minWidth: 160,
      },
      {
        align: 'center',
        cellRender: {
          name: 'CellOperation',
          attrs: {
            nameField: 'name',
            onClick: onActionClick,
          },
          options: [
            {
              code: 'bind',
              text: (row: any) => {
                return row.isBind === 1 ? '解绑' : '绑定';
              },
              show: () => {
                return hasAccessByCodes(['work.personal:other_save']);
              },
            },
          ],
        },
        field: 'operation',
        minWidth: 160,
        title: '操作',
      },
    ],
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async () => {
          return await doFindUserBind();
        },
      },
    },
    rowConfig: {
      keyField: 'loginType',
    },
    pagerConfig: {
      enabled: false,
    },
  } as VxeTableGridOptions,
});

/**
 * 刷新表格
 */
function refreshGrid() {
  gridApi.query();
}
</script>
<template>
  <div class="account-bind-panel">
    <Grid grid-class="p-0" table-title="账号绑定">
      <template #menuName="{ row }">
        <div class="flex w-full items-center justify-center gap-1">
          <div class="size-5 flex-shrink-0">
            <IconifyIcon :icon="getBindIcon(row.loginType)" class="size-full" />
          </div>
        </div>
      </template>
    </Grid>
    <QrCodeModal @success="refreshGrid" />
  </div>
</template>

<style scoped>
.account-bind-panel {
  width: 100%;
  min-height: 0;
}
</style>
