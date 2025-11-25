---
title: "Issue draft for components/HelpGuide.tsx"
generated: 2025-11-08T16:06:38.359385Z
---

# Review needed: components/HelpGuide.tsx

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SisterProjects } from "@/components/SisterProjects"
import { DownloadAppButton } from "@/components/DownloadAppButton"

const SUGGESTED_PROJECTS = [
	{
		title: 'Personal Budget Tracker',
		description:
			'Track your spending and savings automatically. Get reminders and tips to save more.',
	},
	{
		title: 'Homework Helper',
		description:
			'AI helps you organize, plan, and get help with your homework or studies.',
	},
	{
		title: 'Gift Planner',
		description: 'Plan gifts for friends and family, with reminders and suggestions.',
	},
	{
		title: 'Health & Fitness Buddy',
		description: 'Get daily health tips, track your steps, and set fun fitness goals.',
	},
	{
		title: 'Dream Journal',
		description:
			'Record your dreams and ideas. AI helps you organize and revisit them.',
	},
];

export function HelpGuide() {
	const [role, setRole] = useState<'master' | 'sister' | 'user'>('user');
	useEffect(() => {
		if (role === 'sister') {
			// AI proactively suggests projects for sister
			window.dispatchEvent(
				new CustomEvent('ai-suggested-projects', { detail: SUGGESTED_PROJECTS })
			);
		}
	}, [role]);

	return (
		<Card className="max-w-2xl mx-auto my-8">
			<CardHeader>
				<CardTitle>Help & Guide</CardTitle>
				<div className="flex gap-2 mt-2">
					<button
						className={`px-2 py-1 rounded ${
							role === 'user' ? 'bg-blue-200' : 'bg-gray-100'
						}`}
						onClick={() => setRole('user')}
					>
						User
					</button>
					<button
						className={`px-2 py-1 rounded ${
							role === 'sister' ? 'bg-pink-200' : 'bg-gray-100'
						}`}
						onClick={() => setRole('sister')}
					>
						Sister
					</button>
					<button
						className={`px-2 py-1 rounded ${
							role === 'master' ? 'bg-green-200' : 'bg-gray-100'
						}`}
						onClick={() => setRole('master')}
					>
				
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
