import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Share,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  getFirestore,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";

const ProductDetail = () => {
  const { params } = useRoute();
  const [product, setProduct] = useState([]);

  const { user } = useUser();
  const db = getFirestore(app);
  const navigation = useNavigation();

  useEffect(() => {
    if (params.product) {
      setProduct(params.product);
    }
    shareButton();
  }, [params]);

  const shareButton = () => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => shareProduct()}>
          <Ionicons
            name="share-social-sharp"
            size={24}
            color="white"
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
    });
  };

  const shareProduct = () => {
    const content = {
      message: `${product?.title}\n${product?.desc}`,
    };
    Share.share(content)
      .then((res) => {
        console.log("Product shared successfully.");
      })
      .catch((error) => {
        console.error("Error sharing product:", error);
      });
  };

  const sendEmailMessage = () => {
    const subject = `Regarding ${product.title}`;
    const body = `Hi ${product.userName},\nI am interested in this product.`;
    const mailUrl = `mailto:${product.userEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailUrl).catch((error) => {
      console.error("Error sending email:", error);
    });
  };

  const deleteUserPost = () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      {
        text: "Yes",
        onPress: () => deleteFromFireStore(),
      },
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
    ]);
  };

  const deleteFromFireStore = async () => {
    try {
      const q = query(
        collection(db, "UserPost"),
        where("title", "==", product.title)
      );
      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        deleteDoc(doc.ref)
          .then(() => {
            console.log("Post deleted successfully.");
            navigation.goBack();
          })
          .catch((error) => {
            console.error("Error deleting document:", error);
          });
      });
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <Image
        source={{ uri: product.image }}
        style={{ height: 320, width: "100%" }}
      />
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          {product?.title}
        </Text>
        <View style={{ alignItems: "baseline" }}>
          <Text
            style={{
              borderRadius: 20,
              backgroundColor: "#e0f7fa",
              padding: 5,
              marginTop: 10,
              color: "#00bcd4",
            }}
          >
            {product.categoryName}
          </Text>
        </View>
        <Text style={{ marginTop: 10, fontWeight: "bold", fontSize: 20 }}>
          Description
        </Text>
        <Text style={{ fontSize: 17, color: "#9e9e9e" }}>{product?.desc}</Text>
      </View>

      <View
        style={{
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: "#e0f7fa",
        }}
      >
        <Image
          source={{ uri: product.userImage }}
          style={{ width: 48, height: 48, borderRadius: 24 }}
        />
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            {product.userName}
          </Text>
          <Text style={{ color: "#9e9e9e" }}>{product.userEmail}</Text>
        </View>
      </View>

      {user?.primaryEmailAddress.emailAddress === product.userEmail ? (
        <TouchableOpacity
          onPress={deleteUserPost}
          style={{
            zIndex: 40,
            backgroundColor: "red",
            borderRadius: 30,
            padding: 10,
            margin: 10,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>
            Delete Post
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={sendEmailMessage}
          style={{
            zIndex: 40,
            backgroundColor: "#2196f3",
            borderRadius: 30,
            padding: 10,
            margin: 10,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>
            Send Message
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default ProductDetail;
