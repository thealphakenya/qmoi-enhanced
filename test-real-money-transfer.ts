import { aiService } from './lib/ai-service.js';

async function executeRealMoneyTransfer() {
  console.log('💰 Executing Real $1000 Money Transfer to CashOn...\n');

  try {
    // Execute the actual money transfer through AI service
    const result = await aiService.generateResponse(
      'master instruction send 1000 dollars to cashon',
      { task: 'real_money_transfer' }
    );

    console.log('📊 Transfer Execution Result:');
    console.log('='.repeat(60));
    console.log(result);
    console.log('='.repeat(60));

    // Wait a moment for processing
    console.log('\n⏳ Waiting 5 seconds for payment processing...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Now verify the balance
    console.log('\n🔍 Verifying Pesapal Balance After Transfer...\n');

    const verificationResult = await aiService.generateResponse(
      'master instruction verify pesapal balance',
      { task: 'post_transfer_verification' }
    );

    console.log('📊 Post-Transfer Verification Result:');
    console.log('='.repeat(60));
    console.log(verificationResult);
    console.log('='.repeat(60));

    return { transfer: result, verification: verificationResult };
  } catch (error) {
    console.error('❌ Transfer execution failed:', error);
    return null;
  }
}

// Run the real money transfer test
executeRealMoneyTransfer().then((result) => {
  if (result) {
    console.log('\n✅ Real money transfer test completed');
    console.log('🔍 Check the results above to confirm actual fund transfer');
  } else {
    console.log('\n❌ Real money transfer test failed');
  }
  process.exit(0);
}).catch((error) => {
  console.error('💥 Test execution failed:', error);
  process.exit(1);
});
