import { makeAutoObservable } from 'mobx';

class Draggable {
   isMovableAreaCollapsed = false;

   constructor() {
      makeAutoObservable(this);
   }

   setIsMovableAreaCollapsed(isCollapsed: boolean) {
      this.isMovableAreaCollapsed = isCollapsed;
   }
}

export default new Draggable();
