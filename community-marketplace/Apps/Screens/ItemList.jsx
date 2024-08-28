import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  collection,
  getFirestore,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import LatestItemList from "../Components/HomeScreen/LatestItemList";

const ItemList = () => {
  const { params } = useRoute();
  const db = getFirestore(app);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params && params.category) {
      console.log("categoryName:", params.category);
      getItemListByCategory();
    }
  }, [params]);

  const getItemListByCategory = async () => {
    setItems([]);
    setLoading(true);
    try {
      const q = query(
        collection(db, "UserPost"),
        where("categoryName", "==", params.category)
      );
      const snapshot = await getDocs(q);

      setLoading(false);
      console.log("Snapshot Size:", snapshot.size);
      if (snapshot.empty) {
        console.log("No matching documents.");
      }

      const itemList = [];

      snapshot.forEach((doc) => {
        console.log("Document Data:", doc.data());
        itemList.push({ id: doc.id, ...doc.data() });
        setLoading(false);
      });

      setItems(itemList);
    } catch (error) {
      console.error("Error fetching items: ", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 2 }}>
      {loading ? (
        <ActivityIndicator className="mt-24" size={"large"} color={"#3b82f6"} />
      ) : items.length > 0 ? (
        <LatestItemList latestItemList={items} heading={""} />
      ) : (
        <Text className="p-5 text-[20px] mt-24 justify-center text-center text-gray-400">
          No post Found
        </Text>
      )}
    </View>
  );
};

export default ItemList;
