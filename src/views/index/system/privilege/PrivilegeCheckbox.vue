<template>
  <div class="m-4 bg-white flex flex-col">
    <div class="justify-end">
      <a-button
        class="float-right mt-4 mr-4"
        type="primary"
        @click="handleSave"
        v-if="hasPermission('system.privilege:save')"
      >
        保存
      </a-button>
    </div>
    <ScrollContainer class="grow overflow-hidden">
      <MyCheckBox :treeData="tree" @subset="handleSubsetChange" />
    </ScrollContainer>
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref, watch } from 'vue';
  import { CheckboxGroupEntity } from './model/privilege';
  import { usePermission } from '@/hooks/web/usePermission';
  import { ScrollContainer } from '@/components/Container/index';
  import MyCheckBox from './MyCheckBox.vue';

  const { hasPermission } = usePermission();
  const props = defineProps({
    treeData: {
      type: Array as PropType<CheckboxGroupEntity[]>,
      default: () => [
        // {
        //   k: '选项A',
        //   type: 1,
        //   v: 'A',
        //   children: [
        //     {
        //       k: '选项B',
        //       type: 2,
        //       v: 'B',
        //       children: [
        //         {
        //           k: '选项E',
        //           type: 3,
        //           v: 'E',
        //           children: [],
        //         },
        //         {
        //           k: '选项F',
        //           type: 3,
        //           v: 'F',
        //           children: [],
        //         },
        //       ],
        //     },
        //     {
        //       k: '选项C',
        //       type: 2,
        //       v: 'C',
        //       children: [
        //         {
        //           k: '选项D',
        //           type: 3,
        //           v: 'D',
        //           children: [],
        //         },
        //         {
        //           k: '选项J',
        //           type: 3,
        //           v: 'J',
        //           children: [],
        //         },
        //       ],
        //     },
        //   ],
        // },
      ],
    },
    checkedList: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  });
  const emit = defineEmits(['save']);
  const checkList = ref(props.checkedList);
  const dataTree = ref();
  const tree = ref(props.treeData);
  const last = ref();
  const onInit = () => {
    //给子级添加父级Key
    //深度克隆
    const lastv = [] as string[];
    const data = JSON.parse(JSON.stringify(props.treeData)) as CheckboxGroupEntity[];
    function addParentKey(data, parentKey) {
      data.forEach((ele) => {
        const { children, v } = ele;
        ele.parentId = parentKey;
        ele.indeterminate = false;
        ele.checked = false;
        if (children) {
          //如果唯一标识不是code可以自行改变
          addParentKey(children, ele.v);
        } else {
          lastv.push(v);
          last.value = lastv;
        }
      });
    }
    addParentKey(data, null); //一开始为null,根节点没有父级
    dataTree.value = data;
    tree.value = unref(dataTree);
  };
  //切换权限监控
  watch(
    () => props.checkedList,
    (checkedList) => {
      checkList.value = checkedList;
      //递归循环
      checkList.value.forEach((obj) => {
        loops(dataTree.value, true, obj);
        tree.value = dataTree.value;
      });
    },
  );

  //切换权限监控
  watch(
    () => props.treeData,
    (data) => {
      tree.value = data;
      onInit();
    },
  );
  //点击复选框触发
  const handleSubsetChange = async (val) => {
    const { flag, v } = val;
    await loops(dataTree.value, flag, v);
    tree.value = dataTree.value;
  };

  //递归循环
  const loops = (data: CheckboxGroupEntity[], flag, v) => {
    data.map((item) => {
      if (item.v === v) {
        item.checked = flag;
        item.indeterminate = false;
        //取消选中时数组中驱除元素
        shuzulist(flag, item.v);
        if (item.parentId) {
          //子级选中父级也选中
          let childAndParent_Select = (code) => {
            let parent = getItem(code) as CheckboxGroupEntity;
            if (parent.children && parent.children.length > 0) {
              let all = parent.children.every((item1) => {
                return item1.checked == true && item1.indeterminate == false;
              });
              let some = parent.children.some((item1) => {
                return item1.checked == true || item1.indeterminate == true;
              });
              if (all) {
                parent.indeterminate = false;
                parent.checked = true;
                //取消选中时数组中驱除元素
                shuzulist(true, parent.v);
              } else if (some) {
                parent.indeterminate = true;
                parent.checked = false;
                shuzulist(false, parent.v);
              } else {
                parent.indeterminate = false;
                parent.checked = false;
                shuzulist(false, parent.v);
              }
            }
            if (parent.parentId) {
              childAndParent_Select(parent.parentId);
            }
          };
          childAndParent_Select(item.parentId);
        }
        if (item.children && item.children.length > 0) {
          //父亲选中，子级全选中，实现全选反选
          let parentAndChild_Select = (data, flag) => {
            data.map((item1) => {
              item1.checked = flag;
              item1.indeterminate = false;
              shuzulist(flag, item1.v);
              if (item1.children && item1.children.length > 0) {
                parentAndChild_Select(item1.children, flag);
              }
            });
          };
          parentAndChild_Select(item.children, flag);
        }
      }

      if (item.children && item.children.length > 0) {
        loops(item.children, flag, v);
      }
    });
  };

  //根据code(唯一标识)找到其值
  const getItem = (code) => {
    let value;
    let loops = (data, code) => {
      data.map((item) => {
        if (item.v == code) {
          value = item;
        }
        if (item.children && item.children.length > 0) {
          loops(item.children, code);
        }
      });
    };
    loops(unref(dataTree), code);
    return value;
  };

  //数组新增元素删除元素去重
  const shuzulist = (flag, v) => {
    if (!flag) {
      let cheList = Array.from(new Set(unref(checkList)));
      //元素是否存在数组
      if (cheList.indexOf(v) != -1) {
        cheList.splice(
          cheList.findIndex((o) => o === v),
          1,
        );
        checkList.value = cheList;
      }
    } else {
      let cheList = Array.from(unref(checkList));
      cheList.push(v);
      let list = Array.from(new Set(unref(cheList)));
      checkList.value = list;
    }
  };

  //抛出选中数组方法
  const handleSave = () => {
    //只要最下级元素
    const resultArray = unref(checkList).filter((item) => unref(last).indexOf(item) > -1);
    emit('save', resultArray);
  };

  defineExpose({ onInit });
</script>
