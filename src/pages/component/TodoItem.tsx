import React, { useState } from "react";
import { ITodoItem } from "./TodoList";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

// 주의: 컴포넌트에게 전달되는 props는 key까지 포함하므로, 넘어오는 props를 재정의해주어야 함
interface IProps {
  key: number;
  todo: ITodoItem;
}

const TodoItem = (props: IProps): JSX.Element => {
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState<Boolean>(false);
  const [textList, setTextList] = useState<ITodoItem[]>([]);
  const [text, setText] = useState<string>("");

  // delete 용도
  const deleteQuery = useMutation(
    async () => {
      return await axios
        .delete(`http://localhost:3001/todos/${props.todo.id}`)
        .then(() => {
          setTextList(
            textList.filter((todoItem: ITodoItem) => {
              return todoItem.id !== props.todo.id;
            })
          );
        })
        .then(() => alert("삭제되었습니다."))
        .catch((err: Error) => console.log(err));
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

        // 자동으로 get 요청 할 수 있도록 함
        queryClient.invalidateQueries("getTodoList");
      },

      // mutation 이 성공해서 성공한 데이터 또는 error가 전달될 때 실행된다. (성공하든 실패하든 아무튼 결과가 전달된다)
      onSettled: () => {
        console.log("end");
      },
    }
  );

  const handleEditMode = () => {
    setIsEdit((prev) => !prev);
  };

  const handleDelete = async () => {
    deleteQuery.mutate();
  };

  // edit mode 활성화 후, input에 가해지는 event
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setText(value);
  };

  // edit 종료를 위한 제출 작업 (put: 덮어쓰기 사용)
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await axios
      .put(`http://localhost:3001/todos/${props.todo.id}`, {
        id: props.todo.id,
        text: text,
      })
      .then(() => {
        const newTextList = textList.map((textObj) => {
          if (textObj.id === props.todo.id) {
            /* 
            textList 내의 요소와, 사용자가 선택한 todoItem과의 ID를 비교해
            textObj={id, text} 중, text key에 해당하는 value만 
            사용자가 입력한 e.target.value값으로 변경
            */
            return {
              ...textObj, // ID
              text: text, // text
            };
          }
          return textObj;
        });
        setTextList(newTextList);
      })
      .then(() => alert("갱신이 성공하였습니다."))
      .catch((err: Error) => alert("갱신이 실패하였습니다."));

    // debug 3 : 수정 중, newTextList의 변화
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
              <button onClick={handleDelete}>
                <span>Del</span>
              </button>
            </div>
          </>
        ) : (
          <form className="edit_text_form" onSubmit={onSubmit}>
            <input type="text" value={text} onChange={onChange} />
            <button type="submit">
              <span>Save</span>
            </button>
          </form>
        )}
      </div>
      <style jsx>{`
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
          left: 50%;
          width: 0;
          height: 2px;
          background-color: #25aad0;
          transition: all 0.3s ease;
        }

        .todo_list p a::before {
          content: "";
          position: absolute;
          bottom: -5px;
          right: 50%;
          width: 0;
          height: 2px;
          background-color: #25aad0;
          transition: all 0.3s ease;
        }

        .todo_list p:hover a::after {
          /* 중앙에서 오른쪽으로 50%로 채워지는 animation 구현 */
          width: 50%;
        }

        .todo_list p:hover a::before {
          /* 중앙에서 왼쪽으로 50% 채워지는 animation 구현 */
          width: 50%;
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

        .todo_list form button {
          background-color: #00ca00;
          margin-left: 1rem;
        }

        .todo_list form button:hover {
          background-color: #03a503;
          transform: scale(0.95);
        }
      `}</style>
    </>
  );
};
export default TodoItem;
