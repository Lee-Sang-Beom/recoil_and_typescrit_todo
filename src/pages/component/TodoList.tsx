import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { textListAtom, textAtom, countAtom, todoListType } from "../../store";
import TodoItem from "./TodoItem";

interface MutableRefObject<T> {
  current: T;
}

interface RefObject<T> {
  readonly current: T | null;
}

export default function TodoList() {
  const [textList, setTextList] = useRecoilState<todoListType[]>(textListAtom);
  const [text, setText] = useRecoilState<string>(textAtom);
  const [id, setId] = useRecoilState<number>(countAtom);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // input 태그에 값을 입력할 때, state의 변화를 관리
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setText(value);
  };

  // input 태그에 사용자 일정을 입력한 후, 제출 로직을 구성
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // todoList에 새로운 todo를 추가하기 위하여, id를 포함한 새로운 객체로서 구성한다.
    const newText = {
      id,
      text,
    };

    // textList 갱신
    setTextList((prev) => {
      /*
        debug 1 : 사용자 입력에 따른 불변성 유지와 state 갱신부
        console.log("구조분해 미할당", prev);
        console.log("구조분해할당 prev", ...prev); 
      */
      return [...prev, newText];
    });

    // ID 갱신
    setId((prev) => prev + 1);

    // 입력 후, input 창 초기화
    setText("");
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
            textList.map((todo: todoListType) => (
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
