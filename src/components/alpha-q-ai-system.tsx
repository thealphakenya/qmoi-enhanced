import React, { useEffect, useState } from "react";

const AlphaQAiSystem = () => {
	const [model, setModel] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchModel = async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/qmoi/model/status");
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				const data = await res.json();
				setModel(data);
			} catch (err: any) {
				setError(err.message || "Failed to fetch model status");
			} finally {
				setLoading(false);
			}
		};
		fetchModel();
	}, []);

	return (
		<div className="p-3 border rounded bg-slate-900 text-sm">
			<h4 className="font-semibold">Alpha-Q AI System</h4>
			{error && <div className="text-red-400">{error}</div>}
			{loading && <div className="text-gray-400">Loading...</div>}
			{model && (
				<pre className="text-xs bg-black p-2 rounded max-h-48 overflow-auto">{JSON.stringify(model, null, 2)}</pre>
			)}
		</div>
	);
};

export default AlphaQAiSystem;