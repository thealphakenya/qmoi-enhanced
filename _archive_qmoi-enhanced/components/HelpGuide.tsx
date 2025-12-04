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
						Master
					</button>
				</div>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue={role} value={role} onValueChange={setRole}>
					<TabsList>
						<TabsTrigger value="user">User</TabsTrigger>
						<TabsTrigger value="sister">Sister</TabsTrigger>
						<TabsTrigger value="master">Master</TabsTrigger>
					</TabsList>
					<TabsContent value="user">
						<h3 className="font-semibold mb-2">User Guide</h3>
						<ul className="list-disc ml-4 text-sm">
							<li>Use the tabs to navigate between features.</li>
							<li>Hover over buttons for tooltips.</li>
							<li>Use the Help tab for step-by-step instructions.</li>
							<li>Ask the AI for help at any time.</li>
						</ul>
					</TabsContent>
					<TabsContent value="sister">
						<h3 className="font-semibold mb-2">Sister Guide</h3>
						<ul className="list-disc ml-4 text-sm">
							<li>Access your goals, inventions, wallet, and Kids Zone from the main tabs.</li>
							<li>Type instructions in plain language (e.g., "send 500 to Leah via Mpesa").</li>
							<li>Use the Help tab for easy instructions and tips.</li>
							<li>Your data is always private and secure.</li>
						</ul>
						<div className="mt-4">
							<h4 className="font-semibold">AI Project Suggestions for You</h4>
							<ul className="list-disc ml-6 text-sm">
								{SUGGESTED_PROJECTS.map((p, i) => (
									<li key={i} className="mb-1">
										<span className="font-bold">{p.title}:</span> {p.description}
									</li>
								))}
							</ul>
							<div className="mt-2 text-xs text-gray-500">
								Tap a suggestion to save it to your projects. The AI will help you set it up step by step, no tech skills needed!
							</div>
						</div>
						<SisterProjects />
					</TabsContent>
					<TabsContent value="master">
						<h3 className="font-semibold mb-2">Master Guide</h3>
						<ul className="list-disc ml-4 text-sm">
							<li>Monitor and control all projects, devices, and funds.</li>
							<li>Receive WhatsApp notifications for project completions.</li>
							<li>Access the daily master plan and project status in the UI or via WhatsApp.</li>
							<li>All actions are logged and exportable.</li>
						</ul>
					</TabsContent>
				</Tabs>
				<DownloadAppButton />
			</CardContent>
		</Card>
	);
}
