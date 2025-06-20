import { IUser } from "../slices/auth.slice";
import { ApiService } from "./api.service";

interface IVerifyTokenResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export const authApi = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<IUser, void>({
      query: () => ({
        url: `auth/me`,
      }),
      transformResponse: (response: { data: IUser }) => response.data,
      providesTags: ["Profile"],
    }),
    initiateLogin: builder.mutation<void, { email: string }>({
      query: (credentials) => ({
        url: "/auth/initiate-login",
        method: "POST",
        body: credentials,
      }),
    }),

    verifyToken: builder.mutation<IVerifyTokenResponse, { token: string }>({
      query: (credentials) => ({
        url: "/auth/verify-login-token",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: { data: IVerifyTokenResponse }) =>
        response.data,
      invalidatesTags: ["Auth"],
    }),

    refreshToken: builder.mutation<
      {
        accessToken: string;
        refreshToken: string;
      },
      void
    >({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),
  }),
  overrideExisting: process.env.NODE_ENV == "development",
});

export const {
  endpoints: authApiEndpoints,
  useInitiateLoginMutation,
  useVerifyTokenMutation,
  useRefreshTokenMutation,
  useGetUserProfileQuery,
} = authApi;
