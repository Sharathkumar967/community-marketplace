import React from "react";

import * as WebBrowser from "expo-web-browser";

export const useWarmUpBorwser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  });
};
