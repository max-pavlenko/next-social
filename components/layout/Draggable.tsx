import React, { MouseEvent, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import styles from "../../styles/Draggable.module.scss";
import Icon from "./Icons/Icon";
import draggable from "../../store/Draggable";

const MINIMIZED_HEIGHT = 51;
const MINIMIZED_WIDTH = 25;
const DEFAULT_MAXIMIZED_SIZES = {width: 200, height: 150};
const MINIMUM_RESIZED_SIZES = {width: 200, height: 95}

export type Dot = { x: number, y: number }

const Draggable = ({ children }: { children: ReactNode }) => {
  const isDragged = useRef(false);
  const [position, setPosition] = useState<Dot>(JSON.parse(localStorage.getItem("position") || "false") || {
    x: 0, y: 0
  });
  const draggableRef = useRef<HTMLDivElement>(null);
  const clickedAtRef = useRef<Dot>({ x: 0, y: 0 });
  const [clickCountForMovableArea, setClickCountForMovableArea] = useState(1);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const CONTENT_WIDTH_WITH_BORDER = useRef(DEFAULT_MAXIMIZED_SIZES.width);
  const CONTENT_HEIGHT_WITH_BORDER = useRef(DEFAULT_MAXIMIZED_SIZES.height);
  const contentBorderWidth = draggableRef.current ? +getComputedStyle(draggableRef.current).borderTopWidth.slice(0, -2) : 0;

  function handleWindowResize() {
    if (position.x >= document.body.clientWidth) {
      setPosition(prev => {
        return { ...prev, x: document.body.clientWidth - draggableRef.current!.offsetWidth };
      });
    }
  }

  useEffect(() => {
    draggable.setIsMovableAreaCollapsed(clickCountForMovableArea % 2 === 0)
  }, [clickCountForMovableArea]);

  useEffect(() => {
    CONTENT_WIDTH_WITH_BORDER.current = draggableRef.current!.offsetWidth > 100 ? draggableRef.current!.offsetWidth : CONTENT_WIDTH_WITH_BORDER.current;
    CONTENT_HEIGHT_WITH_BORDER.current = draggableRef.current!.offsetHeight > 100 ? draggableRef.current!.offsetHeight : CONTENT_HEIGHT_WITH_BORDER.current;
    window.addEventListener("mousemove", handleMove as any);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("mousemove", handleMove as any);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (!isDragged.current) return;
    const { clientX, clientY } = e;
    let x = clientX, y = clientY;
    const MARGIN_TRESHOLD = 1;
    const STICK_EDGE_THRESHOLD = 100;
    const RIGHT_MAXIMA = document.body.clientWidth - draggableRef.current!.offsetWidth + clickedAtRef.current.x - MARGIN_TRESHOLD;
    const BOTTOM_MAXIMA = window.innerHeight - draggableRef.current!.offsetHeight + clickedAtRef.current.y;
    const LEFT_MAXIMA = clickedAtRef.current.x;
    const TOP_MAXIMA = clickedAtRef.current.y;

    if (clientX >= RIGHT_MAXIMA) {
      x = RIGHT_MAXIMA;
    } else if (clientX < LEFT_MAXIMA) x = LEFT_MAXIMA;
    if (clientY >= BOTTOM_MAXIMA) {
      y = BOTTOM_MAXIMA;
    } else if (clientY < TOP_MAXIMA) y = TOP_MAXIMA;
    // to stick to edges
    if (clientX + draggableRef.current!.offsetWidth > document.body.clientWidth - (isCollapsed ? STICK_EDGE_THRESHOLD : 0)) {
      x = document.body.clientWidth - draggableRef.current!.offsetWidth + clickedAtRef.current.x;
    }
    if (clientY + draggableRef.current!.offsetHeight > window.innerHeight - (isCollapsed ? STICK_EDGE_THRESHOLD : 0)) {
      y = window.innerHeight - draggableRef.current!.offsetHeight + clickedAtRef.current.y;
    }
    handlePositionDebounced(x - clickedAtRef.current.x, y - clickedAtRef.current.y);
  }

  function handleMouseUp() {
    if(isDragged.current){
      console.log('setting', position, isDragged.current);
    }
    document.body.style.cursor = "initial";
    isDragged.current = false;
    clickedAtRef.current = ({ x: 0, y: 0 });
  }

  const handlePositionDebounced = useCallback(debounce((x, y) => controlPosition(x, y), 10), []);

  function controlPosition(x: number, y: number) {
    let pos = { x, y };
    console.log("xy", x, y);
    localStorage.setItem("position", JSON.stringify({ x, y }));
    setPosition(pos);
  }

  const handleCollapse = () => {
    let x = position.x, y = position.y, shouldReposition = false;
    const STICK_TO_EDGE_THRESHOLD = 70;
    // to push draggable by its content dimensions, to not cause its overflow, when uncollapsing
    if (isCollapsed && draggableRef.current!.getBoundingClientRect().left + CONTENT_WIDTH_WITH_BORDER.current > document.body.clientWidth) {
      // shouldReposition = true;
      console.log(document.body.clientWidth, draggableRef.current!.getBoundingClientRect().width, CONTENT_WIDTH_WITH_BORDER.current);
      setTimeout(()=>{ // because draggable is still minimized when executing this, have to wait until it gets its full width
        x = document.body.clientWidth - draggableRef.current!.getBoundingClientRect().width - contentBorderWidth - 1;
        handlePositionDebounced(x, y);
      }, 150)
    }
    if (isCollapsed && draggableRef.current!.getBoundingClientRect().top + CONTENT_HEIGHT_WITH_BORDER.current > window.innerHeight) {
      shouldReposition = true;
      y = window.innerHeight - CONTENT_HEIGHT_WITH_BORDER.current - contentBorderWidth - 1;
    }
    // to stick to edges when minimizing draggable
    if (!isCollapsed && draggableRef.current!.getBoundingClientRect().left + draggableRef.current!.offsetWidth > document.body.clientWidth - STICK_TO_EDGE_THRESHOLD) {
      shouldReposition = true;
      x = document.body.clientWidth - MINIMIZED_WIDTH;
    }
    if (!isCollapsed && draggableRef.current!.getBoundingClientRect().top + draggableRef.current!.offsetHeight > window.innerHeight - STICK_TO_EDGE_THRESHOLD) {
      shouldReposition = true;
      y = window.innerHeight - MINIMIZED_HEIGHT;
    }
    shouldReposition && handlePositionDebounced(x, y);
    localStorage.setItem("isCollapsed", String(!isCollapsed));
    setIsCollapsed((prevState) => !prevState);
  };

  return (
    <div
      className={styles.dragContainer}
      ref={draggableRef} style={{
      top: position.y,
      left: position.x,
      transform: `translateX(${0.01}px)`
    }}>
      <div style={{ position: "relative" }}>
        <div className={styles.dragContent} style={{
          resize: !isCollapsed ? 'both' : 'initial',
          overflow: 'auto',
          maxWidth: isCollapsed ? 25 : document.body.clientWidth / 2.2,
          maxHeight: isCollapsed ? 25 : window.innerHeight / 2,
          // minHeight: !isCollapsed && 45,
          minWidth: !isCollapsed ? MINIMUM_RESIZED_SIZES.width : undefined,
          minHeight: !isCollapsed ? MINIMUM_RESIZED_SIZES.height : undefined,
          width: CONTENT_WIDTH_WITH_BORDER.current,
          transition: "0.17s max-height, 0.15s max-width, 0.22s transform"
        }}>
          {!isCollapsed && <>{children}</>}
          <a onClick={handleCollapse} style={{ position: "absolute", top: 5, right: 5 }}>
            <Icon style={{ rotate: `${isCollapsed ? 180 : 0}deg` }} icon={"chevronDown"} size={15}
                  color="var(--color-border)" />
          </a>
          {!isCollapsed && <a onClick={() => setClickCountForMovableArea(prevState => ++prevState)}
                              style={{ position: "fixed", zIndex: 1, right: clickCountForMovableArea % 2 !== 0 ? 10 : 20, bottom: clickCountForMovableArea % 2 !== 0 ? 3 : 0 }}>
            <Icon style={{ rotate: `${180 * clickCountForMovableArea}deg` }} icon={"chevronDown"} size={11}
                  color="var(--color-border)" />
          </a>}
        </div>

        <div style={{ maxHeight: clickCountForMovableArea % 2 !== 0 ? 100 : 0, maxWidth: isCollapsed ? 25 : 1000 }}
             className={styles.dragArea}
             onMouseDown={(e) => {
               document.body.style.cursor = "move";
               clickedAtRef.current = ({
                 x: e.clientX - draggableRef.current!.getBoundingClientRect().x,
                 y: e.clientY - draggableRef.current!.getBoundingClientRect().y
               });
               isDragged.current = true;
             }}>
          <Icon icon="sixDots" size={isCollapsed ? 20 : 25} color="var(--color-border)" />
        </div>
      </div>
    </div>
  );
};

export default Draggable;