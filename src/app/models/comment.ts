export class Comment {
  private _objectId: string;
  private _byUser: string;
  private _ofDiningTiming: string;
  private _rating: string;
  private _text: string;

  public get byUser(): string {
    return this._byUser;
  }
  public set byUser(value: string) {
    this._byUser = value;
  }
  public get ofDiningTiming(): string {
    return this._ofDiningTiming;
  }
  public set ofDiningTiming(value: string) {
    this._ofDiningTiming = value;
  }
  public get rating(): string {
    return this._rating;
  }
  public set rating(value: string) {
    this._rating = value;
  }
  public get text(): string {
    return this._text;
  }
  public set text(value: string) {
    this._text = value;
  }
  public get objectId(): string {
    return this._objectId;
  }
  public set objectId(value: string) {
    this._objectId = value;
  }
}
