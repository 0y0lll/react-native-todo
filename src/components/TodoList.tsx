import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {observer, useLocalObservable} from 'mobx-react-lite';
import {Button} from 'react-native-paper';

import {TodoItem} from '../components';
import todoStore from '../stores';

enum Type {
  ALL,
  ACTIVE,
  COMPLETED,
}

interface ButtonProps {
  filter: boolean;
  title: string;
  onPress: () => void;
}

const FilterButton = ({filter, title, onPress}: ButtonProps) => (
  <Button
    onPress={onPress}
    mode="outlined"
    style={[styles.button, filter ? styles.buttonPrimary : '']}>
    <Text style={filter && styles.textPrimary}>{title}</Text>
  </Button>
);

export const TodoList = observer(() => {
  /** HOOK */
  // useLocalObservable: mount 될 때 한번만 생성됨
  const state = useLocalObservable(() => ({
    type: Type.ALL,
    handleButtonClick(type: Type) {
      state.type = type;
    },
    getFilterdTodoList() {
      if (state.type === Type.ACTIVE) {
        return todoStore.todos.filter(todo => !todo.isCompleted);
      }

      if (state.type === Type.COMPLETED) {
        return todoStore.todos.filter(todo => todo.isCompleted);
      }

      return todoStore.todos;
    },
  }));

  return (
    <View style={styles.container}>
      <View style={styles.scrollViewWrapper}>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          {state.getFilterdTodoList().map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.footer}>
        <FilterButton
          title={'All'}
          filter={state.type === Type.ALL}
          onPress={() => {
            state.handleButtonClick(Type.ALL);
          }}
        />
        <FilterButton
          title={'Active'}
          filter={state.type === Type.ACTIVE}
          onPress={() => {
            state.handleButtonClick(Type.ACTIVE);
          }}
        />
        <FilterButton
          title={'Completed'}
          filter={state.type === Type.COMPLETED}
          onPress={() => {
            state.handleButtonClick(Type.COMPLETED);
          }}
        />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollViewWrapper: {
    height: '85%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  button: {
    borderColor: '#6750a4',
    marginHorizontal: 3,
  },
  buttonPrimary: {
    backgroundColor: '#6750a4',
  },
  textPrimary: {
    color: '#fff',
  },
});
