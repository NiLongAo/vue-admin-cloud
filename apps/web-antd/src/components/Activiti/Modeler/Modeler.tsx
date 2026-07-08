import { defineComponent, onMounted, watch } from 'vue';

import activitiModdel from '../Bpmn/activiti-moddel.json';
import createDefaultBpmnXml from '../Bpmn/defaultBpmnXml';
import translate from '../Bpmn/i18n';
import { BpmnStore } from '../Bpmn/store';

import './modeler.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

export default defineComponent({
  name: 'BpmnModeler',
  props: {
    xml: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const bpmnContext = BpmnStore;

    onMounted(() => {
      bpmnContext.initModeler({
        additionalModules: [{ translate: ['value', translate('zh')] }],
        container: '#modeler-container',
        moddleExtensions: {
          activiti: activitiModdel,
        },
      });

      const defaultProcessIdAndName = 'Process_1';
      bpmnContext.importXML(
        createDefaultBpmnXml(defaultProcessIdAndName, defaultProcessIdAndName),
      );
    });

    watch(
      () => props.xml,
      (value) => {
        if (value) {
          bpmnContext.importXML(value);
        }
      },
    );

    return () => <div id="modeler-container" />;
  },
});
