import type { GroupProperties } from '#/components/Activiti/Bpmn/config';

import { defineComponent, reactive, watch } from 'vue';

import { Collapse, CollapsePanel } from 'ant-design-vue';

import { BpmnStore } from '#/components/Activiti/Bpmn/store';
import DynamicBinder from '#/components/Activiti/dynamic-binder';

import './panel.css';

export default defineComponent({
  name: 'BpmnPanel',
  setup() {
    const bpmnContext = BpmnStore;
    const contextState = bpmnContext.getState();
    const panelState = reactive({
      activeKeys: [] as string[],
      collapsed: false,
    });

    function onFieldChange(key: string, value: unknown): void {
      bpmnContext.getModeling().updateProperties(bpmnContext.getShape(), {
        [key]: value,
      });
    }

    watch(
      () => contextState.activeBindDefine,
      () => {
        panelState.activeKeys =
          contextState.activeBindDefine?.map(
            (groupItem) => groupItem.name ?? '',
          ) ?? [];
      },
    );

    function getSlotObject(groupItem: GroupProperties) {
      return {
        default: () => (
          <DynamicBinder
            fieldDefine={groupItem.properties}
            onFieldChange={onFieldChange}
            value={contextState.businessObject}
          />
        ),
        header: () => <div class="group-title-block">{groupItem.name}</div>,
      };
    }

    return () => (
      <>
        {contextState.isActive &&
          contextState.businessObject &&
          contextState.activeBindDefine && (
            <>
              <button
                class="bpmn-panel-shrinkage"
                onClick={() => (panelState.collapsed = !panelState.collapsed)}
                type="button"
              >
                {panelState.collapsed ? '展开' : '收起'}
              </button>
              <div class="bpmn-panel" v-show={!panelState.collapsed}>
                <div class="title">{bpmnContext.getActiveElementName()}</div>
                <Collapse
                  class="bpmn-panel-collapse"
                  expandIconPosition="end"
                  v-model:activeKey={panelState.activeKeys}
                >
                  {contextState.activeBindDefine.map((groupItem) => (
                    <CollapsePanel
                      key={groupItem.name}
                      v-slots={getSlotObject(groupItem)}
                    />
                  ))}
                </Collapse>
              </div>
            </>
          )}
      </>
    );
  },
});
