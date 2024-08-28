import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  getFirestore,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import LatestItemList from "../Components/HomeScreen/LatestItemList";
import { useNavigation } from "@react-navigation/native";

const MyProducts = () => {
  const db = getFirestore(app);
  const { user } = useUser();

  const [productList, setProductList] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      getUserPost();
    }
  }, [user]);

  useEffect(() => {
    navigation.addListener("focus", (e) => {
      getUserPost();
    });
  }, [navigation]);

  const getUserPost = async () => {
    setProductList([]);
    try {
      const q = query(
        collection(db, "UserPost"),
        where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
      );
      const snapshot = await getDocs(q);

      snapshot.forEach((doc) => {
        setProductList((productList) => [...productList, doc.data()]);
      });
    } catch (error) {
      console.error("Error fetching user posts: ", error);
    }
  };

  return (
    <View className="flex-1">
      <LatestItemList latestItemList={productList} userProduct={true} />
    </View>
  );
};

export default MyProducts;
