import type { ModdleElement } from '#/components/Activiti/Bpmn/type';

import { defineComponent, nextTick, ref, unref } from 'vue';

import { Button, Drawer, Space } from 'ant-design-vue';
import CodeMirror from 'codemirror';

import { BpmnStore } from '#/components/Activiti/Bpmn/store';

import 'codemirror/mode/xml/xml.js';
import 'codemirror/addon/hint/xml-hint.js';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import './bpmn-actions.css';

function download(data: string, filename: string, type: string): void {
  const blob = new Blob([data]);
  const tempLink = document.createElement('a');
  const href = window.URL.createObjectURL(blob);
  tempLink.href = href;
  tempLink.target = '_blank';
  tempLink.download = `${filename}.${type}`;
  document.body.append(tempLink);
  tempLink.click();
  tempLink.remove();
  window.URL.revokeObjectURL(href);
}

export default defineComponent({
  name: 'BpmnActions',
  setup(_, { expose }) {
    const zoom = ref(1);
    const previewActive = ref(false);
    const xml = ref('');
    const fileInputRef = ref<HTMLInputElement>();
    let coder: CodeMirror.EditorFromTextArea | undefined;
    const bpmnContext = BpmnStore;

    const getXml = async () => {
      const rootElement: ModdleElement = bpmnContext
        .getModeler()
        .get('canvas')
        .getRootElement();
      const response = await bpmnContext.getXML();
      xml.value = response.xml;
      return {
        id: rootElement.id,
        name: rootElement.businessObject?.name || rootElement.id,
        xml: unref(xml),
      };
    };

    expose({ getXml });

    async function previewXml() {
      const response = await bpmnContext.getXML();
      xml.value = response.xml;
      previewActive.value = true;
      await nextTick();
      const textarea = document.querySelector<HTMLTextAreaElement>(
        '#xml-highlight-container',
      );
      if (!textarea) {
        return;
      }
      if (coder) {
        coder.setValue(xml.value);
      } else {
        coder = CodeMirror.fromTextArea(textarea, {
          lineNumbers: true,
          lineWrapping: true,
          mode: 'application/xml',
          readOnly: true,
          theme: 'material',
        });
        coder.setSize('100%', '100%');
      }
    }

    async function importFile(event: Event) {
      const eventTarget = event.target as HTMLInputElement;
      const file = eventTarget.files?.[0];
      if (!file) {
        return;
      }
      const xmlText = await file.text();
      await bpmnContext.importXML(xmlText);
      eventTarget.value = '';
    }

    async function exportSvg() {
      const rootElement: ModdleElement = bpmnContext
        .getModeler()
        .get('canvas')
        .getRootElement();
      const response = await bpmnContext.getSVG();
      download(response.svg, rootElement.id || 'process', 'svg');
    }

    async function exportXml() {
      const rootElement: ModdleElement = bpmnContext
        .getModeler()
        .get('canvas')
        .getRootElement();
      const response = await bpmnContext.getXML();
      download(response.xml, rootElement.id || 'process', 'bpmn');
    }

    function zoomIn() {
      zoom.value = Math.floor(zoom.value * 100 + 10) / 100;
      bpmnContext.getModeler().get('canvas').zoom(zoom.value);
    }

    function zoomOut() {
      zoom.value = Math.floor(zoom.value * 100 - 10) / 100;
      bpmnContext.getModeler().get('canvas').zoom(zoom.value);
    }

    function fitViewport() {
      zoom.value = 1;
      bpmnContext.getModeler().get('canvas').zoom('fit-viewport', 'auto');
    }

    return () => (
      <div class="bpmn-actions">
        <Space size={8}>
          <Button onClick={() => fileInputRef.value?.click()} size="small">
            导入
          </Button>
          <Button onClick={exportSvg} size="small">
            导出 SVG
          </Button>
          <Button onClick={exportXml} size="small">
            导出 XML
          </Button>
          <Button onClick={zoomIn} size="small">
            放大
          </Button>
          <Button onClick={zoomOut} size="small">
            缩小
          </Button>
          <Button onClick={fitViewport} size="small">
            适配
          </Button>
          <Button onClick={previewXml} size="small">
            预览
          </Button>
          <Button
            onClick={() => bpmnContext.getModeler().get('commandStack').undo()}
            size="small"
          >
            撤销
          </Button>
          <Button
            onClick={() => bpmnContext.getModeler().get('commandStack').redo()}
            size="small"
          >
            恢复
          </Button>
        </Space>
        <Drawer
          destroyOnClose={true}
          onClose={() => (previewActive.value = false)}
          open={previewActive.value}
          placement="left"
          width="42%"
        >
          <textarea id="xml-highlight-container" value={xml.value} />
        </Drawer>
        <input
          accept=".xml,.bpmn"
          id="bpmn-upload-element"
          onChange={importFile}
          ref={fileInputRef}
          style="display: none"
          type="file"
        />
      </div>
    );
  },
});
