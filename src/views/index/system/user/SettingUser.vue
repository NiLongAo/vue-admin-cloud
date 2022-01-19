<template>
  <div>
    <BasicModal
      v-bind="$attrs"
      @register="registerModal"
      destroyOnClose
      :title="getTitle"
      :showOkBtn="false"
      width="1000px"
    >
      <ScrollContainer>
        <div ref="wrapperRef" :class="prefixCls">
          <Tabs tab-position="left" :tabBarStyle="tabBarStyle">
            <template v-for="item in settingList" :key="item.key">
              <TabPane :tab="item.name">
                <component
                  :is="item.component"
                  :userId="userId"
                  :closeModal="closeModal"
                  :reload="reload"
                />
              </TabPane>
            </template>
          </Tabs>
        </div>
      </ScrollContainer>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref, computed } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import { ScrollContainer } from '/@/components/Container/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { settingUpdateList, settingInsertList } from './data';

  defineProps({
    reload: {
      type: Function,
    },
  });

  const prefixCls = ref('account-setting');
  const tabBarStyle = ref({ width: '220px' });
  const userId = ref(undefined);
  const isUpdate = ref(true);

  const settingList = computed(() => (!unref(isUpdate) ? settingInsertList : settingUpdateList));

  const getTitle = computed(() => (!unref(isUpdate) ? '新增用户信息' : '编辑用户信息'));

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      userId.value = data?.userId;
    } else {
      userId.value = undefined;
    }
  });
</script>

<script lang="ts">
  import { defineComponent } from 'vue';
  import BaseSetting from './BaseSetting.vue';
  import SecureSetting from './SecureSetting.vue';

  export default defineComponent({
    components: {
      TabPane: Tabs.TabPane,
      SecureSetting,
      BaseSetting,
    },
  });
</script>

<style lang="less">
  .account-setting {
    margin: 12px;
    background-color: @component-background;

    .base-title {
      padding-left: 0;
    }

    .ant-tabs-tab-active {
      background-color: @item-active-bg;
    }
  }
</style>
