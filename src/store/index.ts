import { atom } from "recoil";

export interface todoListType {
  id: number;
  text: string;
}

export const textListAtom = atom<todoListType[]>({
  key: "textListAtom", // unique ID
  default: [], // default value
});

export const textAtom = atom<string>({
  key: "textAtom", // unique ID
  default: "", // default value
});

export const countAtom = atom<number>({
  key: "countAtom", // unique ID
  default: 1, // default value
});
