declare module "midtrans-client" {
  interface SnapOptions {
    isProduction: boolean;
    serverKey: string;
  }

  interface TransactionDetails {
    order_id: string;
    gross_amount: number;
  }

  interface CustomerDetails {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    billing_address?: {
      address?: string;
      city?: string;
      country_code?: string;
      postal_code?: string;
    };
  }

  interface ItemDetail {
    id?: string;
    price: number;
    quantity: number;
    name: string;
  }

  interface SnapTransactionParams {
    transaction_details: TransactionDetails;
    customer_details?: CustomerDetails;
    item_details?: ItemDetail[];
  }

  interface SnapTransactionResult {
    token: string;
    redirect_url: string;
  }

  class Snap {
    constructor(options: SnapOptions);
    createTransaction(
      params: SnapTransactionParams,
    ): Promise<SnapTransactionResult>;
  }

  interface CoreApiOptions {
    isProduction: boolean;
    serverKey: string;
  }

  class CoreApi {
    constructor(options: CoreApiOptions);
    transaction: {
      status(orderId: string): Promise<any>;
      notification(notification: any): Promise<any>;
    };
  }

  export { Snap, CoreApi, SnapOptions, SnapTransactionParams, SnapTransactionResult };
  export default { Snap, CoreApi };
}
