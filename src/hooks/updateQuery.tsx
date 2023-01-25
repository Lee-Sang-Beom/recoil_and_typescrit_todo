import { useMutation, useQueryClient } from "react-query";
import { ITodoItem } from "@/pages/component/TodoList";
import axios from "axios";
import React, { Dispatch, SetStateAction } from "react";

interface IProps {
  id: number;
  text: string;
  textList: ITodoItem[];
  setIsEdit: (bool: boolean) => void;
  setText: Dispatch<SetStateAction<string>>;
  setTextList: Dispatch<SetStateAction<ITodoItem[]>>;
}

const UQuery: React.FC<IProps> = ({
  id,
  text,
  textList,
  setIsEdit,
  setText,
  setTextList,
}) => {
  // update 용도
  // 분리를 위해서는 https://velog.io/@sham/Invalid-hook-call-hooks%EC%9D%84-%EB%AA%A8%EB%93%88%ED%99%94-%ED%95%A0-%EC%88%98-%EC%9E%88%EB%8A%94%EA%B0%80 이용
  const updateQuery = useMutation(
    async () => {
      return await axios
        .put(`http://localhost:3001/todos/${id}`, {
          id: id,
          text: text,
        })
        .then(() => {
          const newTextList = textList.map((textObj) => {
            if (textObj.id === id) {
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
        .catch((err: Error) => alert(`갱신이 실패하였습니다. ${err}`));
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
        console.log("UPDATE error", error, variable, context);
      },
      // mutation이 성공하고 결과를 전달할 때 사용
      onSuccess: (data, variables, context) => {
        console.log("UPDATE success", data, variables, context);

        // 자동으로 get 요청 할 수 있도록 함
        queryClient.invalidateQueries("getTodoList");
      },

      // mutation 이 성공해서 성공한 데이터 또는 error가 전달될 때 실행된다. (성공하든 실패하든 아무튼 결과가 전달된다)
      onSettled: () => {
        console.log("UPDATE 성공 및 실패 여부와 상관없이 실행되는 함수");
      },
    }
  );

  const queryClient = useQueryClient();

  // edit 종료를 위한 제출 작업 (put: 덮어쓰기 사용)
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateQuery.mutate();
    setIsEdit(false);
  };

  // edit mode 활성화 후, input에 가해지는 event
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setText(value);
  };

  return (
    <>
      <form className="edit_text_form" onSubmit={onSubmit}>
        <input type="text" value={text} onChange={onChange} />
        <button type="submit">
          <span>Save</span>
        </button>
      </form>
    </>
  );
};

export default UQuery;
