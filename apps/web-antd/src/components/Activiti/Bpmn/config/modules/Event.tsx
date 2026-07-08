/* eslint-disable vue/multi-word-component-names */
import {
  CommonGroupProperties,
  DocumentGroupProperties,
  ExtensionGroupProperties,
  getElementTypeListenerProperties,
} from '../common';

const EventListenerProperties = getElementTypeListenerProperties({
  name: '执行监听器',
});

const groups = [
  CommonGroupProperties,
  EventListenerProperties,
  ExtensionGroupProperties,
  DocumentGroupProperties,
];

export default {
  'bpmn:EndEvent': groups,
  'bpmn:StartEvent': groups,
};
