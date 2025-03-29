// import React, { useState, useRef } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import * as FileSystem from 'expo-file-system';

// export default function ImageCapture({ onCapture }) {
//   const [permission, requestPermission] = useCameraPermissions();
//   const [facing, setFacing] = useState("back");
//   const cameraRef = useRef(null);

//   if (!permission) return <View />;
//   if (!permission.granted) {
//     return (
//       <View style={styles.permissionContainer}>
//         <Text style={styles.permissionText}>No access to camera</Text>
//         <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
//           <Text style={styles.buttonText}>Grant Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       const photo = await cameraRef.current.takePictureAsync();
//       const fileName = `photo_${Date.now()}.jpg`;
//       const filePath = `${FileSystem.documentDirectory}${fileName}`;

//       await FileSystem.moveAsync({
//         from: photo.uri,
//         to: filePath,
//       });

//       onCapture(filePath);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
//         <View style={styles.controls}>
//           <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
//             <Text style={styles.buttonText}>Capture</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => setFacing(facing === "back" ? "front" : "back")}
//             style={styles.switchButton}
//           >
//             <Text style={styles.buttonText}>Flip</Text>
//           </TouchableOpacity>
//         </View>
//       </CameraView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   permissionContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   permissionText: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   permissionButton: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//   },
//   camera: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
//   controls: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     padding: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   captureButton: {
//     backgroundColor: '#007bff',
//     padding: 15,
//     borderRadius: 5,
//   },
//   switchButton: {
//     backgroundColor: '#28a745',
//     padding: 15,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     textAlign: 'center',
//   },
// });

import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

export default function ImageCapture({ onCapture }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const cameraRef = useRef(null);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1, // High-quality image
        base64: false,
        exif: false,
      });

      const fileName = `photo_${Date.now()}.jpg`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.moveAsync({
        from: photo.uri,
        to: filePath,
      });

      onCapture(filePath);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={[styles.camera, { width: screenWidth, height: screenHeight }]}
        facing={facing}
        ratio="16:9" // Ensures full image capture
      >
        <View style={styles.controls}>
          <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
            <Text style={styles.buttonText}>Capture</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFacing(facing === "back" ? "front" : "back")}
            style={styles.switchButton}
          >
            <Text style={styles.buttonText}>Flip</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  permissionButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  captureButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 50,
  },
  switchButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

