import { ApiService } from "./api.service";

export interface IStats {
  membersCount: number;
  projectIdeaCount: number;
  pollsCount: number;
  activePollSCount: number;
}

export const appApi = ApiService.injectEndpoints({
  endpoints: (builder) => ({}),
  overrideExisting: process.env.NODE_ENV == "development",
});

export const { endpoints: appApiEndpoints } = appApi;
