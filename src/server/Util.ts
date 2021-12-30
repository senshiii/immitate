import { StringIndexedObject } from '../types';

export default class Utils {
  static isNullOrUndefined(val: any): boolean {
    return val == null || val == undefined;
  }

  static objectHasKey(object: StringIndexedObject, key: string): boolean {
    return (
      !this.isNullOrUndefined(object) &&
      !this.isNullOrUndefined(key) &&
      typeof object == 'object' &&
      typeof key == 'string' &&
      Object.keys(object).includes(key)
    );
  }

  static capitalize(str: string): string {
    return str
      .toLowerCase()
      .substring(0, 1)
      .toUpperCase()
      .concat(str.substring(1));
  }
}
