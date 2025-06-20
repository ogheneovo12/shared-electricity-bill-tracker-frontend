import { IUser } from "@/lib/redux/slices/auth.slice";

export interface IRoom {
  _id: string;
  id: string;
  name: string;
  descrption: string;
  current_occupant?: IUser;
  occupant_history: IUser[];
}

export interface IContribution {
  room: IRoom;
  amount: number;
  units: number;
  note: string;
}

export interface IPurchase {
  _id: string;
  date_purchased: string;
  total_amount: number;
  total_units: number;
  rate: number;
  receipt_url: string;
  contributions: IContribution[];
  recorded_by: IUser;
  note: string;
}

export interface IMeterReading {
  _id: string;
  room: IRoom;
  value: number;
  reading_date: Date;
  screenshot: string;
  recorded_by: IUser;
  note: string;
}
