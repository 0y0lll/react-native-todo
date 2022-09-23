import React from 'react';
import {
  Platform,
  TextInput,
  Text,
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {observer} from 'mobx-react-lite';

import {TodoList} from '../components';
import todoStore from '../stores';

interface TodoType {
  todo: string;
}

// for ios
const screenHeight = Dimensions.get('window').height;
// for android(type number || undefined여서 0으로 초기화)
const statusHeight = StatusBar.currentHeight || 0;

export const TodoPage = observer(() => {
  /** STATES */
  const {control, handleSubmit, setValue} = useForm<TodoType>();

  /** FUNCTIONS */
  const onSubmit = handleSubmit(data => {
    if (!data.todo.trim()) {
      return;
    }

    const id = new Date().getTime();
    const todo = {
      id,
      contents: data.todo,
      isCompleted: false,
    };

    todoStore.setTodoList(todo);
    setValue('todo', '');
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Todo List</Text>

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, value}}) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              style={styles.textInput}
              onSubmitEditing={onSubmit}
            />
          )}
          name="todo"
        />
      </View>

      <TodoList />
    </View>
  );
});

// paper input으로 변경하면 submit 안됨
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 40,
    padding: 30,
    shadowColor: '#000',
    ...Platform.select({
      ios: {
        height: screenHeight - 80,
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 0.2,
      },
      android: {
        height: screenHeight - statusHeight,
        elevation: 3,
      },
    }),
  },
  header: {
    marginVertical: 10,
  },
  title: {
    marginTop: 30,
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  textInput: {
    borderColor: '#d1d1d1',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
  },
});
