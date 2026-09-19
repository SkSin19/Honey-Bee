import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image } from "expo-image";

const Index = () => {

  const [image, setImage] = useState<string | null>(null) 

  const uploadImage = async (img?: any) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Aint got no permissions", "Get em first");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.uploadCardContainer}>
        <TouchableOpacity
          style={styles.uploadCard}
          activeOpacity={0.9}
          onPress={() => uploadImage()}
        >
          {!image ? <AntDesign
            name="file-image"
            size={30}
            style={styles.icon}
            color="#ffffff"
          >
            +
          </AntDesign> : 
          <Image source={image} style={styles.pickedImage}/>}
          <Text style={styles.label}>Upload your image</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadCardContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadCard: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#393939",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  icon: {
    padding: 30,
  },
  pickedImage:{
    borderRadius: 20,
    padding: 30
  },
  crossButton:{

  },
  label: {
    color: "white",
    fontSize: 20,
    fontWeight: 600,
  },
});

export default Index;
