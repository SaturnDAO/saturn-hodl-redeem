export type { Hodl } from 'saturn-hodl-abi/ethers'
export interface PurchaseDb {
  chainId: number;
  name: string;
  address: string;
  event: string;
  block: number;
  hash: string;
  topic: string;
  params: string;
  id: string;
  index: number;
  timestamp: number;
}

export interface PurchaseParams {
  id: string;
  purchaser: string;
  amount: string;
  hodltype: string;
  redeemAt: string;
  etherPaid: string;
  purchasedAt: string;
}

export interface PurchaserInfo {
  purchaser: string;
  isVIP: boolean;
  lastOrderId: number;
  totalRefferred: string;
  params: PurchaseParams
}

export interface OrderInfo extends PurchaserInfo{
  orderId: number;
  isClaimed: boolean;
  amountOf: string;
  lockupOf: string;
}

export interface PurchaseValues extends Omit<PurchaseParams, 'contractAddress'> {
  contractAddress: string
}