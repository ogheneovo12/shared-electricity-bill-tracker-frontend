import { logout } from "@/lib/redux/slices/auth.slice";
import { RootState } from "@/lib/redux/store";
import { Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "./ui/skeleton";
import { useGetUserProfileQuery } from "@/lib/redux/services/auth.api.service";

function ProtectedPage({ children }: { children: React.ReactNode }) {
  useGetUserProfileQuery();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const dispacth = useDispatch();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!token) {
      dispacth(logout());
    }
    setIsMounted(true);
  }, [token]);

  if (!isMounted)
    return <Skeleton className="w-[100px] h-[20px] rounded-full" />;

  if (!token) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default ProtectedPage;
