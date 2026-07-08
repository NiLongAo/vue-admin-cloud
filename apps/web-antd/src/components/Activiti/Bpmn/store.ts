import type { BpmnContext, BpmnState, ModdleElement } from './type';

import { nextTick, reactive, toRaw } from 'vue';

import Modeler from 'bpmn-js/lib/Modeler';

import BpmnGroupPropertiesConfig from './config';
import { resolveTypeName } from './config/TypeNameMapping';

const bpmnState = reactive<BpmnState>({
  activeBindDefine: null,
  activeElement: null,
  businessObject: null,
  isActive: false,
});

function refreshState(elementRegistry: any, elementAction: any): void {
  if (!bpmnState || !elementAction) {
    return;
  }
  const element = elementAction.element || elementAction.context?.element;
  if (!element) {
    return;
  }
  bpmnState.activeElement = { ...elementAction, element };
  const shape = elementRegistry.get(element.id);
  bpmnState.businessObject = shape ? shape.businessObject : {};
  bpmnState.isActive = true;
  bpmnState.activeBindDefine = shape
    ? BpmnGroupPropertiesConfig[element.type] ||
      BpmnGroupPropertiesConfig[shape.businessObject?.$type] ||
      null
    : null;
}

export const BpmnStore: BpmnContext = {
  modeler: null,
  state: bpmnState,
  addEventListener(name, func) {
    this.getModeler()
      .get('eventBus')
      .on(name, (event: any) => func(event));
  },
  createElement(nodeName, modelName, value, multiple) {
    const newElement = this.getBpmnFactory().create(nodeName, value);
    this.getModeling().updateProperties(this.getShape(), {
      [modelName]: multiple ? [newElement] : newElement,
    });
  },
  getActiveElement() {
    return this.getState().activeElement;
  },
  getActiveElementName() {
    const businessObject = this.getBusinessObject();
    return businessObject ? resolveTypeName(businessObject) : '';
  },
  getBpmnFactory() {
    return this.getModeler().get('bpmnFactory');
  },
  getBusinessObject() {
    return this.getState().businessObject;
  },
  getModeler() {
    return this.modeler;
  },
  getModeling() {
    return this.getModeler().get('modeling');
  },
  getShape() {
    return this.getShapeById(this.getState().activeElement.element.id);
  },
  getShapeById(id) {
    return this.getModeler().get('elementRegistry').get(id);
  },
  getState() {
    return this.state;
  },
  getSVG() {
    return this.getModeler().saveSVG();
  },
  getXML() {
    return this.getModeler().saveXML({ format: true });
  },
  importXML(xml) {
    return this.modeler.importXML(xml);
  },
  initModeler(options) {
    this.modeler = new Modeler(options);
    const elementRegistry = this.modeler.get('elementRegistry');

    ['element.click', 'shape.added', 'selection.changed'].forEach(
      (eventName) => {
        this.addEventListener(eventName, (elementAction) => {
          const element =
            elementAction.element ||
            elementAction.newSelection?.[0] ||
            elementAction.context?.element;
          if (!element) {
            return;
          }
          bpmnState.businessObject = null;
          nextTick().then(() =>
            refreshState(elementRegistry, { ...elementAction, element }),
          );
        });
      },
    );
  },
  refresh() {
    bpmnState.businessObject = null;
    nextTick().then(() => {
      refreshState(
        this.modeler.get('elementRegistry'),
        bpmnState.activeElement,
      );
    });
  },
  updateExtensionElements(elementName, value) {
    const moddle = this.getModeler().get('moddle');
    const extensionElements = this.getBusinessObject()?.extensionElements;
    const otherExtensions =
      extensionElements?.values
        ?.filter((item: any) => item.$type !== elementName)
        .map((item: ModdleElement) => toRaw(item)) || [];

    const extensions = moddle.create('bpmn:ExtensionElements', {
      values: [...otherExtensions, ...(Array.isArray(value) ? value : [value])],
    });
    this.getModeling().updateProperties(this.getShape(), {
      extensionElements: extensions,
    });
  },
};
