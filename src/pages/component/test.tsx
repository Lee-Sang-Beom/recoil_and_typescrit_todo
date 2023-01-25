import * as React from "react";
import axios from "axios";
import styled from "styled-components";
import { useQuery } from "react-query";

interface Iperson {
  id: number;
  name: string;
  phone: string;
  age: number;
}

const Query = (): JSX.Element => {
  const getPersons = () => {
    const res = useQuery(["persons"], () =>
      axios.get("http://localhost:8080/persons")
    ); // API 호출

    // 로딩 중일 경우
    if (res.isLoading) {
      return <LoadingText>Loading...</LoadingText>;
    }

    // 결과값이 전달되었을 경우
    if (res.data) {
      const persons: Iperson[] = res.data.data;

      return (
        <Person.Container>
          {persons.map((person) => {
            return (
              <Person.Box key={person.id}>
                <Person.Title>{person.id}.</Person.Title>
                <Person.Text>{person.name}</Person.Text>
                <Person.Text>({person.age})</Person.Text>
              </Person.Box>
            );
          })}
        </Person.Container>
      );
    }
  };

  return <Wrapper>{getPersons()}</Wrapper>;
};

export default Query;

const Wrapper = styled.div`
  max-width: 728px;

  margin: 0 auto;
`;

const LoadingText = styled.h3`
  text-align: center;
`;

const Person = {
  Container: styled.div`
    padding: 8px;
  `,

  Box: styled.div`
    border-bottom: 2px solid olive;
  `,

  Title: styled.h2`
    display: inline-block;

    margin: 0 12px;

    line-height: 48px;
  `,

  Text: styled.span`
    margin: 0 6px;
  `,
};
