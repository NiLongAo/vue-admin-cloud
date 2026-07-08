import type { FieldDefine } from '#/components/Activiti/dynamic-binder';

export interface PropertiesMap<T> {
  [key: string]: T;
}

export interface GroupProperties {
  icon?: string;
  name?: string;
  properties: PropertiesMap<FieldDefine>;
}

const modules = import.meta.glob('./modules/*.tsx', { eager: true });

const getBpmnGroupPropertiesConfig = () => {
  const BpmnGroupPropertiesConfig: PropertiesMap<Array<GroupProperties>> = {};
  for (const path in modules) {
    const moduleDefaultExport = (
      modules[path] as { default: PropertiesMap<Array<GroupProperties>> }
    ).default;
    for (const moduleKey in moduleDefaultExport) {
      const groupProperties = moduleDefaultExport[moduleKey];
      if (groupProperties) {
        BpmnGroupPropertiesConfig[moduleKey] = groupProperties;
      }
    }
  }
  return BpmnGroupPropertiesConfig;
};

export default getBpmnGroupPropertiesConfig();
