/* eslint-disable vue/multi-word-component-names */
import { CommonGroupProperties, DocumentGroupProperties } from '../common';

const groups = [CommonGroupProperties, DocumentGroupProperties];

export default {
  'bpmn:ExclusiveGateway': groups,
  'bpmn:InclusiveGateway': groups,
  'bpmn:ParallelGateway': groups,
};
