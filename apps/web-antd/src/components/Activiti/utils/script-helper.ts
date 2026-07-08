const ScriptHelper = {
  execute(_scriptStr: string, _options: unknown): unknown {
    return undefined;
  },
  executeEl(_callObject: unknown, _logicStr: string): unknown {
    return false;
  },
};

export const set = (obj: any, path: string, value: unknown): void => {
  let schema = obj;
  const pList = path.split('.');
  for (let i = 0; i < pList.length - 1; i++) {
    const elem = pList[i] as string;
    schema[elem] = schema[elem] || {};
    schema = schema[elem];
  }

  schema[pList[pList.length - 1] as string] = value;
};

export const resolve = (path: string, obj: any): unknown => {
  let current = obj ?? globalThis;
  for (const key of path.split('.')) {
    if (!current) {
      return null;
    }
    current = current[key];
  }
  return current;
};

export default ScriptHelper;
