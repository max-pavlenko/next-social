import {useEffect} from "react";
import SingletonRouter, {Router} from "next/router";

export function usePreventUserFromErasingContent(shouldPreventLeaving) {
    const stringToDisplay = 'Do you want to save before leaving the page ?';

    useEffect(() => {
        // Prevents tab quit / tab refresh
        if (shouldPreventLeaving) {
            // Adding window alert if the shop quits without saving
            window.onbeforeunload = function () {
                return stringToDisplay;
            };
        } else {
            window.onbeforeunload = () => {};
        }

        if (shouldPreventLeaving) {
            // Prevents next routing
            SingletonRouter.router.change = (...args) => {
                if (confirm(stringToDisplay)) {
                    return Router.prototype.change.apply(SingletonRouter.router, args);
                } else {
                    return new Promise((resolve) => resolve(false));
                }
            };
        }
        return () => {
            delete SingletonRouter.router.change;
        };
    }, [shouldPreventLeaving]);
}