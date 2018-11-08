import {Injectable} from '@angular/core';

@Injectable()
export class LoggingService {

  constructor() {
  }

  note(page, message) {
    console.log(page + '=> ' + message);
  }

  failure(page, error) {
    console.log(page + '=> FAILURE: ' + error);
  }

}
