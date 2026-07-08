import type { Component } from 'vue';

export interface FieldDefine extends Map {
  component?: any | Component | string;
  getValue?: (sourceObject: any) => any;
  predicate?: ((obj: any) => boolean) | string;
  setValue?: (sourceObject: any, key: string, value: any) => unknown;
}

export interface Map {
  [index: number]: any;
  [key: string]: any;
}

export { default } from './DynamicBinder';
