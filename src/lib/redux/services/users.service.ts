import { IUser } from "../slices/auth.slice";
import { ApiService } from "./api.service";

export const userApi = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<IUser[], void>({
      query: () => ({
        url: `/users`,
      }),
      transformResponse: (response: { data: IUser[] }) => response.data,
      providesTags: (results) =>
        results
          ? [
              ...results.map((res) => ({
                type: "Users" as const,
                id: res._id,
              })),
              "Users",
            ]
          : ["Users"],
    }),

    editUser: builder.mutation<void, { id: string; payload: Partial<IUser> }>({
      query: ({ id, payload }) => ({
        url: `/users/edit-user/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Users", id: arg.id }],
    }),
    editUserProfile: builder.mutation<void, Partial<IUser>>({
      query: (payload) => ({
        url: `/users`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Users", "Profile"],
    }),
    toggleAdminRole: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}/toggle-admin-role`,
        method: "POST",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Users", id: arg }],
    }),
    createUser: builder.mutation<void, Partial<IUser>>({
      query: (payload) => ({
        url: `/users/create`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
  overrideExisting: process.env.NODE_ENV == "development",
});

export const {
  endpoints: userApiEndpoints,
  useEditUserMutation,
  useCreateUserMutation,
  useGetUsersQuery,
  useToggleAdminRoleMutation,
  useEditUserProfileMutation,
} = userApi;
