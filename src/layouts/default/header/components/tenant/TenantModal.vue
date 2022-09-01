<template>
  <BasicModal
    :footer="null"
    :title="t('layout.header.switchTenants')"
    v-bind="$attrs"
    :class="prefixCls"
    @register="register"
  >
    <div :class="`${prefixCls}__entry`">
      <BasicForm @register="registerForm" />
      <div :class="`${prefixCls}__footer`">
        <a-button type="primary" block class="mt-2" @click="handleSwitch">
          {{ t('layout.header.switch') }}
        </a-button>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, computed, reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { doTenantSelect } from '/@/api/sys/tenant';
  import { debounce } from 'lodash-es';
  import { BasicModal, useModalInner } from '/@/components/Modal/index';
  import { BasicForm, useForm } from '/@/components/Form/index';

  export default defineComponent({
    name: 'TenantModal',
    components: { BasicModal, BasicForm },

    setup() {
      const { t } = useI18n();
      const { prefixCls } = useDesign('header-lock-modal');
      const [register, { closeModal }] = useModalInner();
      const state = reactive({
        tenantName: '',
      });

      const searchParams = computed<Recordable>(() => {
        const searchName = { tenantName: state.tenantName, limit: 20 };
        return searchName;
      });

      const onTenantSearch = debounce((value) => {
        state.tenantName = value;
      }, 300);

      const handleSelectChange = () => {
        state.tenantName = '';
      };

      const [registerForm, { validateFields, resetFields }] = useForm({
        showActionButtonGroup: false,
        schemas: [
          {
            field: 'sysTenantId',
            label: t('layout.header.tenantName'),
            colProps: {
              span: 24,
            },
            component: 'ApiSelect',
            required: true,
            componentProps: {
              api: doTenantSelect,
              filterable: true,
              multiple: true,
              allowCreate: true,
              showSearch: true,
              filterOption: false,
              params: searchParams,
              onSearch: onTenantSearch,
              onChange: handleSelectChange,
              labelField: 'name',
              valueField: 'id',
            },
          },
        ],
      });

      const handleSwitch = () => {
        closeModal();
      };

      return {
        t,
        prefixCls,
        register,
        registerForm,
        handleSwitch,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-header-lock-modal';

  .@{prefix-cls} {
    &__entry {
      position: relative;
      //height: 240px;
      padding: 0 30px;
      border-radius: 10px;
    }

    &__header {
      position: absolute;
      top: 0;
      left: calc(50% - 45px);
      width: auto;
      text-align: center;

      &-img {
        width: 70px;
        border-radius: 50%;
      }

      &-name {
        margin-top: 5px;
      }
    }

    &__footer {
      text-align: center;
    }
  }
</style>
