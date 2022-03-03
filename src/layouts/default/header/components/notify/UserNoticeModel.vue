<template>
  <BasicModal v-bind="$attrs" @register="registerBasicModal" :title="stats.data?.title">
    <div>测试</div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, reactive, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { doConfigDetail } from '/@/api/sys/config';
  import { MINIO_PATH } from '/@/enums/commonEnum';
  import { PublicNoticeEntity } from '/@/api/notice/model/publicNoticeModel';

  const stats = reactive({
    //传过来的数据
    data: {} as PublicNoticeEntity,
    path: '',
  });
  const [registerBasicModal] = useModalInner(async (data) => {
    stats.data = data;
    const model = await doConfigDetail({ k: MINIO_PATH });
    stats.path = model.v;
  });
</script>
