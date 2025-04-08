declare module 'yookassa' {
  export default class YooKassa {
    constructor(options: { shopId: string; secretKey: string });
    
    createPayment(options: CreatePaymentOptions): Promise<PaymentResponse>;
    getPayment(paymentId: string): Promise<PaymentResponse>;
  }

  interface CreatePaymentOptions {
    amount: {
      value: string;
      currency: string;
    };
    capture: boolean;
    confirmation: {
      type: string;
      return_url: string;
    };
    description?: string;
    metadata?: Record<string, any>;
    receipt?: {
      customer: {
        email: string;
      };
      items: Array<{
        description: string;
        quantity: string;
        amount: {
          value: string;
          currency: string;
        };
        vat_code: string;
        payment_subject: string;
        payment_mode: string;
      }>;
    };
  }

  interface PaymentResponse {
    id: string;
    status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled';
    paid: boolean;
    amount: {
      value: string;
      currency: string;
    };
    confirmation: {
      type: string;
      confirmation_url: string;
    };
    created_at: string;
    metadata?: Record<string, any>;
    recipient: {
      account_id: string;
      gateway_id: string;
    };
    refundable: boolean;
    test: boolean;
  }
} 