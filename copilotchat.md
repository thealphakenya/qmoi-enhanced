You are GitHub Copilot Chat. Your task is to build and maintain a fully autonomous Ollama-powered project automation system for this repository.

OBJECTIVE
Create everything required so that Ollama, not Copilot Chat, becomes the autonomous worker for this project. Copilot Chat's responsibility is to generate, improve and maintain the automation scripts. After they are created, the automation system should execute independently.

====================================================================
PRIMARY REQUIREMENTS
====================================================================

1. Create all scripts, services, configuration files and folders required.

2. Never require the Continue extension.

3. Never depend on Copilot Chat remaining open.

4. Use Ollama as the AI engine.

5. Automatically install Ollama if it is not installed.

6. Automatically start the Ollama server if it is not running.

7. Automatically pull any missing model specified in configuration.

8. Wait until Ollama is ready before continuing.

9. Start the autonomous automation service.

10. The repository root contains:

resumefromhere.txt

This file is the master instruction file.

====================================================================
AUTOMATION LOOP
====================================================================

The automation must continuously perform the following:

• Read resumefromhere.txt

• Parse every instruction.

• Determine unfinished work.

• Prioritize tasks intelligently.

• Break large tasks into smaller subtasks.

• Send tasks to Ollama.

• Execute approved project changes.

• Save checkpoints.

• Log every action.

• Retry failed tasks.

• Resume automatically after interruptions.

• Continue until ALL instructions are complete.

====================================================================
REAL-TIME FILE UPDATES
====================================================================

Update resumefromhere.txt continuously.

Every completed task must immediately update the file.

Display:

Current task

Completed tasks

Failed tasks

Retry count

Overall progress %

Time started

Last update

Estimated remaining work

Current repository status

Files modified

Files created

Files deleted

Warnings

Errors

Notes

====================================================================
DOUBLE VERIFICATION
====================================================================

Every task must be completed twice.

Verification pass #1

Run builds

Run tests

Validate outputs

Inspect modified files

Verification pass #2

Repeat validation

Ensure nothing was skipped

Confirm expected outputs

If BOTH passes succeed:

Mark task:

[✓✓]

If only first succeeds:

Mark:

[✓ ]

If unfinished:

[ ]

If failed:

[✗]

Never mark [✓✓] unless independently verified twice.

====================================================================
STOP CONDITION
====================================================================

Only pause when ALL tasks satisfy:

[✓✓]

Before pausing:

Perform one complete repository scan.

Verify no unfinished instructions remain.

Verify resumefromhere.txt is fully synchronized.

Verify all builds pass.

Verify all tests pass.

Verify no pending retries exist.

Only then enter idle mode.

====================================================================
WATCH MODE
====================================================================

Remain watching:

resumefromhere.txt

Whenever the file changes:

Reload immediately.

Determine newly added tasks.

Resume automatically.

====================================================================
SELF-HEALING
====================================================================

If the automation crashes:

Restart automatically.

Reload latest checkpoint.

Resume exactly where execution stopped.

Never restart from the beginning unless explicitly requested.

====================================================================
CHECKPOINTING
====================================================================

Store checkpoints containing:

Completed tasks

Pending tasks

Current task

Modified files

Execution history

Verification status

Progress percentage

Last successful state

====================================================================
PROJECT ANALYSIS
====================================================================

Automatically:

Read the entire repository.

Understand project architecture.

Map dependencies.

Detect build systems.

Detect programming languages.

Detect frameworks.

Detect package managers.

Detect testing frameworks.

Detect CI/CD configuration.

Detect Docker configuration.

Detect GitHub Actions.

Detect documentation.

Detect TODOs.

Detect FIXMEs.

Detect known issues.

====================================================================
CODE QUALITY
====================================================================

Always improve:

Performance

Security

Reliability

Maintainability

Readability

Documentation

Error handling

Logging

Testing

Never intentionally reduce quality.

====================================================================
SAFETY
====================================================================

Never delete important files without backup.

Never overwrite user work without backup.

Never expose secrets.

Never modify credentials.

Never leak tokens.

Validate every generated change.

====================================================================
STARTUP
====================================================================

Create everything necessary so that running one command such as:

./start-qmoi.sh

or

python start.py

will:

Install dependencies

Install Ollama

Start Ollama

Launch automation

Read resumefromhere.txt

Begin executing tasks

Update progress continuously

Verify tasks twice

Pause only after every task is marked [✓✓]

Remain watching resumefromhere.txt for future instructions and automatically resume whenever new tasks are added.

Build the complete automation system and continuously improve it whenever improvements are identified.