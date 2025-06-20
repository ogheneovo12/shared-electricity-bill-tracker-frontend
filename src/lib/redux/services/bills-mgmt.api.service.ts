import { IMeterReading, IPurchase } from "@/@types";
import { IUser } from "../slices/auth.slice";
import { ApiService } from "./api.service";

export interface ICreatePurchaseDto {
  date_purchased: Date;
  total_amount: number;
  total_units: number;
  receipt_url?: string;
  contributions: {
    room: string;
    amount: number;
  }[];
  note?: string;
}

export interface ICreateReadingDto {
  roomId: string;
  value: number;
  reading_date: Date;
  screenshot?: string;
  note?: string;
}

export interface IRoomReportQueryDto {
  roomId: string;
  startDate: string;
  endDate: string;
}

export interface IRoomReportResult {
  startDate: string;
  endDate: string;
  firstReading: number;
  lastReading: number;
  unitsConsumed: number;
  unitsPurchased: number;
  balance: number;
  is_owing: boolean;
  amountOwed: number;
  unitsPurchasedAmount: number;
  amountContributed: number;
}

export interface IRoomSummaryReport {
  room: string;
  currentOccupant: IUser;
  unitsPurchased: number;
  unitsConsumed: number;
  balance: number;
  lastReading: number | null;
  lastReadingDate: Date | null;
  is_owing: boolean;
  amountOwed: number;
  unitsPurchasedAmount: number;
  amountContributed: number;
}

export interface ILastReading {
  room: string;
  currentOccupant: IUser;
  lastReading?: number;
  lastReadingDate?: string;
}

export const roomsApi = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    createMeterReading: builder.mutation<IMeterReading, ICreateReadingDto>({
      query: (body) => ({
        url: "bills-management/readings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MeterReadings", "LastReadings"],
    }),
    editMeterReading: builder.mutation<
      IMeterReading,
      { id: string; body: Partial<ICreateReadingDto> }
    >({
      query: ({ id, body }) => ({
        url: `bills-management/readings/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["MeterReadings", "LastReadings"],
    }),
    createPurchase: builder.mutation<IPurchase, ICreatePurchaseDto>({
      query: (body) => ({
        url: "bills-management/purchases",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Purchases", "LastReadings", "Reports"],
    }),
    editPurchase: builder.mutation<
      IPurchase,
      { id: string; body: Partial<ICreatePurchaseDto> }
    >({
      query: ({ id, body }) => ({
        url: `bills-management/purchases/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Purchases"],
    }),
    getRoomReport: builder.query<IRoomReportResult, IRoomReportQueryDto>({
      query: (query) => ({
        url: `bills-management/room-report`,
        params: query,
      }),
      transformResponse: (response: { data: IRoomReportResult }) =>
        response.data,
      providesTags: ["Reports"],
    }),
    getBillingSummary: builder.query<IRoomSummaryReport[], void>({
      query: () => ({
        url: `bills-management/summary`,
      }),
      transformResponse: (response: { data: IRoomSummaryReport[] }) =>
        response.data,
      providesTags: ["Reports"],
    }),
    getMeterReadings: builder.query<IMeterReading[], void>({
      query: () => ({
        url: `bills-management/readings`,
      }),
      transformResponse: (response: { data: IMeterReading[] }) => response.data,
      providesTags: ["MeterReadings"],
    }),
    getMeterLastReadings: builder.query<ILastReading[], void>({
      query: () => ({
        url: `bills-management/last-readings`,
      }),
      transformResponse: (response: { data: ILastReading[] }) => response.data,
      providesTags: ["LastReadings"],
    }),
    getPurchases: builder.query<IPurchase[], void>({
      query: () => ({
        url: `bills-management/purchases`,
      }),
      transformResponse: (response: { data: IPurchase[] }) => response.data,
      providesTags: ["Purchases"],
    }),
  }),
  overrideExisting: process.env.NODE_ENV == "development",
});

export const {
  endpoints: appApiEndpoints,
  useCreateMeterReadingMutation,
  useCreatePurchaseMutation,
  useGetRoomReportQuery,
  useGetBillingSummaryQuery,
  useEditPurchaseMutation,
  useEditMeterReadingMutation,
  useGetMeterReadingsQuery,
  useGetPurchasesQuery,
  useGetMeterLastReadingsQuery,
} = roomsApi;
