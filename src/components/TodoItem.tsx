import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {observer, useLocalObservable} from 'mobx-react-lite';
import {Checkbox, IconButton} from 'react-native-paper';

import todoStore from '../stores';
import {ITodoItem} from '../stores/types';

interface TodoItemProps {
  todo: ITodoItem;
}

interface TodoValue {
  newTodo: string;
}

export const TodoItem = observer(({todo: todoProp}: TodoItemProps) => {
  /** STATES */
  const {control, handleSubmit} = useForm<TodoValue>({
    defaultValues: {newTodo: todoProp.contents},
  });

  /** FUNCTIONS */
  const onSubmit = handleSubmit(data => {
    // 빈값이면 삭제, 아니면 수정
    if (!data.newTodo.trim()) {
      todoStore.deleteTodoItem(todoProp.id);

      return;
    }

    const targetIndex = todoStore.todos.findIndex(
      todo => todo.id === todoProp.id,
    );
    const newTodoItem = {
      ...todoProp,
      contents: data.newTodo,
    };

    todoStore.setTodoItem(targetIndex, newTodoItem);
    state.editing = false;
  });

  /** HOOK */
  // todo item을 위한 local store
  const state = useLocalObservable(() => ({
    editing: false,
    selectedItem: todoProp,
    handleInputTouch() {
      if (state.editing) {
        return;
      }

      state.editing = !state.editing;
    },
    handleChangeCompleted(todoItem: ITodoItem) {
      const targetIndex = todoStore.todos.findIndex(
        todo => todo.id === todoItem.id,
      );
      const newTodoItem = {
        ...todoItem,
        isCompleted: !todoItem.isCompleted,
      };

      todoStore.setTodoItem(targetIndex, newTodoItem);
    },
  }));

  const onDelete = () => {
    todoStore.deleteTodoItem(todoProp.id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <TouchableOpacity>
          <Checkbox
            status={todoProp.isCompleted ? 'checked' : 'unchecked'}
            onPress={() => {
              state.handleChangeCompleted(todoProp);
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={state.handleInputTouch}
          style={styles.itemInput}>
          {state.editing ? (
            // enter키로 submit 하기 위해 useForm controller 사용
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <TextInput
                  value={value}
                  autoFocus={true}
                  onChangeText={onChange}
                  onBlur={onSubmit}
                  onSubmitEditing={onSubmit}
                />
              )}
              name="newTodo"
            />
          ) : (
            <Text ellipsizeMode={'tail'} numberOfLines={1}>
              {todoProp.contents}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <IconButton icon="close" onPress={onDelete} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#d1d1d1',
    borderBottomWidth: 1,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemInput: {
    flex: 1,
  },
});
