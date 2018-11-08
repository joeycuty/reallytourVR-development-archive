export abstract class ImageFile {
  get id(): string {
    return this._id;
  }

  set id( value: string ) {
    this._id = value;
  }
  get name(): string {
    return this._name;
  }

  set name( value: string ) {
    this._name = value;
  }

  get imageSource(): string {
    return this._imageSource;
  }

  set imageSource( value: string ) {
    this._imageSource = value;
  }

  get savingImage(): string {
    return this._savingImage;
  }

  set savingImage( value: string ) {
    this._savingImage = value;
  }


  get file(): Blob {
    return this._file;
  }

  set file( value: Blob ) {
    this._file = value;
  }

  get imageUploaded(): boolean {
    return this._imageUploaded;
  }

  set imageUploaded( value: boolean ) {
    this._imageUploaded = value;
  }

  public _name = '';
  public _id = 'profile';
  public _imageSource = '';
  public _savingImage = '';
  public _imageUploaded = false;
  public _file: Blob;

  constructor() {

  }

}
