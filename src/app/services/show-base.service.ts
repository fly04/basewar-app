import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShowBaseService {
  baseId: string = null;
  hasBeenShown: boolean = false;
  constructor() {}

  setBaseId(baseId: string) {
    this.baseId = baseId;
    this.hasBeenShown = false;
  }

  isShown() {
    this.baseId = null;
    this.hasBeenShown = true;
  }
}
