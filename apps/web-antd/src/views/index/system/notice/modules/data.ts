import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PublicNoticeEntity } from '#/api/notice/publicNotice';

import { h, markRaw } from 'vue';

import { useAccess } from '@vben/access';
import { VbenTiptap } from '@vben/plugins/tiptap';

import { Tag } from 'ant-design-vue';

import { uploadNoticeRichTextImage } from './richTextImageUpload';

const { hasAccessByCodes } = useAccess();
const NoticeRichTextEditor = markRaw(VbenTiptap);

const unknownNoticeTypeOption: OptionItem = {
  color: 'default',
  label: '未知类型',
  value: 0,
};

const expiredNoticeStatusOption: OptionItem = {
  color: 'red',
  label: '已过期',
  value: 2,
};

const noticeTypeOptions: OptionItem[] = [
  { color: 'blue', label: '系统公告', value: 1 },
  unknownNoticeTypeOption,
];

const noticeStatusOptions: OptionItem[] = [
  { color: 'green', label: '正常', value: 1 },
  expiredNoticeStatusOption,
];

interface OptionItem {
  color: string;
  label: string;
  value: number;
}

function getNoticeTypeOption(type?: number | string): OptionItem {
  const typeValue = Number(type ?? 0);
  return (
    noticeTypeOptions.find((item) => item.value === typeValue) ??
    unknownNoticeTypeOption
  );
}

function getNoticeStatusOption(status?: number | string): OptionItem {
  const statusValue = Number(status ?? 1);
  return (
    noticeStatusOptions.find((item) => item.value === statusValue) ??
    expiredNoticeStatusOption
  );
}

function getNoticeTypeSelectOptions() {
  return noticeTypeOptions
    .filter((item) => item.value !== 0)
    .map(({ label, value }) => ({ label, value }));
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getNoticeTypeSelectOptions(),
        placeholder: '请选择通知类型',
      },
      fieldName: 'noticeType',
      label: '通知类型',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: noticeStatusOptions.map(({ label, value }) => ({
          label,
          value,
        })),
        placeholder: '请选择状态',
      },
      fieldName: 'status',
      label: '状态',
    },
    {
      component: 'DatePicker',
      componentProps: {
        class: 'w-full',
        showTime: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      fieldName: 'beginTime',
      label: '开始时间',
    },
    {
      component: 'DatePicker',
      componentProps: {
        class: 'w-full',
        showTime: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      fieldName: 'endTime',
      label: '结束时间',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入标题',
      },
      fieldName: 'title',
      label: '标题',
    },
  ];
}

export function useColumns<T = PublicNoticeEntity>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      fixed: 'left',
      title: '编号',
      width: 90,
    },
    {
      field: 'title',
      fixed: 'left',
      minWidth: 240,
      showOverflow: true,
      title: '标题',
    },
    {
      align: 'center',
      field: 'noticeType',
      slots: {
        default: ({ row }) => {
          const option = getNoticeTypeOption(row.noticeType);
          return h(Tag, { color: option.color }, () => option.label);
        },
      },
      title: '通知类型',
      width: 120,
    },
    {
      field: 'beginTime',
      minWidth: 170,
      showOverflow: true,
      title: '开始时间',
    },
    {
      field: 'endTime',
      minWidth: 170,
      showOverflow: true,
      title: '结束时间',
    },
    {
      align: 'center',
      field: 'status',
      slots: {
        default: ({ row }) => {
          const option = getNoticeStatusOption(row.status);
          return h(Tag, { color: option.color }, () => option.label);
        },
      },
      title: '状态',
      width: 110,
    },
    {
      field: 'createTime',
      minWidth: 170,
      showOverflow: true,
      sortable: true,
      title: '创建时间',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'title',
          nameTitle: '公告',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            show: () => hasAccessByCodes(['system.notice:update']),
          },
          {
            code: 'delete',
            show: () => hasAccessByCodes(['system.notice:delete']),
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 140,
    },
  ];
}

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Select',
      componentProps: {
        options: getNoticeTypeSelectOptions(),
        placeholder: '请选择通知类型',
      },
      defaultValue: 1,
      fieldName: 'noticeType',
      label: '通知类型',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        maxlength: 100,
        placeholder: '请输入标题',
      },
      fieldName: 'title',
      label: '标题',
      rules: 'required',
    },
    {
      component: 'DatePicker',
      componentProps: {
        class: 'w-full',
        showTime: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      fieldName: 'beginTime',
      label: '公告开始时间',
      rules: 'required',
    },
    {
      component: 'DatePicker',
      componentProps: {
        class: 'w-full',
        showTime: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      fieldName: 'endTime',
      label: '公告结束时间',
      rules: 'required',
    },
    {
      component: NoticeRichTextEditor,
      componentProps: {
        imageUpload: {
          accept: 'image/*',
          maxSize: 5 * 1024 * 1024,
          upload: uploadNoticeRichTextImage,
        },
        maxHeight: 520,
        minHeight: 280,
        placeholder: '请输入公告内容',
        previewable: true,
      },
      fieldName: 'content',
      formItemClass: 'col-span-1 lg:col-span-2',
      label: '内容',
      modelPropName: 'modelValue',
      rules: 'required',
    },
  ];
}
