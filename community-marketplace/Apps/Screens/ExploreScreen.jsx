import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {
  getFirestore,
  query,
  collection,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import LatestItemList from "../Components/HomeScreen/LatestItemList";
import { useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";

const ExploreScreen = () => {
  const db = getFirestore(app);

  const [productList, setProductList] = useState([]);
  const { user } = useUser();

  console.log("productList", productList);

  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      getAllProducts();
      const unsubscribe = navigation.addListener("focus", () => {
        getAllProducts();
      });
      return unsubscribe;
    }
  }, [user, navigation]);

  const getAllProducts = async () => {
    try {
      const q = query(collection(db, "UserPost"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const products = [];
      snapshot.forEach((doc) => {
        console.log("Fetched document:", doc.id, doc.data());
        products.push(doc.data());
      });
      console.log("Total products fetched:", products.length);
      setProductList(products);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  return (
    <ScrollView style={{ padding: 20, paddingVertical: 32 }}>
      <Text style={{ fontSize: 30, fontWeight: "bold" }}>Explore More</Text>
      <LatestItemList latestItemList={productList} />
    </ScrollView>
  );
};

export default ExploreScreen;
