import GetQuery from "@/hooks/getQuery";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import TodoItem from "./TodoItem";

export interface ITodoItem {
  id: number;
  text: string;
}

export default function TodoList() {
  const queryClient = useQueryClient();
  const [textList, setTextList] = useState<ITodoItem[]>([]);
  const [text, setText] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchTodoList = async () => {
    return await axios
      .get("http://localhost:3001/todos")
      .then((res) => res.data);
  };

  // hooks/query.ts로 분리
  GetQuery(fetchTodoList, setText, setTextList);

  // post 용도
  const postQuery = useMutation(
    async () => {
      return await axios
        .post(`http://localhost:3001/todos`, {
          text: text,
        })
        .then(() => {
          alert("정상 등록");
        })
        .catch(() => alert("등록 실패"));
    },
    {
      // onMutate 는 mutation 함수가 실행되기 전에 실행되고 mutation 함수가 받을 동일한 변수가 전달된다.
      // optimistic update 사용 시 유용한 함수이다.
      onMutate: (variable) => {
        console.log("onMutate", variable);
        // variable : {loginId: 'xxx', password; 'xxx'}
      },
      onError: (error, variable, context) => {
        // error
        console.log("error", variable, context);
      },
      // mutation이 성공하고 결과를 전달할 때 사용
      onSuccess: (data, variables, context) => {
        console.log("success", data, variables, context);
        queryClient.invalidateQueries("getTodoList");
      },

      // mutation 이 성공해서 성공한 데이터 또는 error가 전달될 때 실행된다. (성공하든 실패하든 아무튼 결과가 전달된다)
      onSettled: () => {
        console.log("end");
      },
    }
  );

  // input 태그에 값을 입력할 때, state의 변화를 관리
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setText(value);
  };

  // input 태그에 사용자 일정을 입력한 후, 제출 로직을 구성
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    postQuery.mutate();
  };

  return (
    <>
      <div className="section_wrap">
        {/* input section */}
        <section className="column_col1">
          <form onSubmit={onSubmit}>
            <input
              type="text"
              ref={inputRef}
              placeholder="todo 요소를 입력하세요."
              value={text}
              onChange={onChange}
              required
            />
            <button type="submit">Save</button>
          </form>
        </section>

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

        .section_wrap .column_col1 {
          /* input box */

          flex-basis: 40%;
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin: 1.5rem 0;
        }

        form {
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 70%;
        }

        form input {
          flex-basis: 70%;
          height: 60px;
          line-height: 60px;
          text-align: center;
          font-size: 1.2rem;
          outline: none;
          border: 0.5px solid black;
        }

        form input::placeholder {
          font-size: 1.3rem;
        }

        form button {
          width: 100px;
          height: 60px;
          background-color: #6abcde;
          font-weight: 300;
          color: white;
          border: 1px solid white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        form button:hover {
          width: 120px;
          background-color: #1874ac;
          font-weight: 600;
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
