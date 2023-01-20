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

  // 단순히 불러오는 구문은 useQuery이용
  const { isLoading, isError, data, error } = useQuery(
    "getTodoList",
    fetchTodoList,
    {
      refetchOnWindowFocus: false,
      retry: 0,

      // 쿼리 성공 시, 실행되는 함수. (data는 성공 시 서버에서 넘어오는 response 값)
      onSuccess: (data) => {
        setText(""); // 최초 get 수행 시에도 input은 비어 있도록 구성
        setTextList(data);
      },

      // 쿼리 실패 시, 실행되는 함수. (매개변수로, error 값을 받을 수 있다.)
      onError: (error: Error) => {
        console.log(error.message);
      },
    }
  );

  // post 용도
  const postMutation = useMutation(
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
      onMutate: (variable) => {
        // console.log("onMutate", variable);
        // variable : {loginId: 'xxx', password; 'xxx'}
      },
      onError: (error, variable, context) => {
        // error
      },
      onSuccess: (data, variables, context) => {
        // console.log("success", data, variables, context);
        queryClient.invalidateQueries("getTodoList");
      },
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
    postMutation.mutate();
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
