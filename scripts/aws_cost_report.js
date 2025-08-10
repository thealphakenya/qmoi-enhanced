/* eslint-env node */
import AWS from 'aws-sdk';
const ce = new AWS.CostExplorer({ region: 'us-east-1' });

const start = new Date();
start.setDate(1);
const end = new Date();
end.setMonth(end.getMonth() + 1);
end.setDate(1);

ce.getCostAndUsage({
  TimePeriod: {
    Start: start.toISOString().slice(0, 10),
    End: end.toISOString().slice(0, 10),
  },
  Granularity: 'MONTHLY',
  Metrics: ['UnblendedCost'],
}, (err, data) => {
  if (err) {
    console.error('[AWS Cost Report] Error:', err);
    process.exit(1);
  } else {
    const amount = parseFloat(data.ResultsByTime[0].Total.UnblendedCost.Amount);
    console.log('[AWS Cost Report] This month:', amount, data.ResultsByTime[0].Total.UnblendedCost.Unit);
    if (amount > 1000) {
      console.log('[AWS Cost Report] ALERT: Cost exceeds $1000!');
      // Optionally notify via Slack, email, etc.
      process.exit(2);
    }
    process.exit(0);
  }
}); 