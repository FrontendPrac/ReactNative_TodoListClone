import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import styled from "@emotion/native";

import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import React, { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { dbService } from "./firebase";
import { async } from "@firebase/util";

// import axios from "axios";

const App = () => {
  // 2. state를 생성한다
  const [text, setText] = useState("");
  const [category, setCategory] = useState("js");
  const [todos, setTodos] = useState([]);
  const [editTerxt, setEditText] = useState("");

  // 1. 데이터 구조를 설계한다
  const newTodo = {
    id: Date.now(),
    text,
    isDone: false,
    isEdit: false,
    category,
  };

  // 3. 함수를 생성한다
  // 3-1. saveInput : input창에 데이터를 저장한다
  const saveInput = (enteredText) => {
    setText(enteredText);
  };
  // console.log("text: ", text);

  // 3-2. addTodo : input창에서 enter를 누르면 Todo를 추가한다
  // const addTodo = () => {
  //   setTodos((prev) => [...todos, newTodo]);
  //   setText("");
  // };
  // console.log("todos: ", todos);

  // 3-3. setCategory : 카테고리 버튼을 누르면 해당 카테고리가 보인다

  // 3-4. doneTodo : 체크 버튼을 누르면 해당 글에 취소선을 표시한다
  const doneTodo = (id) => {
    const newTodos = [...todos];
    const idx = newTodos.findIndex((todo) => todo.id === id);
    newTodos[idx].isDone = !newTodos[idx].isDone;
    setTodos(newTodos);
  };

  // 3-5. deleteTodo : 휴지통 버튼을 누르면 해당 글을 삭제한다
  // const deleteTodo = (id) => {
  //   Alert.alert("Todo 삭제", "정말로 삭제하시겠습니까?", [
  //     {
  //       text: "취소",
  //       style: "cancel",
  //       onPress: () => console.log("취소"),
  //     },
  //     {
  //       text: "삭제",
  //       style: "destructive",
  //       onPress: () => {
  //         const newTodos = todos.filter((todo) => todo.id !== id);
  //         setTodos(newTodos);
  //       },
  //     },
  //   ]);
  // };

  // 3-6. openEditInput
  // 노트 버튼을 누르면 isEdit을 토글링하여
  // 해당 글을 수정할 수 있는 인풋창이 나오도록 한다
  const openEditInput = (id) => {
    const newTodos = [...todos];
    const idx = newTodos.findIndex((todo) => todo.id === id);
    newTodos[idx].isEdit = !newTodos[idx].isEdit;
    setTodos(newTodos);
  };

  // 3-7. saveEditInput : editInput창에 데이터를 저장한다
  const saveEditInput = (enteredText) => {
    setEditText(enteredText);
  };
  // console.log(editText);

  // 3-8. editTodo : editText에서 받은 값을 반영해 Todo를 수정한다
  const editTodo = (id) => {
    const newTodos = [...todos];
    const idx = newTodos.findIndex((todo) => todo.id === id);
    newTodos[idx].text = editText;
    newTodos[idx].isEdit = false;
    setTodos(newTodos);
  };

  // 4. async-storage에 데이터를 저장하고 가져온다
  // 4-1. saveTodos : AsyncStorage.setItem, JSON.stringify
  // useEffect(() => {
  //   try {
  //     const saveTodos = async () => {
  //       await AsyncStorage.setItem("todos", JSON.stringify(todos));
  //     };
  //     // console.log(todos);
  //     if (todos.length > 0) saveTodos();
  //   } catch (e) {
  //     console.log("Error");
  //   }
  // }, [todos]);

  // 4-2. saveCategory
  // const saveCategory = async (cat) => {
  //   setCategory(cat);
  //   await AsyncStorage.setItem("category", cat);
  // };

  // 4-3. getTodos : AsyncStorage.getItem, JSON.parse
  // useEffect(() => {
  //   try {
  //     const getTodos = async () => {
  //       const receive_todos = await AsyncStorage.getItem("todos");
  //       // console.log(receive_todos);
  //       const receive_category = await AsyncStorage.getItem("category");
  //       // console.log(receive_category);
  //       setTodos(JSON.parse(receive_todos));
  //       setCategory(receive_category ?? "js");
  //     };
  //     getTodos();
  //   } catch (e) {
  //     console.log("Error");
  //   }
  // }, []);

  // 5. firestore
  // 5-1. saveTodoFirestore : addDoc
  // input창에 데이터를 넣고 enter를 누르면 파이어 스토어에 todo를 추가한다
  const saveTodoFirestore = async () => {
    await addDoc(collection(dbService, "todos"), newTodo);
    setText("");
  };

  // 5-2. saveCategoryFirestore : addDoc
  // 카테고리 버튼을 누르면 파이어 스토어에 category를 추가한다
  const saveCategoryFirestore = async (cat) => {
    try {
      setCategory(cat);
      await addDoc(collection(dbService, "category"), { category: cat });
    } catch {
      console.log("Error");
    }
  };

  // 5-3. getTodosFirestore : query, onSnapshot, getDocs
  // 파이어 스토어에 있는 데이터를 가져와 todos, category를 변경한다.
  const getTodosFirestore = async () => {
    const newTodos = [];
    const querySnapshot = await getDocs(collection(dbService, "todos"));
    querySnapshot.forEach((doc) => {
      const newTodo = {
        id: doc.id,
        ...doc.data(),
      };
      newTodos.push(newTodo);
      // console.log(newTodos);
      setTodos(newTodos);
    });
  };

  useEffect(() => {
    getTodosFirestore();
  }, []);

  // 5-4. deleteTodoFirestore : deleteDoc
  const deleteTodoFirestore = async ({ id }) => {
    await deleteDoc(doc(dbService, `todos/${id}/`));
  };

  // 5-5. updateDoc

  // 6. json-server, axios : GET, POST
  // 6-1. json-server에 있는 todos를 가져온다
  // const fetchTodos = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:4000/todos");
  //     console.log(response);
  //   } catch {
  //     console.log("Error");
  //   }
  // };

  // useEffect(() => {
  //   fetchTodos();
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <StNav className="Nav">
          <StNavButton
            onPress={() => saveCategoryFirestore("js")}
            style={{
              backgroundColor: category === "js" ? "#ffdb4d" : "#96e4eb",
            }}
          >
            <StNavText>JavaScript</StNavText>
          </StNavButton>
          <StNavButton
            onPress={() => saveCategoryFirestore("react")}
            style={{
              backgroundColor: category === "react" ? "#ffdb4d" : "#96e4eb",
            }}
          >
            <StNavText>React</StNavText>
          </StNavButton>
          <StNavButton
            onPress={() => saveCategoryFirestore("react-native")}
            style={{
              backgroundColor:
                category === "react-native" ? "#ffdb4d" : "#96e4eb",
            }}
          >
            <StNavText>ReactNative</StNavText>
          </StNavButton>
        </StNav>

        <View className="Form">
          <StInputContainer>
            <StInput>
              <TextInput
                onChangeText={saveInput}
                onSubmitEditing={saveTodoFirestore}
                value={text}
                placeholder="Enter your task"
                style={styles.input}
              />
            </StInput>
          </StInputContainer>
        </View>

        <View className="TodoList">
          {todos.map((todo) => {
            if (category === todo.category) {
              return (
                <StTodo key={todo.id}>
                  {todo.isEdit ? (
                    <TextInput
                      onChangeText={saveEditInput}
                      onSubmitEditing={() => editTodo(todo.id)}
                      style={{ flex: 1, backgroundColor: "white" }}
                    ></TextInput>
                  ) : (
                    <Text
                      style={{
                        textDecorationLine:
                          todo.isDone === true ? "line-through" : "none",
                      }}
                    >
                      {todo.text}
                    </Text>
                  )}
                  <StTodoButtons>
                    <StTodoButton onPress={() => doneTodo(todo.id)}>
                      <AntDesign name="checksquareo" size={24} color="black" />
                    </StTodoButton>
                    <StTodoButton onPress={() => openEditInput(todo.id)}>
                      <Feather name="edit" size={24} color="black" />
                    </StTodoButton>
                    <StTodoButton onPress={() => deleteTodoFirestore(todo.id)}>
                      <AntDesign name="delete" size={24} color="black" />
                    </StTodoButton>
                  </StTodoButtons>
                </StTodo>
              );
            }
          })}
        </View>
        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingLeft: 20,
    paddingRight: 20,
    // flex: 1,
  },
  input: {
    height: 40,
  },
});

const StNav = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 10px;
  margin-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-color: black;
`;

const StNavButton = styled.TouchableOpacity`
  flex-basis: 30%;
  height: 50px;
  border: 1px solid black;
  justify-content: center;
`;

const StNavText = styled.Text`
  text-align: center;
  font-weight: bold;
`;

const StInputContainer = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: black;
  margin: 0 0 20px 0;
`;

const StInput = styled.View`
  border: 1px solid black;
  margin: 0 0 20px 0;
  padding-left: 10px;
`;

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
