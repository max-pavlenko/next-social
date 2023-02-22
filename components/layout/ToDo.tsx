import React, { ChangeEventHandler, useRef } from "react";
import { Checkbox, FormControlLabel, FormGroup, IconButton } from "@mui/material";
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  hidden: { opacity: -1, x: 0, y: -50 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: -1, x: 0, y: 100 },
}

const ToDo = ({isChecked, text, id, onCheckedChange, onTodoDelete}: {onTodoDelete: (id: number)=>void ,onCheckedChange: ChangeEventHandler<HTMLInputElement>, isChecked: boolean, id: number, text: string}) => {
  const todoRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence mode='wait'>
      <motion.div key={id} variants={variants} initial="enter" animate="enter" exit="exit"
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <FormGroup>
          <FormControlLabel control={<Checkbox sx={{ width: 30, height: 30 }} size="small" color="primary"
                                               icon={<DoneAllIcon color="primary" />} checkedIcon={<RemoveDoneIcon />}
                                               style={{ width: "initial" }} onChange={onCheckedChange}
                                               checked={isChecked} />} label={
            <div ref={todoRef} style={{
              width: "min-content",
              maxWidth: 500,
              userSelect: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              position: 'relative',
            }}>{text}<div className='lineTrough' style={{maxWidth: isChecked ? todoRef.current?.getBoundingClientRect().width || '500px' : 0 }}></div></div>
          } />
        </FormGroup>
        <IconButton size="small" onClick={() => onTodoDelete(id)}>
          <DeleteForeverIcon />
        </IconButton>
      </motion.div>
    </AnimatePresence>
  );
};

export default ToDo;