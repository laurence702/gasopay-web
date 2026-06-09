declare module '@paystack/inline-js' {
  interface PaystackSuccessResponse {
    message: string;
    reference: string;
    status: 'success' | 'failed';
    trans: string;
    transaction: string;
    trxref: string;
    redirecturl: string;
  }

  type PaystackChannels = 
    | 'card' 
    | 'bank' 
    | 'ussd' 
    | 'qr' 
    | 'mobile_money' 
    | 'bank_transfer'
    | 'bank_transfer_ussd';

  interface PaystackSplit {
    [key: string]: string | number | Record<string, unknown>;
  }

  interface PaystackMetadata {
    [key: string]: string | number | boolean | Record<string, unknown>;
  }

  interface PaystackTransactionOptions {
    key: string;
    email: string;
    amount: number;
    reference: string;
    channels?: PaystackChannels[];
    currency?: string;
    plan?: string;
    quantity?: number;
    subaccount?: string;
    split_code?: string;
    split?: PaystackSplit;
    bearer?: 'account' | 'subaccount';
    metadata?: PaystackMetadata;
    transaction_charge?: number;
    onSuccess: (response: PaystackSuccessResponse) => void;
    onCancel: () => void;
  }

  class PaystackPop {
    newTransaction(options: PaystackTransactionOptions): void;
  }

  export default PaystackPop;
}
