import { Bid } from "./Bid";

export type Product = {
  highestbid: number;
  id: string;
  name: string;
  description: string;
  price: number;
  bidtime: string;
  highestBid: number;
  highestBidder: string;
  bids: Bid[];
};
