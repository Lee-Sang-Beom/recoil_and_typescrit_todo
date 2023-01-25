import getQuery from "@/hooks/getQuery";
import PQuery from "@/hooks/postQuery";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import TodoItem from "./TodoItem";

export interface ITodoItem {
  id: number;
  text: string;
}

export default function TodoList() {
  const [textList, setTextList] = useState<ITodoItem[]>([]);
  const [text, setText] = useState<string>("");

  const fetchTodoList = async () => {
    return await axios
      .get("http://localhost:3001/todos")
      .then((res) => res.data);
  };

  // hooks/query.ts로 분리
  // 제어형 컴포넌트라, input 입력 때마다 불러오게 됨
  getQuery(fetchTodoList, setText, setTextList);

  return (
    <>
      <div className="section_wrap">
        {/* input section */}
        <PQuery text={text} setText={setText} />
        {/* todoList output section */}
        <section className="column_col2">
          {textList &&
            textList.map((todo: ITodoItem) => (
              <TodoItem todo={todo} key={todo.id} />
            ))}
        </section>
      </div>
      <style jsx>{`
        .section_wrap {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .section_wrap .column_col2 {
          /* output section */
          flex-basis: 50%;
          border: 3px solid black;
          overflow: scroll;
          margin: 1.5rem;
          padding: 1rem 0;

          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </>
  );
}
