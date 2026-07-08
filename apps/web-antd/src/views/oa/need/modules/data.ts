import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ActivitiUserNeedEntity } from '#/api/oa/activiti';

import { h } from 'vue';

import { useAccess } from '@vben/access';

import { Tag } from 'ant-design-vue';

import { canClaimTask } from '#/views/work/oa/modules/workflow';

const { hasAccessByCodes } = useAccess();

function getComment(row: ActivitiUserNeedEntity, key: string) {
  return row.instanceComment?.[key] ?? row.tackComment?.[key] ?? '-';
}

function statusTag(row: ActivitiUserNeedEntity) {
  return h(Tag, { color: row.isSuspended ? 'red' : 'green' }, () =>
    row.isSuspended ? '挂起' : '启用',
  );
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入任务名称',
      },
      fieldName: 'name',
      label: '任务名称',
    },
  ];
}

export function useColumns<T = ActivitiUserNeedEntity>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'processDefinitionName',
      fixed: 'left',
      minWidth: 170,
      showOverflow: true,
      title: '流程定义名称',
    },
    {
      field: 'instanceName',
      minWidth: 180,
      showOverflow: true,
      title: '流程名称',
    },
    {
      field: 'taskName',
      minWidth: 160,
      showOverflow: true,
      title: '任务名称',
    },
    {
      field: 'departmentName',
      minWidth: 140,
      slots: {
        default: ({ row }) => getComment(row, 'departmentName'),
      },
      title: '发起部门',
    },
    {
      field: 'userName',
      minWidth: 140,
      slots: {
        default: ({ row }) => getComment(row, 'userName'),
      },
      title: '发起用户',
    },
    {
      field: 'isSuspended',
      minWidth: 100,
      slots: {
        default: ({ row }) => statusTag(row),
      },
      title: '状态',
    },
    {
      field: 'createTime',
      minWidth: 170,
      title: '创建时间',
    },
    {
      field: 'dueDate',
      minWidth: 170,
      title: '截至时间',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'instanceName',
          nameTitle: '待办流程',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'audit',
            text: '审核',
          },
          {
            code: 'detail',
            text: '查看',
          },
          {
            code: 'sign_for',
            show: (row: ActivitiUserNeedEntity) =>
              hasAccessByCodes(['oa.need:sign_for']) && canClaimTask(row),
            text: '签收',
          },
          {
            code: 'pending',
            show: () => hasAccessByCodes(['oa.need:pending']),
            text: (row: ActivitiUserNeedEntity) =>
              row.isSuspended ? '激活' : '挂起',
          },
          {
            code: 'reject',
            show: () => hasAccessByCodes(['oa.need:reject']),
            text: '驳回',
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 260,
    },
  ];
}
