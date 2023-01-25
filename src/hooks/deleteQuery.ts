import { ITodoItem } from "../pages/component/TodoList";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "react-query";

const DeleteQuery = (
  id: number,
  textList: ITodoItem[],
  setTextList: Dispatch<SetStateAction<ITodoItem[]>>
): UseMutationResult<void, unknown, void, void> => {
  return useMutation(
    async () => {
      return await axios
        .delete(`http://localhost:3001/todos/${id}`)
        .then(() => {
          setTextList(
            textList.filter((todoItem: ITodoItem) => {
              return todoItem.id !== id;
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
        useQueryClient().invalidateQueries("getTodoList");
      },

      // mutation 이 성공해서 성공한 데이터 또는 error가 전달될 때 실행된다. (성공하든 실패하든 아무튼 결과가 전달된다)
      onSettled: () => {
        console.log("end");
      },
    }
  );
};

export default DeleteQuery;
