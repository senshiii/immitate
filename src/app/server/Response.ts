import { ValidationResult } from "../types";

export class ServerResponse {
  status: number;
  message: string;

  constructor(s: number, m: string){
    this.status = s;
    this.message = m;
  }

}

export class ValidationResponse implements ValidationResult {
  errors: string[];
  success: boolean;
  message: string;

  constructor(success: boolean, errors?: string[]) {
    this.errors = errors ?? [];
    this.success = success;
    this.message = success ? 'Validation Successful' : 'Validation Failed';
  }
}












