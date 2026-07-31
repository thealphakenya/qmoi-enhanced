Receiving GitHub Actions notifications through Discord is free and one of the easiest options.
Step 1: Create a Discord server (or use one you own)
If you don't already have one, create a Discord server.
Step 2: Create a webhook
Open your Discord server.
Click the server name → Server Settings.
Go to Integrations.
Select Webhooks.
Click New Webhook.
Give it a name (e.g., GitHub Actions).
Choose the channel where you want notifications (e.g., #github-notifications).
Click Copy Webhook URL.
Save the webhook.
Step 3: Add the webhook to GitHub
In your GitHub repository:
Go to Settings → Secrets and variables → Actions.
Click New repository secret.
Name it:
DISCORD_WEBHOOK
Paste the webhook URL.
Save the secret.
Step 4: Use it in your workflow
In your GitHub Actions workflow, add a step like this:
- name: Send Discord Notification
  if: always()
    env:
        WEBHOOK: ${{ secrets.DISCORD_WEBHOOK }}
          run: |
              STATUS="${{ job.status }}"
                  curl -H "Content-Type: application/json" \
                      -d "{\"content\":\"🚀 Workflow: ${{ github.workflow }}\nStatus: ${STATUS}\nRepository: ${{ github.repository }}\nBranch: ${{ github.ref_name }}\nRun: https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}\"}" \
                          "$WEBHOOK"
                          The if: always() condition ensures the notification is sent whether the workflow succeeds, fails, or is cancelled.
                          What you'll receive
                          Every workflow run will post a message in your Discord channel with information such as:
                          Workflow name
                          Status (success, failure, or cancelled)
                          Repository
                          Branch
                          A direct link to the workflow run
                          You can then enable Discord notifications on your phone, and you'll receive push notifications whenever a new message appears in that channel.
                          If you want a more polished experience, I can also provide �⁠a workflow that sends **rich Discord embed messages** with colors (🟢 green for success, 🔴 red for failure, 🟡 yellow for running), execution time, commit message, author, and clickable buttons linking directly to the workflow run.