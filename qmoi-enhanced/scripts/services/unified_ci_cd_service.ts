import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from '../utils/logger';
import { NotificationService } from './notification_service';

const execAsync = promisify(exec);
const notificationService = new NotificationService();

const DEPLOY_PLATFORMS = ['vercel', 'heroku', 'aws', 'azure', 'gcp'];

class UnifiedCICDService {
  async commitAndPushFixes(commitMessage = 'Auto-fix: Resolved issues automatically') {
    try {
      logger.info('[CI/CD] Staging all changes...');
      await execAsync('git add .');
      logger.info('[CI/CD] Creating commit...');
      await execAsync(`git commit -m "${commitMessage}"`);
      logger.info('[CI/CD] Rebasing onto latest main...');
      await execAsync('git pull --rebase origin main');
      logger.info('[CI/CD] Pushing to main...');
      await execAsync('git push origin main');
      logger.info('[CI/CD] Commit and push successful.');
      return { success: true, message: 'Commit and push successful.' };
    } catch (error: any) {
      logger.error('[CI/CD] Commit/push failed:', error);
      await notificationService.sendCriticalEventNotification('commit_failed', error.message);
      return { success: false, message: error.message };
    }
  }

  async createPullRequest(branch = 'main', title = 'Auto-fix PR', body = 'Automated fixes and improvements') {
    try {
      logger.info('[CI/CD] Creating pull request...');
      await execAsync(`gh pr create --base ${branch} --title "${title}" --body "${body}" --fill`);
      logger.info('[CI/CD] Pull request created.');
      return { success: true, message: 'Pull request created.' };
    } catch (error: any) {
      logger.error('[CI/CD] PR creation failed:', error);
      await notificationService.sendCriticalEventNotification('pr_failed', error.message);
      return { success: false, message: error.message };
    }
  }

  async deployToVercel() {
    try {
      logger.info('[CI/CD] Starting Vercel deployment...');
      await execAsync('npx vercel --prod --yes');
      logger.info('[CI/CD] Vercel deployment successful!');
      await notificationService.sendCriticalEventNotification('deploy_success', 'Vercel deployment successful.');
      return { success: true, message: 'Vercel deployment successful.' };
    } catch (error: any) {
      logger.error('[CI/CD] Vercel deployment failed:', error);
      await notificationService.sendCriticalEventNotification('deploy_failed', error.message);
      return { success: false, message: error.message };
    }
  }

  async deployToHeroku() {
    try {
      logger.info('[CI/CD] Starting Heroku deployment...');
      await execAsync('git push https://heroku:$HEROKU_API_KEY@git.heroku.com/$HEROKU_APP_NAME.git main --force');
      logger.info('[CI/CD] Heroku deployment successful!');
      await notificationService.sendCriticalEventNotification('deploy_success', 'Heroku deployment successful.');
      return { success: true, message: 'Heroku deployment successful.' };
    } catch (error: any) {
      logger.error('[CI/CD] Heroku deployment failed:', error);
      await notificationService.sendCriticalEventNotification('deploy_failed', error.message);
      return { success: false, message: error.message };
    }
  }

  async deployToAWS() {
    try {
      logger.info('[CI/CD] Starting AWS deployment...');
      await execAsync('aws deploy start-deployment --application-name $AWS_APP_NAME --deployment-group-name $AWS_DEPLOYMENT_GROUP --s3-location bucket=$AWS_S3_BUCKET,bundleType=zip,key=$AWS_S3_KEY');
      logger.info('[CI/CD] AWS deployment successful!');
      await notificationService.sendCriticalEventNotification('deploy_success', 'AWS deployment successful.');
      return { success: true, message: 'AWS deployment successful.' };
    } catch (error: any) {
      logger.error('[CI/CD] AWS deployment failed:', error);
      await notificationService.sendCriticalEventNotification('deploy_failed', error.message);
      return { success: false, message: error.message };
    }
  }

  async deployToAzure() {
    try {
      logger.info('[CI/CD] Starting Azure deployment...');
      await execAsync('az webapp up --name $AZURE_APP_NAME --resource-group $AZURE_RESOURCE_GROUP --location $AZURE_LOCATION --runtime "NODE|18-lts"');
      logger.info('[CI/CD] Azure deployment successful!');
      await notificationService.sendCriticalEventNotification('deploy_success', 'Azure deployment successful.');
      return { success: true, message: 'Azure deployment successful.' };
    } catch (error: any) {
      logger.error('[CI/CD] Azure deployment failed:', error);
      await notificationService.sendCriticalEventNotification('deploy_failed', error.message);
      return { success: false, message: error.message };
    }
  }

  async deployToGCP() {
    try {
      logger.info('[CI/CD] Starting GCP deployment...');
      await execAsync('gcloud app deploy --quiet');
      logger.info('[CI/CD] GCP deployment successful!');
      await notificationService.sendCriticalEventNotification('deploy_success', 'GCP deployment successful.');
      return { success: true, message: 'GCP deployment successful.' };
    } catch (error: any) {
      logger.error('[CI/CD] GCP deployment failed:', error);
      await notificationService.sendCriticalEventNotification('deploy_failed', error.message);
      return { success: false, message: error.message };
    }
  }

  async deployWithFallback(platform = 'vercel') {
    const platforms = [...DEPLOY_PLATFORMS];
    const startIdx = platforms.indexOf(platform);
    for (let i = startIdx; i < platforms.length; i++) {
      let result;
      if (platforms[i] === 'vercel') result = await this.deployToVercel();
      else if (platforms[i] === 'heroku') result = await this.deployToHeroku();
      else if (platforms[i] === 'aws') result = await this.deployToAWS();
      else if (platforms[i] === 'azure') result = await this.deployToAzure();
      else if (platforms[i] === 'gcp') result = await this.deployToGCP();
      if (result.success) return { ...result, platform: platforms[i] };
      logger.warn(`[CI/CD] Deployment failed on ${platforms[i]}, trying next platform...`);
    }
    return { success: false, message: 'All deployments failed.' };
  }

  async monitorDeployment(url: string) {
    try {
      logger.info(`[CI/CD] Monitoring deployment at ${url}...`);
      const res = await fetch(url);
      if (res.ok) {
        logger.info('[CI/CD] Deployment healthy.');
        return { success: true, message: 'Deployment healthy.' };
      } else {
        logger.warn('[CI/CD] Deployment unhealthy:', res.statusText);
        return { success: false, message: 'Deployment unhealthy.' };
      }
    } catch (error: any) {
      logger.error('[CI/CD] Deployment monitoring failed:', error);
      return { success: false, message: error.message };
    }
  }
}

export const unifiedCICDService = new UnifiedCICDService(); 