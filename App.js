import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import styled from "@emotion/native";

import React, { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { dbService } from "./firebase";

import Nav from "./components/Nav";
import Todo from "./components/Todo";

// import axios from "axios";

const App = () => {
  // 2. state를 생성한다
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [todos, setTodos] = useState([]);
  const [editText, setEditText] = useState("");

  // 1. 데이터 구조를 설계한다
  const newTodo = {
    // id: Date.now(),
    text,
    isDone: false,
    isEdit: false,
    category,
    createdAt: Date.now(),
  };

  // 3. 함수를 생성한다
  // 3-1. saveInput : input창에 데이터를 저장한다
  const saveInput = (enteredText) => {
    setText(enteredText);
  };
  // console.log("text: ", text);

  // 3-2. addTodo : input창에서 enter를 누르면 Todo를 추가한다
  const addTodo = () => {
    setTodos((prev) => [...todos, newTodo]);
    setText("");
  };
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
  const deleteTodo = (id) => {
    Alert.alert("Todo 삭제", "정말로 삭제하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
        onPress: () => console.log("취소"),
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          const newTodos = todos.filter((todo) => todo.id !== id);
          setTodos(newTodos);
        },
      },
    ]);
  };

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
  //   } catch {
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
  //       const receive_category = await AsyncStorage.getItem("category");
  //       setTodos(JSON.parse(receive_todos));
  //       setCategory(receive_category ?? "js");
  //     };
  //     getTodos();
  //   } catch {
  //     console.log("Error");
  //   }
  // }, []);

  // 5. firestore에 데이터를 관리한다
  // 5-1. getCategoryFirebase : getDoc
  const getCategoryFirestore = async () => {
    try {
      const receive_category = await getDoc(
        doc(dbService, "category", "currentCategory")
      );
      // console.log("receive_category.id: ", receive_category.id);
      // console.log("receive_category.data(): ", receive_category.data());
      setCategory(receive_category.data().category ?? "js");
    } catch {
      console.log("Error");
    }
  };

  // 5-2. saveCategoryFirestore : updateDoc
  const saveCategoryFirestore = async (cat) => {
    setCategory(cat);
    await updateDoc(doc(dbService, "category", "currentCategory"), {
      category: cat,
    });
    try {
    } catch {
      console.log("Error");
    }
  };

  // 5-3. getTodosFirestore
  // onSnapShot API를 이용해서 todos 콜렉션에 변경이 생길 때 마다
  // todos 콜렉션 안의 모든 document들을 불러와서 setTodos 한다
  const getTodosFirestore = () => {
    try {
      const q = query(
        collection(dbService, "todos"),
        orderBy("createdAt", "desc")
      );

      onSnapshot(q, (snapshot) => {
        const newTodos = snapshot.docs.map((doc) => {
          const newTodo = {
            id: doc.id,
            ...doc.data(),
          };
          return newTodo;
        });
        setTodos(newTodos);
      });
    } catch {
      console.log("Error");
    }
  };

  useEffect(() => {
    getCategoryFirestore();
    getTodosFirestore();
  }, []);

  // 5-4. addTodoFirestore
  const addTodoFirestore = async () => {
    try {
      await addDoc(collection(dbService, "todos"), newTodo);
      setText("");
    } catch {
      console.log("Error");
    }
  };

  // 5-5. deleteTodoFirestore
  const deleteTodoFirestore = (id) => {
    try {
      Alert.alert("Todo 삭제", "정말로 삭제하시겠습니까?", [
        {
          text: "취소",
          style: "cancel",
          onPress: () => console.log("취소"),
        },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            await deleteDoc(doc(dbService, "todos", id));
          },
        },
      ]);
    } catch {
      console.log("Error");
    }
  };

  // 5-6. toggleIsEditFirestore
  const toggleIsEditFirestore = async (id) => {
    try {
      const idx = todos.findIndex((todo) => todo.id === id);
      await updateDoc(doc(dbService, "todos", id), {
        isEdit: !todos[idx].isEdit,
      });
    } catch {
      console.log("Error");
    }
  };

  // 5-7. editTodoFirestore
  const editTodoFirestore = async (id) => {
    try {
      await updateDoc(doc(dbService, "todos", id), {
        text: editText,
        isEdit: false,
      });
    } catch {
      console.log("Error");
    }
  };

  // 5-8. toggleIsDoneFirestore
  const toogleIsDoneFirestore = async (id) => {
    try {
      const idx = todos.findIndex((todo) => todo.id === id);
      await updateDoc(doc(dbService, "todos", id), {
        isDone: !todos[idx].isDone,
      });
    } catch {
      console.log("Error");
    }
  };

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
        <Nav
          category={category}
          saveCategoryFirestore={saveCategoryFirestore}
        />

        <View className="Form">
          <StInputContainer>
            <StInput>
              <TextInput
                onChangeText={saveInput}
                onSubmitEditing={addTodoFirestore}
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
                <Todo
                  key={todo.id}
                  todo={todo}
                  saveEditInput={saveEditInput}
                  editTodo={editTodo}
                  doneTodo={doneTodo}
                  openEditInput={openEditInput}
                  deleteTodo={deleteTodo}
                  deleteTodoFirestore={deleteTodoFirestore}
                  toggleIsEditFirestore={toggleIsEditFirestore}
                  editTodoFirestore={editTodoFirestore}
                  toogleIsDoneFirestore={toogleIsDoneFirestore}
                />
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
