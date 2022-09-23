module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['@emotion'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
