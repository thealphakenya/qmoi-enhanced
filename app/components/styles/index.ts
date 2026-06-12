// Production-grade styles manager: presets, persistence, and helpers
export type ThemePreset = {
	name: string;
	slug: string;
	tags?: string[];
	preview?: string;
	description?: string;
};

export type StylePreferences = {
	theme?: string;
	preset?: string;
	app?: string;
	accessibility?: { highContrast?: boolean; largeText?: boolean };
	[k: string]: any;
};

export const PRESETS: Record<string, ThemePreset[]> = {
	'qcity': [
		{ name: 'Sentinel Dark', slug: 'sentinel-dark', tags: ['dark','high-contrast'], preview: '/style-previews/qcity/sentinel-dark.png', description: 'Dark monitoring-optimised preset' },
		{ name: 'Maproom Light', slug: 'maproom-light', tags: ['light'], preview: '/style-previews/qcity/maproom-light.png', description: 'Light analytics preset' },
		{ name: 'Master Console', slug: 'master-console', tags: ['high-contrast','master-default'], preview: '/style-previews/qcity/master-console.png', description: 'Compact master console' },
	],
	'qmoi-ai': [
		{ name: 'Neon Dialog', slug: 'neon-dialog', tags: ['dark'], preview: '/style-previews/qmoi-ai/neon-dialog.png' },
		{ name: 'Clarity Light', slug: 'clarity-light', tags: ['light'], preview: '/style-previews/qmoi-ai/clarity-light.png' },
		{ name: 'Assistive', slug: 'assistive', tags: ['high-contrast','accessibility'], preview: '/style-previews/qmoi-ai/assistive.png' },
	],
	'default': [
		{ name: 'Dark', slug: 'dark', tags: ['dark'], preview: '/style-previews/default/dark.png' },
		{ name: 'Light', slug: 'light', tags: ['light'], preview: '/style-previews/default/light.png' },
		{ name: 'High Contrast', slug: 'high-contrast', tags: ['high-contrast'], preview: '/style-previews/default/high-contrast.png' },
	],
};

export function listPresets(app?: string) {
	if (!app) return PRESETS['default'];
	return PRESETS[app] || PRESETS['default'];
}

function isBrowser() {
	return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readLocalTheme(app?: string) {
	if (!isBrowser()) return null;
	const theme = window.localStorage.getItem('qmoi_theme') || null;
	const override = app ? window.localStorage.getItem(`qmoi_theme_overrides.${app}`) : null;
	return { theme, override: override ? JSON.parse(override) : null };
}

export function setLocalTheme(slug: string, app?: string, overrides?: Record<string, any>) {
	if (!isBrowser()) return false;
	try {
		window.localStorage.setItem('qmoi_theme', slug);
		if (app && overrides) {
			window.localStorage.setItem(`qmoi_theme_overrides.${app}`, JSON.stringify(overrides));
		} else if (app && !overrides) {
			window.localStorage.setItem(`qmoi_theme_overrides.${app}`, JSON.stringify({ preset: slug }));
		}
		// Notify listeners
		window.dispatchEvent(new CustomEvent('qmoi:theme-changed', { detail: { theme: slug, app } }));
		return true;
	} catch (e) {
		console.error('setLocalTheme error', e);
		return false;
	}
}

async function persistStyleToProfile(style: StylePreferences, attempts = 3, backoffMs = 300) {
	// Attempt to persist style preferences to authenticated user profile
	if (!isBrowser()) return { success: false, error: 'not-browser' };
	for (let i = 0; i < attempts; i++) {
		try {
			const res = await fetch('/api/auth/profile', {
				method: 'PUT',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(style),
			});
			const json = await res.json();
			if (res.ok) return { success: true, json };
			// non-200 -> wait and retry
			await new Promise((r) => setTimeout(r, backoffMs * (i + 1)));
		} catch (err) {
			await new Promise((r) => setTimeout(r, backoffMs * (i + 1)));
		}
	}
	return { success: false, error: 'persist-failed' };
}

export async function applyPreset(slug: string, app?: string, opts?: { persist?: boolean; accessibility?: any }) {
	const applied = setLocalTheme(slug, app, { preset: slug, ...opts?.accessibility ? { accessibility: opts.accessibility } : {} });
	if (opts?.persist) {
		try {
			const payload: any = { stylePreferences: { theme: slug, preset: slug, app } };
			if (opts.accessibility) payload.stylePreferences.accessibility = opts.accessibility;
			const result = await persistStyleToProfile(payload);
			if (!result.success) {
				console.warn('Failed to persist style to profile', result);
			}
			return { local: applied, persisted: result };
		} catch (e) {
			return { local: applied, persisted: { success: false, error: e instanceof Error ? e.message : 'unknown' } };
		}
	}
	return { local: applied };
}

export default {
	PRESETS,
	listPresets,
	readLocalTheme,
	setLocalTheme,
	applyPreset,
	persistStyleToProfile,
};

