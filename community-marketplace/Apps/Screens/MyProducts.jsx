import { View } from "react-native";
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
      const unsubscribe = navigation.addListener("focus", () => {
        getUserPost();
      });
      return unsubscribe;
    }
  }, [user, navigation]);

  const getUserPost = async () => {
    setProductList([]);
    try {
      const q = query(
        collection(db, "UserPost"),
        where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
      );
      const snapshot = await getDocs(q);

      const products = snapshot.docs.map((doc) => doc.data());
      setProductList(products);
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
