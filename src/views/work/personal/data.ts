import { DescItem } from '/@/components/Description/index';

export const basicSchema: DescItem[] = [
  {
    field: 'userName',
    label: '用户名',
  },
  {
    field: 'nickName',
    label: '昵称',
  },
  {
    field: 'phone',
    label: '联系电话',
  },
  {
    field: 'gender',
    label: '性别',
    render: (curVal) => {
      return curVal === 1 ? '男' : curVal === 2 ? '女' : '保密';
    },
  },
  {
    field: 'idCard',
    label: '身份证号',
  },
  {
    field: 'address',
    label: '地址',
  },
  {
    field: 'memo',
    label: '备注',
  },
];
