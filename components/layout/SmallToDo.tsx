import React, { useEffect, useRef, useState } from "react";
import ToDo from "./ToDo";
import { Button, Input, TextField } from "@mui/material";

const SmallToDo = () => {
  const [todoName, setTodoName] = useState("");
  const [todos, setTodos] = useState<{ text: string, id: number, isChecked: boolean }[]>([]);
  const todosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const todosFromLS = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")!) : [];
    if (todosFromLS?.length) setTodos(todosFromLS);
  }, []);

  useEffect(() => {
    todos.length > 0 && localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
      todoName.length > 0 && setTodos(prevState => [...prevState, {
        text: todoName,
        isChecked: false,
        id: Math.random()
      }]);
      setTodoName("");
  };

  console.log('todos', todos);

  return (
    <div ref={todosRef}>
      <form onSubmit={handleAddTodo} style={{ display: "flex", gap: 10, marginRight: 18, alignItems: "center" }}>
        <TextField size='small' placeholder='Idea to not forget...' label='Your todo' style={{ fontSize: "16px", borderRadius: 4 }} type="text" value={todoName}
               onChange={(e) => setTodoName(e.target.value)} />
        <Button size='medium' variant='outlined' style={{ userSelect: "none" }} onClick={handleAddTodo}>Add</Button>
        <button type='submit' style={{display: 'none'}}></button>
      </form>
      <div style={{ marginTop: 10, height: 1 }} className="delimeter" />
      <div>
        {todos.map(({ id, text, isChecked }) => (
          <ToDo id={id} onTodoDelete={(id) => setTodos(prevState => prevState.filter(prevTodo => prevTodo.id !== id))}
                key={id} isChecked={isChecked} text={text} onCheckedChange={e => {
            const idx = todos.findIndex(todo => todo.id === id);
            const copiedTodos = [...todos];
            copiedTodos[idx].isChecked = !copiedTodos[idx].isChecked;
            setTodos(copiedTodos);
          }} />
        ))}
      </div>
    </div>
  );
};

export default SmallToDo;