import { useEffect } from 'react';
import SingletonRouter, { Router } from 'next/router';

export function usePreventUserFromLeavingUnsaved(shouldPreventLeaving: boolean) {
   const stringToDisplay = 'Do you want to save before leaving the page ?';

   useEffect(() => {
      // Prevents tab quit / tab refresh
      function handleBeforeUnload() {
         return stringToDisplay;
      }

      if (shouldPreventLeaving) {
         // Adding window alert if the shop quits without saving
         window.addEventListener('beforeunload', handleBeforeUnload);
      }
      else {
         window.onbeforeunload = () => {
         };
      }

      if (shouldPreventLeaving) {
         // Prevents next routing
         SingletonRouter.router!.change = (...args: any[]) => {
            if (confirm(stringToDisplay)) {
               return Router.prototype.change.apply(SingletonRouter.router, args);
            }
            else {
               return new Promise((resolve) => resolve(false));
            }
         };
      }
      return () => {
         delete SingletonRouter.router!.change;
         window.removeEventListener('beforeunload', handleBeforeUnload);
      };
   }, [shouldPreventLeaving]);
}
