export class ButtonDataItem {
  parentPath: string;

  constructor(public name: string, public key: string, parentPath: string[], public targetPaths: string[]) {
    this.parentPath = parentPath.join('.');
  }
}
