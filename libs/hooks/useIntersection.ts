import {INTERSECTION_MARGIN} from '../../utils/constants';

export const useIntersection = (element: HTMLElement | null, additionalReturnPredicate = false,  fnAfterIntersection: () => void, fnElse: () => void, intersectMargin = INTERSECTION_MARGIN) => {
    let observer;
    const intersectCb: IntersectionObserverCallback = function (entries) {
        const [ entry ] = entries;
        if (!entry.isIntersecting || additionalReturnPredicate) {
            fnAfterIntersection();
            return;
        }
        console.log('intersect')
        fnElse();
    };
    observer = new IntersectionObserver(intersectCb, {
        rootMargin: `${intersectMargin}px`
    });
    element && observer.observe(element);
    return observer;
}
