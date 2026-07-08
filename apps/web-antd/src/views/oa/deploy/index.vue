<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button, message, Space } from 'ant-design-vue';

import {
  doDeployProcessParameter,
  doFindRepositoryXml,
} from '#/api/oa/activiti';
import BpmnActions from '#/components/Activiti/bpmn-actions';
import Modeler from '#/components/Activiti/Modeler';
import Panel from '#/components/Activiti/panel';

const route = useRoute();
const router = useRouter();
const bpmnActions = ref<any>();

const formData = reactive({
  id: String(route.params?.id ?? ''),
  xml: '',
});

async function init() {
  if (formData.id && formData.id !== 'undefined') {
    formData.xml =
      (await doFindRepositoryXml({
        processDefinitionId: formData.id,
      })) ?? '';
  }
}

function goBack() {
  router.push('/oa/repository');
}

async function deploy() {
  const modelerActions = bpmnActions.value;
  if (!modelerActions) {
    message.warning('流程设计器尚未初始化');
    return;
  }

  const { id, name, xml } = await modelerActions.getXml();
  if (!id || !xml) {
    message.warning('请先完善流程定义');
    return;
  }

  await doDeployProcessParameter({
    id: `${id}.bpmn`,
    name: name || id,
    xml,
  });
  message.success('部署成功');
  goBack();
}

onMounted(init);
</script>

<template>
  <Page
    auto-content-height
    content-class="flex min-h-0 flex-col overflow-hidden bg-background-deep p-0"
    title="流程实例部署"
  >
    <div class="relative min-h-0 flex-1 overflow-hidden bg-background">
      <Modeler :xml="formData.xml" />
      <Panel />
      <BpmnActions ref="bpmnActions" />
    </div>
    <div class="border-t border-border bg-background px-4 py-3">
      <Space class="w-full justify-end">
        <Button @click="goBack">取消</Button>
        <Button
          v-access:code="'oa.deploy:deploy'"
          type="primary"
          @click="deploy"
        >
          部署
        </Button>
      </Space>
    </div>
  </Page>
</template>
