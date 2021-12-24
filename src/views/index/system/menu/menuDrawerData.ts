import { FormSchema } from '/@/components/Form/index';
export const menuSchemas: FormSchema[] = [
  {
    field: 'id',
    show: false,
    component: 'Input',
    label: '菜单编号',
    colProps: {
      span: 24,
    },
    required: true,
  },
  {
    field: 'parentId',
    component: 'TreeSelect',
    label: '上级菜单',
    colProps: {
      span: 24,
    },
    componentProps: {
      fieldNames: {
        title: 'menuName',
        key: 'id',
        value: 'id',
      },
      showSearch: true,
    },
    defaultValue: '',
  },
  {
    field: 'level',
    component: 'Input',
    label: '级别',
    colProps: {
      span: 24,
    },
    required: true,
  },
  {
    field: 'menuName',
    component: 'Input',
    label: '菜单名称',
    colProps: {
      span: 24,
    },
    required: true,
  },
  {
    field: 'path',
    component: 'Input',
    label: '跳转路径',
    colProps: {
      span: 24,
    },
    required: true,
  },
  {
    field: 'viewPath',
    component: 'Input',
    label: '页面路径',
    colProps: {
      span: 24,
    },
    required: true,
  },
  {
    field: 'icon',
    component: 'IconPicker',
    required: true,
    label: '图标',
    colProps: {
      span: 24,
    },
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'isOpen',
    component: 'Switch',
    label: '是否开启',
    colProps: {
      span: 24,
    },
    defaultValue: true,
    required: true,
  },
  {
    field: 'hideMenu',
    component: 'Switch',
    label: '是否隐藏',
    colProps: {
      span: 24,
    },
    defaultValue: false,
    required: true,
  },
  {
    field: 'num',
    component: 'Input',
    label: '序号',
    colProps: {
      span: 24,
    },
    required: true,
  },
  {
    field: 'memo',
    component: 'Input',
    label: '备注',
    colProps: {
      span: 24,
    },
  },
];

export const privilegeSchemas: FormSchema[] = [
  {
    field: 'id',
    show: false,
    component: 'Input',
    label: '权限编号',
    colProps: {
      span: 24,
    },
    required: true,
  },
  {
    field: 'menuId',
    component: 'TreeSelect',
    label: '菜单编号',
    colProps: {
      span: 24,
    },
    componentProps: {
      fieldNames: {
        title: 'menuName',
        key: 'id',
        value: 'id',
      },
      showSearch: true,
    },
    required: true,
    defaultValue: '',
  },
  {
    field: 'requestUrl',
    component: 'Input',
    label: '请求路径',
    colProps: {
      span: 24,
    },
    required: true,
  },
  {
    field: 'isOpen',
    component: 'Switch',
    label: '是否开启',
    colProps: {
      span: 24,
    },
    defaultValue: true,
    required: true,
  },
  {
    field: 'memo',
    component: 'Input',
    label: '备注',
    colProps: {
      span: 24,
    },
  },
];
