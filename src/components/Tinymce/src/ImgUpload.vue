<template>
  <div :class="[prefixCls, { fullscreen }]">
    <Upload
      name="file"
      multiple
      @change="handleChange"
      :data="{ type: 4 }"
      :action="uploadUrl"
      :headers="stats.headers"
      :showUploadList="false"
      accept=".jpg,.jpeg,.gif,.png,.webp"
    >
      <a-button type="primary" v-bind="{ ...getButtonProps }">
        {{ t('component.upload.imgUpload') }}
      </a-button>
    </Upload>
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed, reactive, watch, unref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Upload } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'TinymceImageUpload',
    components: { Upload },
    props: {
      fullscreen: {
        type: Boolean,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['uploading', 'done', 'error'],
    setup(props, { emit }) {
      const { createMessage } = useMessage();
      const error = createMessage.error!;
      const stats = reactive<Recordable>({});
      let uploading = false;
      const userStore = useUserStore();
      const { uploadUrl } = useGlobSetting();
      const { t } = useI18n();
      const { prefixCls } = useDesign('tinymce-img-upload');
      watch(
        () => userStore.getToken,
        () => {
          if (userStore.getToken) {
            stats.headers = { Authorization: 'Bearer ' + userStore.getToken };
          }
        },
        { immediate: true },
      );

      const getButtonProps = computed(() => {
        const { disabled } = props;
        return {
          disabled,
        };
      });

      function handleChange(info: Recordable) {
        const file = info.file;
        const status = file?.status;
        const name = file?.name;
        if (status === 'uploading') {
          if (!uploading) {
            emit('uploading', name);
            uploading = true;
          }
        } else if (status === 'done') {
          const response = unref(file?.response);
          console.log(response?.code);
          if (response?.code != 0) {
            error('上传图片失败');
            uploading = false;
            return;
          }
          const url = response?.data[0].fullPath;
          emit('done', name, url);
          uploading = false;
        } else if (status === 'error') {
          emit('error');
          uploading = false;
        }
      }

      return {
        prefixCls,
        handleChange,
        uploadUrl,
        stats,
        t,
        getButtonProps,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-tinymce-img-upload';

  .@{prefix-cls} {
    position: absolute;
    top: 4px;
    right: 10px;
    z-index: 20;

    &.fullscreen {
      position: fixed;
      z-index: 10000;
    }
  }
</style>
