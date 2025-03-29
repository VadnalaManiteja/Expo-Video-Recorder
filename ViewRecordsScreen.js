import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Video } from 'expo-av';

const ViewRecordsScreen = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const media = await MediaLibrary.getAssetsAsync({ mediaType: 'video' });
    setVideos(media.assets);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recorded Videos</Text>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Video
            source={{ uri: item.uri }}
            useNativeControls
            style={styles.video}
            resizeMode="contain"
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  video: { width: '100%', height: 200, marginBottom: 10 },
});

export default ViewRecordsScreen;
