import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { Video } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VideoRecorder = () => {
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videos, setVideos] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [facing, setFacing] = useState("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const savedVideos = await AsyncStorage.getItem('recordedVideos');
      if (savedVideos) {
        setVideos(JSON.parse(savedVideos));
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  };

  const startRecording = async () => {
    if (cameraRef.current && !isRecording) {
      setIsRecording(true);
      
      try {
        const video = await cameraRef.current.recordAsync({
          maxDuration: 60, // 60 seconds max recording
          mute: false,
        });
        
        // Save to media library
        await MediaLibrary.saveToLibraryAsync(video.uri);
        
        // Save video info to AsyncStorage
        const newVideo = {
          uri: video.uri,
          date: new Date().toISOString(),
        };
        
        const updatedVideos = [...videos, newVideo];
        await AsyncStorage.setItem('recordedVideos', JSON.stringify(updatedVideos));
        setVideos(updatedVideos);
      } catch (error) {
        console.error('Error recording video:', error);
      } finally {
        setIsRecording(false);
      }
    }
  };

  const stopRecording = async () => {
    if (isRecording && cameraRef.current) {
      try {
        await cameraRef.current.stopRecording();
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
  };

  const toggleCamera = () => {
    setShowCamera(!showCamera);
    setShowVideos(false);
  };

  const toggleVideos = () => {
    setShowVideos(!showVideos);
    setShowCamera(false);
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  if (!cameraPermission || !microphonePermission) {
    return <View />;
  }

  if (!cameraPermission.granted || !microphonePermission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to use the camera and microphone
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestCameraPermission}>
          <Text style={styles.buttonText}>Grant Camera Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={requestMicrophonePermission}>
          <Text style={styles.buttonText}>Grant Microphone Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={toggleCamera}
        >
          <Text style={styles.buttonText}>
            {showCamera ? 'Hide Camera' : 'Start Video Recording'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={toggleVideos}
        >
          <Text style={styles.buttonText}>View Records</Text>
        </TouchableOpacity>
      </View>

      {showCamera && (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
            enableTorch={false}
            videoQuality="1080p"
          >
            <View style={styles.recordingControls}>
              <TouchableOpacity
                onPress={isRecording ? stopRecording : startRecording}
                style={[styles.recordButton, isRecording && styles.stopButton]}
              >
                <Text style={styles.recordButtonText}>
                  {isRecording ? 'Stop' : 'Record'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={toggleCameraFacing}
                style={styles.flipButton}
              >
                <Text style={styles.flipButtonText}>Flip</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      )}

      {showVideos && (
        <View style={styles.videosContainer}>
          {videos.length === 0 ? (
            <Text style={styles.noVideosText}>No videos recorded yet</Text>
          ) : (
            <FlatList
              data={videos}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.videoItem}>
                  <Video
                    source={{ uri: item.uri }}
                    style={styles.video}
                    useNativeControls
                    resizeMode="contain"
                    shouldPlay={false}
                  />
                  <Text style={styles.videoDate}>
                    {new Date(item.date).toLocaleString()}
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  recordingControls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  recordButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 50,
    width: 80,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: 'black',
  },
  recordButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 10,
    width: 80,
    alignItems: 'center',
  },
  flipButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  videosContainer: {
    flex: 1,
    padding: 20,
  },
  videoItem: {
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
  },
  videoDate: {
    marginTop: 5,
    color: '#666',
  },
  noVideosText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default VideoRecorder;