import React from 'react';

export const RELEASES: Array<{ version: string; date?: string; notes: string[] }> = [];

const ReleaseNotes: React.FC = () => {
	if (RELEASES.length === 0) {
		return (
			<div className="p-4 text-sm text-gray-600">
				No release notes available. Subscribe to project updates or check the changelog in the repo.
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{RELEASES.map((r) => (
				<div key={r.version} className="p-3 border rounded">
					<div className="font-semibold">Version {r.version}</div>
					{r.date && <div className="text-xs text-gray-500">{r.date}</div>}
					<ul className="list-disc ml-5 mt-2">
						{r.notes.map((n, i) => (
							<li key={i}>{n}</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};

export default ReleaseNotes;
