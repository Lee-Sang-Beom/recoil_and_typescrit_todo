import { useRecoilState } from "recoil";
import { textListAtom, textAtom, countAtom, todoListType } from "../../store";

// 주의: 컴포넌트에게 전달되는 props는 key까지 포함하므로, 넘어오는 props를 재정의해주어야 함
interface IProps {
  key: number;
  todo: todoListType;
}
const TodoItem = (props: IProps): JSX.Element => {
  return (
    <>
      <div className="todo_list">
        <p>{props.todo.text && props.todo.text}</p>
        <div className="btn_wrap">
          <button>
            <span>Edit</span>
          </button>
          <button>
            <span>Del</span>
          </button>
        </div>
      </div>
      <style jsx>{`
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

        .todo_list p:hover {
           {
            /* 밑줄 추가 */
          }
        }

        .btn_wrap {
          margin-left: 0.3rem;
        }

        .btn_wrap button {
          border: none;
          border-radius: 5px;
          height: 1.8rem;
          width: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn_wrap button span {
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
