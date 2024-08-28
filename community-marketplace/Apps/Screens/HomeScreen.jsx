import { View, ScrollView, StyleSheet, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../Components/HomeScreen/Header";
import Slider from "../Components/HomeScreen/Slider";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import Categories from "../Components/HomeScreen/Categories";
import { app } from "../../firebaseConfig";
import LatestItemList from "../Components/HomeScreen/LatestItemList";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [latestItemList, setLatestItemList] = useState([]);

  const db = getFirestore(app);

  useEffect(() => {
    getSliders();
    getCategoryList();
    getLatestItemList();
  }, []);

  const getSliders = async () => {
    setSliderList([]);
    try {
      const querySnapshot = await getDocs(collection(db, "Sliders"));
      const sliders = querySnapshot.docs.map((doc) => doc.data());
      setSliderList(sliders);
    } catch (error) {
      console.error("Error fetching sliders:", error);
    }
  };

  const getCategoryList = async () => {
    setCategoryList([]);
    try {
      const querySnapshot = await getDocs(collection(db, "Category"));
      if (querySnapshot.empty) {
        console.log("No documents found in the Category collection.");
      } else {
        const categories = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategoryList(categories);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const getLatestItemList = () => {
    const latestItemsQuery = query(
      collection(db, "UserPost"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(latestItemsQuery, (querySnapshot) => {
      const latestItems = querySnapshot.docs.map((doc) => doc.data());
      setLatestItemList(latestItems);
    });

    // Return the unsubscribe function to allow cleanup
    return unsubscribe;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <Slider sliderList={sliderList} />
        <Categories categoryList={categoryList} />
        <LatestItemList
          latestItemList={latestItemList}
          heading={"Latest Items"}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
});

export default HomeScreen;
