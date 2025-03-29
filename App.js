import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageCapture from './ImageCapture';
import ImageGallery from './ImageGallery';

export default function App() {
  const [capturedImages, setCapturedImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false);

  // Load stored images when app starts
  useEffect(() => {
    loadImages();
  }, []);

  // Function to load images from AsyncStorage
  const loadImages = async () => {
    try {
      const storedImages = await AsyncStorage.getItem('capturedImages');
      if (storedImages) {
        setCapturedImages(JSON.parse(storedImages));
      }
    } catch (error) {
      console.error('Failed to load images', error);
    }
  };

  // Function to handle image capture and store it locally
  const handleCapture = async (imageUri) => {
    const updatedImages = [...capturedImages, imageUri];
    setCapturedImages(updatedImages);

    try {
      await AsyncStorage.setItem('capturedImages', JSON.stringify(updatedImages));
    } catch (error) {
      console.error('Failed to save image', error);
    }
  };

  return (
    <View style={styles.container}>
      {showGallery ? (
        <ImageGallery images={capturedImages} onBack={() => setShowGallery(false)} />
      ) : (
        <View style={styles.container}>
          <ImageCapture onCapture={handleCapture} />
          <TouchableOpacity onPress={() => setShowGallery(true)} style={styles.galleryButton}>
            <Text style={styles.buttonText}>View Gallery</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  galleryButton: {
    backgroundColor: 'green',
    padding: 10,
    margin: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
