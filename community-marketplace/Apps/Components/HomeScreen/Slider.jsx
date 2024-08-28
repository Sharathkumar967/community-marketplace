import { View, Text, FlatList, Image } from "react-native";
import React from "react";

const Slider = ({ sliderList }) => {
  console.log("sliderList", sliderList);
  return (
    <View className="mt-5">
      <FlatList
        data={sliderList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View>
            <Image
              source={{ uri: item?.image }}
              className="h-[170px] w-[330px] mr-3 rounded-lg object-contain"
            />
          </View>
        )}
      />
    </View>
  );
};

export default Slider;
