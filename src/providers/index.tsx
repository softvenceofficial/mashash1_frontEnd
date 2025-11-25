import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/redux/store";
import router from "@/routes";
import { ThemeProvider } from "@/theme";

export default function Providers() {
  // const currentUser = useCurrentUser();

  return (
    // <SocketProvider userId={currentUser?.id as string}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </PersistGate>
    </Provider>
    // </SocketProvider>
  );
}
