export type WaafiRequest = {
  schemaVersion: string;
  requestId: string;
  timestamp: string;
  channelName: string;
  serviceName: string;
  serviceParams: ServiceParams;
};

type ServiceParams = {
  merchantUid: string;
  apiUserId: string;
  apiKey: string;
  paymentMethod: string;
  payerInfo: PayerInfo;
  transactionInfo: TransactionInfo;
};

type PayerInfo = {
  accountNo: number;
  accountPwd?: string;
  accountExpDate?: string;
  accountHolder?: string;
};

type TransactionInfo = {
  referenceId: string;
  invoiceId: string;
  amount: string;
  currency: string;
  description?: string;
};

export type PaystackRequest = {
  email: string;
  name: string;
  amount: string;
  reference: string;
  currency: string;
  callback_url: string;
  channels: string[];
};
