<template>
  <div class="app-containers">
    <Modeler />
    <Panel />
    <BpmnActions />
  </div>
</template>

<script lang="ts" setup>
  import Modeler from '/@/components/Activiti/Modeler';
  import Panel from '/@/components/Activiti/panel';
  import BpmnActions from '/@/components/Activiti/bpmn-actions';
</script>
<style scoped>
  .app-containers {
    height: 100%;
  }
</style>
