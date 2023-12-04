import { FormSchema } from '@/components/Form/index';
import { useSystemStore } from '@/store/modules/system';
import { isPhone, isIdCard } from '@/utils/validate';

const systemStore = useSystemStore();
// tab的list
export const settingUpdateList = [
  {
    key: '1',
    name: '基本设置',
    component: 'BaseSetting',
  },
  {
    key: '2',
    name: '身份设置',
    component: 'SecureSetting',
  },
  {
    key: '3',
    name: '账号绑定',
    component: 'AccountBind',
  },
  {
    key: '4',
    name: '新消息通知',
    component: 'MsgNotify',
  },
];

export const settingInsertList = [
  {
    key: '1',
    name: '基本设置',
    component: 'BaseSetting',
  },
];

// 基础设置 form
export const baseSetschemas: FormSchema[] = [
  {
    field: 'id',
    show: false,
    component: 'Input',
    label: '编号',
    colProps: {
      span: 18,
    },
  },
  {
    field: 'imageUrl',
    show: false,
    component: 'Input',
    label: '图像地址',
    colProps: {
      span: 18,
    },
  },
  {
    field: 'userName',
    component: 'Input',
    label: '用户名',
    colProps: {
      span: 18,
    },
    required: true,
  },
  {
    field: 'nickName',
    component: 'Input',
    label: '昵称',
    colProps: {
      span: 18,
    },
  },
  {
    field: 'phone',
    component: 'Input',
    label: '手机号',
    colProps: {
      span: 18,
    },
    rules: [
      {
        required: true,
        message: '手机号格式错误',
        validator(_, value) {
          if (!isPhone(value)) {
            return Promise.reject('值不能为空');
          }
          return Promise.resolve();
        },
      },
    ],
  },
  {
    field: 'gender',
    component: 'RadioGroup',
    label: '性别',
    colProps: {
      span: 18,
    },
    componentProps: {
      options: [
        {
          label: '男',
          value: 1,
        },
        {
          label: '女',
          value: 2,
        },
        {
          label: '隐藏',
          value: 0,
        },
      ],
    },
  },
  {
    field: 'idCard',
    component: 'Input',
    label: '身份证',
    colProps: {
      span: 18,
    },
    rules: [
      {
        required: true,
        message: '身份证格式错误',
        validator(_, value) {
          if (!isIdCard(value)) {
            return Promise.reject('值不能为空');
          }
          return Promise.resolve();
        },
      },
    ],
  },
  {
    field: 'isAdmin',
    component: 'Switch',
    label: '是否系统管理员',
    colProps: {
      span: 18,
    },
  },
  {
    field: 'isEnabled',
    component: 'Switch',
    label: '启用状态',
    colProps: {
      span: 18,
    },
  },
  {
    field: 'areaList',
    component: 'Cascader',
    label: '地址',
    colProps: {
      span: 18,
    },
    componentProps: {
      options: systemStore.getAreaList,
      showSearch: true,
    },
    defaultValue: [],
  },
  {
    field: 'memo',
    component: 'InputTextArea',
    label: '备注',
    colProps: {
      span: 18,
    },
  },
];

// 基础设置 form
export const insertSetschemas: FormSchema[] = [
  {
    field: 'loginAccount',
    component: 'Input',
    label: '账户',
    colProps: {
      span: 18,
    },
    required: true,
  },
  {
    field: 'password',
    component: 'Input',
    label: '密码',
    colProps: {
      span: 18,
    },
    componentProps: {
      options: systemStore.getAreaList,
      showSearch: true,
    },
    required: true,
  },
  {
    field: 'imageUrl',
    show: false,
    component: 'Input',
    label: '图像地址',
    colProps: {
      span: 18,
    },
  },
  {
    field: 'userName',
    component: 'Input',
    label: '用户名',
    colProps: {
      span: 18,
    },
    required: true,
  },
  {
    field: 'nickName',
    component: 'Input',
    label: '昵称',
    colProps: {
      span: 18,
    },
  },
  {
    field: 'phone',
    component: 'Input',
    label: '手机号',
    colProps: {
      span: 18,
    },
    rules: [
      {
        required: true,
        message: '手机号格式错误',
        validator(_, value) {
          if (!isPhone(value)) {
            return Promise.reject('值不能为空');
          }
          return Promise.resolve();
        },
      },
    ],
  },
  {
    field: 'gender',
    component: 'RadioGroup',
    label: '性别',
    colProps: {
      span: 18,
    },
    componentProps: {
      options: [
        {
          label: '男',
          value: 1,
        },
        {
          label: '女',
          value: 2,
        },
        {
          label: '隐藏',
          value: 0,
        },
      ],
    },
  },
  {
    field: 'idCard',
    component: 'Input',
    label: '身份证',
    colProps: {
      span: 18,
    },
    rules: [
      {
        required: true,
        message: '身份证格式错误',
        validator(_, value) {
          if (!isIdCard(value)) {
            return Promise.reject('值不能为空');
          }
          return Promise.resolve();
        },
      },
    ],
  },
  {
    field: 'isAdmin',
    component: 'Switch',
    label: '是否系统管理员',
    colProps: {
      span: 18,
    },
    defaultValue: true,
  },
  {
    field: 'isEnabled',
    component: 'Switch',
    label: '启用状态',
    colProps: {
      span: 18,
    },
  },
  {
    field: 'areaList',
    component: 'Cascader',
    label: '地址',
    colProps: {
      span: 18,
    },
    componentProps: {
      options: systemStore.getAreaList,
      showSearch: true,
    },
    defaultValue: [],
  },
  {
    field: 'memo',
    component: 'InputTextArea',
    label: '备注',
    colProps: {
      span: 18,
    },
  },
];
