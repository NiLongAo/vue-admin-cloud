<template>
  <PageWrapper
    :title="`流程实例部署`"
    @back="goBack"
    dense
    contentFullHeight
    fixedHeight
    contentClass="flex"
  >
    <Modeler :xml="formData.xml" />
    <Panel />
    <BpmnActions ref="bpmnActions" />
    <!-- 按钮 -->
    <template #rightFooter>
      <!-- 部署按钮 -->
      <Button style="margin-right: 10px" type="primary" @click="deploy()" v-if="hasPermission('oa.deploy:deploy')">部署</Button>
      <!-- 取消按钮 -->
      <Button style="margin-right: 10px" @click="close()">取消</Button>
    </template>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import Modeler from '/@/components/Activiti/Modeler';
  import { usePermission } from '/@/hooks/web/usePermission';
  import Panel from '/@/components/Activiti/panel';
  import BpmnActions from '/@/components/Activiti/bpmn-actions';
  import { useRoute } from 'vue-router';
  import { Button } from 'ant-design-vue';
  import { onMounted, reactive, ref, unref } from 'vue';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { doFindRepositoryXml, doDeployProcessParameter } from '/@/api/oa/activiti';
  import { useGo } from '/@/hooks/web/usePage';

  
  const { hasPermission } = usePermission();
  const go = useGo();
  const route = useRoute();
  const { setTitle, closeCurrent } = useTabs();
  const bpmnActions = ref();
  const formData = reactive({
    id: route.params?.id,
    xml: undefined,
  });
  onMounted(() => {
    if (formData.id && formData.id !== 'undefined') {
      initUserInfo();
    }
    setTitle('流程实例部署');
  });

  const initUserInfo = async () => {
    const xml = await doFindRepositoryXml({ processDefinitionId: formData.id });
    formData.xml = xml;
  };

  const deploy = async () => {
    const { id, name, xml } = await unref(bpmnActions).getXml();
    await doDeployProcessParameter({ id: id + '.bpmn', xml, name });
    close();
  };

  const close = () => {
    goBack();
    closeCurrent();
  };

  function goBack() {
    // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
    go('/oa/repository');
  }
</script>
<style scoped>
  .app-containers {
    height: 100%;
  }
</style>
