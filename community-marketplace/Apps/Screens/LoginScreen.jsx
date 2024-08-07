import { View, Text, Image, Touchable, TouchableOpacity } from "react-native";
import React from "react";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBorwser } from "../../hooks/warmUpBrowser";
import { useOAuth } from "@clerk/clerk-expo";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  useWarmUpBorwser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);
  return (
    <View>
      <Image
        source={require("../../assets/images/login.jpg")}
        className="w-full h-[400px] object-cover"
      />

      <View className="p-8 bg-white mt-[-35px] rounded-t-3xl shadow-md">
        <Text className="text-[27px] font-bold">community Marketplace</Text>
        <Text className="test-[18] text-slate-500 mt-6">
          Buy Sell Marketplace where you can sell old item and make real money
        </Text>

        <TouchableOpacity
          onPress={onPress}
          className="p-3 bg-blue-500 rounded-full mt-20"
        >
          <Text className="text-white text-center text-[18px]">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
