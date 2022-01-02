import path from 'path';
import fs from 'fs';
import { StringIndexedObject } from '../../types';

export default class FileOps {
  static readObjectFromFile(filePath: string): object {
    let obj: object;
    try {
      const jsonString: string = fs.readFileSync(path.resolve(filePath), {
        encoding: 'utf-8',
      });
      obj = JSON.parse(jsonString);
    } catch (error) {
      throw new Error(`Could not read object from file at ${filePath}`);
    }
    return obj;
  }

  static writeObjectToFile(filePath: string, data: StringIndexedObject) {
    fs.writeFileSync(filePath, JSON.stringify(data), { encoding: 'utf-8' });
  }
}
