import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { textListAtom, textAtom, countAtom, todoListType } from "../../store";

// 주의: 컴포넌트에게 전달되는 props는 key까지 포함하므로, 넘어오는 props를 재정의해주어야 함
interface IProps {
  key: number;
  todo: todoListType;
}
const TodoItem = (props: IProps): JSX.Element => {
  const [isEdit, setIsEdit] = useState<Boolean>(false);
  const [textList, setTextList] = useRecoilState<todoListType[]>(textListAtom);

  const handleEditMode = () => {
    setIsEdit((prev) => !prev);
  };

  // edit mode 활성화 후, input에 가해지는 event
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const newTextList = textList.map((todoItem) => {
      // 기존에 저장된 todoList의 데이터들 중, todoItem.id가
      // 현재 선택되어 props로 전달된 todoData의 id와 일치할 경우,
      // {id, text}를 보유중인 상황에서, id는 ...todoItem으로 spread, text는 새로이 입력된 value로 변경
      // id가 일치하지 않는 경우는, textList에서 뽑아온 데이터가 다른 것이므로, {id,text}를 그대로 반환해야 함
      if (todoItem.id === props.todo.id) {
        return { ...todoItem, text: value };
      } else {
        return todoItem;
      }
    });
    setTextList(newTextList);
  };

  // edit 종료를 위한 확인 작업
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setIsEdit(false);
  };

  return (
    <>
      <div className="todo_list">
        {!isEdit ? (
          <>
            <p>
              <a>{props.todo.text && props.todo.text}</a>
            </p>
            <div className="btn_wrap">
              <button onClick={handleEditMode}>
                <span>Edit</span>
              </button>
              <button>
                <span>Del</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <form className="edit_text_form" onSubmit={onSubmit}>
              <input type="text" value={props.todo.text} onChange={onChange} />
              <button type="submit">
                <span>Save</span>
              </button>
            </form>
          </>
        )}
      </div>
      <style jsx>{`
        .todo_list form {
        }

        .todo_list form input {
        }

        .todo_list form button {
          background-color: #00ca00;
          margin-left: 1rem;
        }

        .todo_list form button:hover {
          background-color: #03a503;
          transform: scale(0.95);
        }

        /* 자리 교체 필요 */

        .todo_list {
          width: 70%;
          position: relative;
          margin: 0.5rem 0;
          display: flex;
          align-items: center;
        }

        .todo_list::before {
          position: absolute;
          top: 14px;
          left: -11px;
          content: "";
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: #112a61;
        }

        .todo_list p {
          font-size: 1.3rem;
          color: #242424;
        }

        .todo_list p a {
          display: inline;
          position: relative;
        }

        .todo_list p a::after {
          content: "";
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #25aad0;
          transition: all 0.3s ease;
        }

        .todo_list p:hover a::after {
          /* 1%->100%로 채워지는 animation 구현 */
          width: 100%;
        }

        .btn_wrap {
          margin-left: 0.3rem;
        }

        button {
          border: none;
          border-radius: 5px;
          height: 1.8rem;
          width: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        button span {
          font-size: 1rem;
          font-weight: 100;
          text-align: center;
          color: white;
        }

        .btn_wrap button:nth-child(1) {
          background-color: #00ca00;
          margin-left: 1rem;
        }
        .btn_wrap button:nth-child(1):hover {
          background-color: #03a503;
          transform: scale(0.95);
        }

        .btn_wrap button:nth-child(2) {
          background-color: #ff4040;
          margin: 0 0.2rem;
        }
        .btn_wrap button:nth-child(2):hover {
          background-color: #e21b1b;
          transform: scale(0.95);
        }
      `}</style>
    </>
  );
};
export default TodoItem;
