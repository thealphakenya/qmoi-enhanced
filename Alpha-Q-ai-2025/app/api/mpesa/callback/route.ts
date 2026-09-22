import { NextRequest, NextResponse } from 'next/server';
import { logEvent } from '../../../../lib/security_check';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Log the callback for debugging
    console.log('M-Pesa Callback received:', body);
    
    // Extract transaction details
    const {
      Body: {
        stkCallback: {
          CheckoutRequestID,
          ResultCode,
          ResultDesc,
          CallbackMetadata
        }
      }
    } = body;

    if (ResultCode === '0') {
      // Payment successful
      const metadata = CallbackMetadata?.Item || [];
      const amount = metadata.find(item => item.Name === 'Amount')?.Value || 0;
      const mpesaReceiptNumber = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value || '';
      const transactionDate = metadata.find(item => item.Name === 'TransactionDate')?.Value || '';
      const phoneNumber = metadata.find(item => item.Name === 'PhoneNumber')?.Value || '';

      logEvent('mpesa_payment_success', {
        checkoutRequestId: CheckoutRequestID,
        amount,
        receiptNumber: mpesaReceiptNumber,
        phoneNumber,
        transactionDate
      });

      // TODO: Update database with successful transaction
      // TODO: Trigger any post-payment actions

      return NextResponse.json({ 
        success: true, 
        message: 'Payment processed successfully' 
      });
    } else {
      // Payment failed
      logEvent('mpesa_payment_failed', {
        checkoutRequestId: CheckoutRequestID,
        resultCode: ResultCode,
        resultDesc: ResultDesc
      });

      return NextResponse.json({ 
        success: false, 
        message: ResultDesc 
      });
    }
  } catch (error) {
    console.error('M-Pesa callback processing failed:', error);
    logEvent('mpesa_callback_error', { error: error.message });
    
    return NextResponse.json({ 
      success: false, 
      message: 'Callback processing failed' 
    }, { status: 500 });
  }
} 