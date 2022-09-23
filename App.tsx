import React from 'react';
import {
  Platform,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  StatusBar,
} from 'react-native';

import {TodoPage} from './src/pages';

const App = () => {
  return (
    <ImageBackground
      source={require('./src/pages/images/bg.jpg')}
      style={styles.containerBackground}>
      {Platform.OS === 'android' && (
        <StatusBar translucent backgroundColor="transparent" />
      )}

      <SafeAreaView style={styles.container}>
        <TodoPage />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  containerBackground: {
    width: '100%',
    height: '100%',
  },
  container: {
    justifyContent: 'center',
    marginHorizontal: '5%',
    flex: 1,
    ...Platform.select({
      android: {
        marginTop: 20,
      },
    }),
  },
});

export default App;
