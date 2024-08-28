import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { Formik } from "formik";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";

const AddPostScreen = () => {
  const db = getFirestore();
  const [categoryList, setCategoryList] = useState([]);
  const [image, setImage] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  console.log("selectedCategoryName", selectedCategoryName);

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    setCategoryList([]);
    try {
      const querySnapshot = await getDocs(collection(db, "Category"));
      if (querySnapshot.empty) {
        console.log("No documents found in the Category collection.");
      } else {
        const categories = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setCategoryList(categories);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubmitMethod = async (value, { resetForm }) => {
    setLoading(true);
    const resp = await fetch(image);
    const blob = await resp.blob();

    const storageRef = ref(storage, "communityPost/" + Date.now() + ".jpg");
    uploadBytes(storageRef, blob)
      .then(() => {
        console.log("Uploaded a blob or file!");
        return getDownloadURL(storageRef);
      })
      .then(async (downloadUrl) => {
        console.log("Download URL:", downloadUrl);
        value.image = downloadUrl;
        value.userName = user.fullName;
        value.userEmail = user.primaryEmailAddress.emailAddress;
        value.userImage = user.imageUrl;
        value.categoryName = selectedCategoryName;

        const docRef = await addDoc(collection(db, "UserPost"), value);

        if (docRef.id) {
          setLoading(false);
          Alert.alert("Success!!!", "Post Added Successfully.", [
            {
              text: "OK",
              onPress: () => {
                resetForm();
                setImage(null);
                navigation.goBack();
              },
            },
          ]);
        }
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        ToastAndroid.show("Upload failed: " + error.message, ToastAndroid.LONG);
      });
  };

  return (
    <KeyboardAvoidingView className="flex-1">
      <ScrollView className="flex-1 p-5 mt-5">
        <Text className="text-2xl font-bold">Add New Post</Text>
        <Text className="text-base text-gray-500 mb-7">
          Create New Post and Start Selling
        </Text>
        <Formik
          initialValues={{
            title: "",
            desc: "",
            category: "",
            address: "",
            price: "",
            image: "",
            userName: "",
            userEmail: "",
            userImage: "",
            createdAt: Date.now(),
          }}
          onSubmit={(values, formikActions) =>
            onSubmitMethod(values, formikActions)
          }
          validate={(values) => {
            const errors = {};

            if (!values.title) {
              errors.title = "Title is required";
              ToastAndroid.show("Title is required", ToastAndroid.SHORT);
            }

            if (!values.price) {
              errors.price = "Price is required";
              ToastAndroid.show("Price is required", ToastAndroid.SHORT);
            } else if (isNaN(values.price)) {
              errors.price = "Price must be a number";
              ToastAndroid.show("Price must be a number", ToastAndroid.SHORT);
            }

            if (!values.category) {
              errors.category = "Category is required";
              ToastAndroid.show("Category is required", ToastAndroid.SHORT);
            }

            if (!image) {
              errors.image = "Image is required";
              ToastAndroid.show("Image is required", ToastAndroid.SHORT);
            }

            return errors;
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
          }) => (
            <View>
              <TouchableOpacity className="mb-5" onPress={pickImage}>
                {image ? (
                  <Image
                    source={{ uri: image }}
                    className="w-24 h-24 rounded-lg"
                    style={{ resizeMode: "cover" }}
                  />
                ) : (
                  <Image
                    source={require("./../../assets/images/placeholder.jpg")}
                    className="w-24 h-24 rounded-lg"
                    style={{ resizeMode: "cover" }}
                  />
                )}
              </TouchableOpacity>

              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-3 text-lg"
                placeholder="Title"
                value={values.title}
                onChangeText={handleChange("title")}
                onBlur={handleBlur("title")}
                style={{ textAlignVertical: "top" }}
              />
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-3 text-lg"
                placeholder="Description"
                value={values.desc}
                multiline={true}
                numberOfLines={5}
                onChangeText={handleChange("desc")}
                onBlur={handleBlur("desc")}
                style={{ textAlignVertical: "top" }}
              />
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-3 text-lg"
                placeholder="Price"
                value={values.price}
                keyboardType="number-pad"
                onChangeText={handleChange("price")}
                onBlur={handleBlur("price")}
                style={{ textAlignVertical: "top" }}
              />
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-3 text-lg"
                placeholder="Address"
                value={values.address}
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
                style={{ textAlignVertical: "top" }}
              />

              <View className="border border-gray-300 rounded-lg mt-3">
                <Picker
                  selectedValue={values.category}
                  onValueChange={(itemValue) => {
                    const selectedCategory = categoryList.find(
                      (category) => category.id === itemValue
                    );
                    setFieldValue("category", itemValue);
                    setSelectedCategoryName(selectedCategory?.name || "");
                  }}
                >
                  <Picker.Item label="Select Category" value="" />
                  {categoryList.map((category) => (
                    <Picker.Item
                      key={category.id}
                      label={category.name}
                      value={category.id}
                    />
                  ))}
                </Picker>
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                style={{ backgroundColor: loading ? "#ccc" : "#007BFF" }}
                disabled={loading}
                className="bg-blue-500 rounded-full p-4 mt-10"
              >
                {loading ? (
                  <ActivityIndicator color="ffffff" />
                ) : (
                  <Text className="text-white text-center text-lg">Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddPostScreen;
