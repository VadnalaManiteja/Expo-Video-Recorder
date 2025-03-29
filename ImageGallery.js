import React, { useEffect, useState } from 'react';
import { View, Image, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

export default function ImageGallery({ images, onBack }) {
  const [imageList, setImageList] = useState(images);

  useEffect(() => {
    setImageList(images);
  }, [images]);

  // Function to delete an image
  const deleteImage = async (imageUri) => {
    try {
      // Remove file from storage
      await FileSystem.deleteAsync(imageUri, { idempotent: true });

      // Update stored images
      const updatedImages = imageList.filter((img) => img !== imageUri);
      setImageList(updatedImages);
      await AsyncStorage.setItem('capturedImages', JSON.stringify(updatedImages));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={imageList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.image} />
            <TouchableOpacity onPress={() => deleteImage(item)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.buttonText}>Back to Camera</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
    margin: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 5,
    paddingBottom: 5,
  },
  deleteText: {
    color: 'white',
    fontSize: 26,
  },
  backButton: {
    backgroundColor: 'red',
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
