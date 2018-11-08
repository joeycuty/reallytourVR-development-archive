import { ImageFile } from './imageFile.abstract';
export class Pano extends ImageFile {


  get savingTextData(): boolean {
    return this._savingTextData;
  }

  set savingTextData( value: boolean ) {
    this._savingTextData = value;
  }

  get title(): string {
    return this._title;
  }

  set title( value: string ) {
    this._title = value;
  }

  get description(): string {
    return this._description;
  }

  set description( value: string ) {
    this._description = value;
  }

  public _savingTextData = false;
  public _title = '';
  public _description = '';

  constructor() {
    super();
  }

}
