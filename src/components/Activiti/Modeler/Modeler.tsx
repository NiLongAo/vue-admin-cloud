import './modeler.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

import { defineComponent, onMounted,watch } from 'vue';
import createDefaultBpmnXml from '../Bpmn/defaultBpmnXml';
import activitiModdel from '../Bpmn/activiti-moddel.json';
import translate from '../Bpmn/i18n';
import { BpmnStore } from '../Bpmn/store';

export default defineComponent({
  name: 'Modeler',
  props: {
    xml: {
      type: String,
      default:'',
    },
  },
  setup(props) {
    const bpmnContext = BpmnStore;
    onMounted(() => {
      bpmnContext.initModeler({
        container: '#modeler-container',
        additionalModules: [
          //添加翻译
          { translate: ['value', translate('zh')] },
        ],
        moddleExtensions: {
          activiti: activitiModdel,
        },
      });
      const defaultProcessIdAndName = '1';
      bpmnContext
        .importXML(createDefaultBpmnXml(defaultProcessIdAndName, defaultProcessIdAndName))
        .then((result: Array<string>) => {
          if (result.length) {
            console.warn('importSuccess warnings', result);
          }
        })
        .catch((err: any) => {
          console.warn('importFail errors ', err);
        });
    });

    watch(
      () => props.xml,
      (value) => {
        bpmnContext.importXML(value);
      },
    );

    return () => <div id="modeler-container" />;
  },
});
