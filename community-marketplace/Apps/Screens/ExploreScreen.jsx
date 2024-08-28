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

const ExploreScreen = () => {
  const db = getFirestore(app);

  const [productList, setProductList] = useState([]);

  useEffect(() => {
    getAllProducts();
  }, []);

  const getAllProducts = async () => {
    setProductList([]);
    try {
      const q = query(collection(db, "UserPost"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      snapshot.forEach((doc) => {
        console.log(doc.data());
        setProductList((productList) => [productList, doc.data()]);
      });
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  return (
    <ScrollView style={{ padding: 20, paddingVertical: 32, flex: 1 }}>
      <Text style={{ fontSize: 30, fontWeight: "bold" }}>Explore More</Text>
      <LatestItemList latestItemList={productList} />
    </ScrollView>
  );
};

export default ExploreScreen;
