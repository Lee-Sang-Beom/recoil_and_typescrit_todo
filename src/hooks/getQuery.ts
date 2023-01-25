import { ITodoItem } from "../pages/component/TodoList";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "react-query";

export default function getQuery(
  func: () => Promise<any>,
  setText: Dispatch<SetStateAction<string>>,
  setTextList: Dispatch<SetStateAction<ITodoItem[]>>
) {
  const { isLoading } = useQuery("getTodoList", func, {
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
  });

  if (isLoading) {
    console.log("loading...");
  } else {
    console.log("complete(GET) data load");
  }
}
