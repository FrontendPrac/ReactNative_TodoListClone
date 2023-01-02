import React from "react";
import styled from "@emotion/native";

import { Text, TextInput } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const Todo = ({
  todo,
  saveEditInput,
  editTodo,
  doneTodo,
  openEditInput,
  deleteTodo,
  deleteTodoFirestore,
  toggleIsEditFirestore,
  editTodoFirestore,
  toogleIsDoneFirestore,
}) => {
  return (
    <StTodo key={todo.id}>
      {todo.isEdit ? (
        <TextInput
          onChangeText={saveEditInput}
          onSubmitEditing={() => editTodoFirestore(todo.id)}
          style={{ flex: 1, backgroundColor: "white" }}
        ></TextInput>
      ) : (
        <Text
          style={{
            textDecorationLine: todo.isDone === true ? "line-through" : "none",
          }}
        >
          {todo.text}
        </Text>
      )}
      <StTodoButtons>
        <StTodoButton onPress={() => toogleIsDoneFirestore(todo.id)}>
          <AntDesign name="checksquareo" size={24} color="black" />
        </StTodoButton>
        <StTodoButton onPress={() => toggleIsEditFirestore(todo.id)}>
          <Feather name="edit" size={24} color="black" />
        </StTodoButton>
        <StTodoButton onPress={() => deleteTodoFirestore(todo.id)}>
          <AntDesign name="delete" size={24} color="black" />
        </StTodoButton>
      </StTodoButtons>
    </StTodo>
  );
};

export default Todo;

const StTodo = styled.View`
  background-color: #b8b7c9;
  margin-bottom: 10px;
  padding: 10px;
  flex-direction: row;
  justify-content: space-between;
`;

const StTodoButtons = styled.View`
  flex-direction: row;
`;

const StTodoButton = styled.TouchableOpacity`
  margin-left: 10px;
`;
