// api/auth.api.ts
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { APP_CONFIG } from "@/config/_app.config";

const baseQuery = fetchBaseQuery({
  baseUrl: APP_CONFIG.BASE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.accessToken;
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If 401, try to refresh token
  if (result.error?.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (refreshToken) {
      // Try to refresh tokens
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refresh_token: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Store new tokens
        const { accessToken, refreshToken: newRefreshToken } = (
          refreshResult.data as {
            data: {
              accessToken: string;
              refreshToken: string;
            };
          }
        ).data;

        api.dispatch({
          type: "auth/setCredentials",
          payload: {
            accessToken,
            refreshToken: newRefreshToken,
          },
        });

        // Retry original request with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed - logout
        api.dispatch({ type: "auth/logout" });
      }
    } else {
      // No refresh token - logout
      api.dispatch({ type: "auth/logout" });
    }
  }

  return result;
};

export const ApiService = createApi({
  reducerPath: "Api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Users",
    "Rooms",
    "Purchases",
    "MeterReadings",
    "Profile",
    "Reports",
    "LastReadings",
  ],
  endpoints: (builder) => ({}),
});
