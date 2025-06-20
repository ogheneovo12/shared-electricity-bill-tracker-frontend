import { io } from "socket.io-client";
import { socketAuth } from "../lib/socket-auth";
import { useSelector } from "react-redux";
import { RootState } from "../lib/redux/store";
import { APP_CONFIG } from "@/config/_app.config";

export const useSocket = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);

  function getSocket() {
    const socket = io(APP_CONFIG.BASE_API_DOMAIN, {
      autoConnect: false,
      auth: socketAuth(token),
    });
    return socket;
  }
  return { getSocket };
};
