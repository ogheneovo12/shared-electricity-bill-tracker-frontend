import { IRoom } from "@/@types";
import { ApiService } from "./api.service";

export interface ICreateRoom {
  name: string;
  description: string;
}

export const roomsApi = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query<IRoom[], void>({
      query: () => ({
        url: `rooms`,
      }),
      transformResponse: (response: { data: IRoom[] }) => response.data,
      providesTags: (results) =>
        results
          ? [
              ...results.map((res) => ({
                type: "Rooms" as const,
                id: res._id,
              })),
              "Rooms",
            ]
          : ["Rooms"],
    }),
    getOneRoom: builder.query<IRoom, string>({
      query: (id) => ({
        url: `rooms/${id}`,
      }),
      transformResponse: (response: { data: IRoom }) => response.data,
      providesTags: (result, error, arg) => [{ type: "Rooms", id: arg }],
    }),
    editRoom: builder.mutation<
      IRoom,
      { id: string; payload: Partial<ICreateRoom> }
    >({
      query: ({ id, payload }) => ({
        url: `rooms/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Rooms", id: arg.id }],
    }),
  }),
  overrideExisting: process.env.NODE_ENV == "development",
});

export const {
  endpoints: appApiEndpoints,
  useGetOneRoomQuery,
  useGetRoomsQuery,
  useEditRoomMutation,
} = roomsApi;
