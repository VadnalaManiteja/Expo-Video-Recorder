import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import VideoRecorder from './VideoRecorder';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <VideoRecorder />
      </SafeAreaView>
    </>
  );
};

export default App;