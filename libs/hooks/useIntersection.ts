import { INTERSECTION_MARGIN } from '../../utils/constants';

export const useIntersection = (element: HTMLElement, additionalReturnPredicate = false,  fnAfterIntersection: () => void,) => {
    let observer;
    const intersectCb = function (entries) {
        const [ entry ] = entries;
        if (!entry.isIntersecting || additionalReturnPredicate || entry.intersectionRatio!==1) return;
        console.log('intersect')
        fnAfterIntersection();
    };
    observer = new IntersectionObserver(intersectCb, {
        rootMargin: `${INTERSECTION_MARGIN}px`
    });
    observer.observe(element);
    return observer;
}
