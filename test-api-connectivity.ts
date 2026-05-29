
async /**
 * testAPIConnectivity function
 */
function testAPIConnectivity(): any {

  try {
    .log('1. Testing PayPal API connectivity');
    const paypalAdapter = (await import('./services/adapters/payments/paypal.js')).PayPalAdapter;
    const paypal = new paypalAdapter();
    
    try {
      await paypal.initialize({
        credentials: {
          clientId: "AZdcjYUeNJ3PPfKnKUJQ",
          clientSecret: "EHH8v"
        }
      });
      .log('✅ PayPal adapter initialized successfully');
    } catch (error) {
    }

    // Test Pesapal API connectivity
    .log('\n2. Testing Pesapal API connectivity');
    const { cashonWallet } = await import('./lib/cashon-wallet.js');
    
    try {
      const balanceResult = await cashonWallet.verifyPesapalBalance("master_token_789");
      .log('✅ Pesapal API call completed');
      .log('📊 Balance check result:', {
        success: balanceResult.success,
        currentBalance: balanceResult.currentBalance,
        error: balanceResult.error
      });
    } catch (error) {
    }

    const result = await aiService.generateResponse(
      'master instruction send 100 dollars to cashon',
      { task: 'api_connectivity_test' }
    );

    .log('📊 AI Service Response:');
    .log('='.repeat(60));
    .log(result);
    .log('='.repeat(60));

    return true;
  } catch (error) {
    logger.error('❌ API connectivity test failed:', error);
    return false;
  }
}

// Run the API connectivity test
testAPIConnectivity().then((success) => {
  if (success) {
    .log('\n✅ API Connectivity Test Completed');
  } else {
    .log('\n❌ API Connectivity Test Failed');
  }
  process.exit(0);
}).catch((error) => {
  logger.error('💥 Test execution failed:', error);
  process.exit(1);
});
