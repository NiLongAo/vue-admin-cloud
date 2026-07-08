/* eslint-disable vue/multi-word-component-names */
import {
  CommonGroupProperties,
  DocumentGroupProperties,
  ExtensionGroupProperties,
  getElementTypeListenerProperties,
} from '../common';

const ProcessListenerProperties = getElementTypeListenerProperties({
  name: '执行监听器',
});

export default {
  'bpmn:Process': [
    CommonGroupProperties,
    ProcessListenerProperties,
    ExtensionGroupProperties,
    DocumentGroupProperties,
  ],
};
