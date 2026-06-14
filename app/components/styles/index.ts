// Production-grade styles manager: presets, persistence, and helpers
export const VALID_THEMES = ['light', 'dark', 'high-contrast'] as const;
export type ThemeName = (typeof VALID_THEMES)[number];

export type ThemePreset = {
	name: string;
	slug: string;
	theme?: ThemeName;
	tags?: string[];
	preview?: string;
	description?: string;
};

export type StylePreferences = {
	theme?: ThemeName;
	preset?: string;
	app?: string;
	accessibility?: { highContrast?: boolean; largeText?: boolean };
	[k: string]: any;
};

export const PRESETS: Record<string, ThemePreset[]> = {
	'qcity': [
		{ name: 'Sentinel Dark', slug: 'sentinel-dark', theme: 'dark', tags: ['dark','high-contrast'], preview: '/style-previews/qcity/sentinel-dark.png', description: 'Dark monitoring-optimised preset' },
		{ name: 'Maproom Light', slug: 'maproom-light', theme: 'light', tags: ['light'], preview: '/style-previews/qcity/maproom-light.png', description: 'Light analytics preset' },
		{ name: 'Master Console', slug: 'master-console', theme: 'high-contrast', tags: ['high-contrast','master-default'], preview: '/style-previews/qcity/master-console.png', description: 'Compact master console' },
	],
	'qmoi-ai': [
		{ name: 'Neon Dialog', slug: 'neon-dialog', theme: 'dark', tags: ['dark'], preview: '/style-previews/qmoi-ai/neon-dialog.png' },
		{ name: 'Clarity Light', slug: 'clarity-light', theme: 'light', tags: ['light'], preview: '/style-previews/qmoi-ai/clarity-light.png' },
		{ name: 'Assistive', slug: 'assistive', theme: 'high-contrast', tags: ['high-contrast','accessibility'], preview: '/style-previews/qmoi-ai/assistive.png' },
	],
	'qvillage': [
		{ name: 'Marketplace', slug: 'marketplace', theme: 'light', tags: ['commerce','warm'], preview: '/style-previews/qvillage/marketplace.png' },
		{ name: 'Catalog', slug: 'catalog', theme: 'light', tags: ['grid-first','readable'], preview: '/style-previews/qvillage/catalog.png' },
		{ name: 'Community High-Contrast', slug: 'community-high-contrast', theme: 'high-contrast', tags: ['high-contrast','accessibility'], preview: '/style-previews/qvillage/community-high-contrast.png' },
	],
	'qalpha': [
		{ name: 'Research Lab', slug: 'research-lab', theme: 'dark', tags: ['metrics','clean'], preview: '/style-previews/qalpha/research-lab.png' },
		{ name: 'Notebook', slug: 'notebook', theme: 'light', tags: ['reading','paper'], preview: '/style-previews/qalpha/notebook.png' },
		{ name: 'Focus', slug: 'focus', theme: 'dark', tags: ['minimal','charts'], preview: '/style-previews/qalpha/focus.png' },
	],
	'qmoi-space': [
		{ name: 'Studio', slug: 'studio', theme: 'light', tags: ['balanced','collaboration'], preview: '/style-previews/qmoi-space/studio.png' },
		{ name: 'Workshop', slug: 'workshop', theme: 'light', tags: ['card-forward','interactive'], preview: '/style-previews/qmoi-space/workshop.png' },
		{ name: 'Accessible', slug: 'accessible', theme: 'high-contrast', tags: ['high-contrast','accessibility'], preview: '/style-previews/qmoi-space/accessible.png' },
	],
	'default': [
		{ name: 'Dark', slug: 'dark', theme: 'dark', tags: ['dark'], preview: '/style-previews/default/dark.png' },
		{ name: 'Light', slug: 'light', theme: 'light', tags: ['light'], preview: '/style-previews/default/light.png' },
		{ name: 'High Contrast', slug: 'high-contrast', theme: 'high-contrast', tags: ['high-contrast'], preview: '/style-previews/default/high-contrast.png' },
	],
};

export function listPresets(app?: string) {
	if (!app) return PRESETS['default'];
	return PRESETS[app] || PRESETS['default'];
}

export function findPreset(app: string | undefined, slug: string) {
	const presets = listPresets(app);
	return presets.find((preset) => preset.slug === slug) || null;
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
		if (console?.error) {
			console.error('setLocalTheme error', e instanceof Error ? e.message : e);
		}
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

function normalizeTheme(theme?: string | null): ThemeName {
	if (theme === 'dark' || theme === 'light' || theme === 'high-contrast') {
		return theme;
	}
	return 'light';
}

export async function applyPreset(slug: string, app?: string, opts?: { persist?: boolean; accessibility?: any }) {
	const preset = findPreset(app, slug);
	const theme = normalizeTheme(preset?.theme || null);
	const applied = setLocalTheme(theme, app, { preset: slug, theme, ...(opts?.accessibility ? { accessibility: opts.accessibility } : {}) });
	if (opts?.persist) {
		try {
			const payload: any = { stylePreferences: { theme, preset: slug, app } };
			if (opts.accessibility) payload.stylePreferences.accessibility = opts.accessibility;
			const result = await persistStyleToProfile(payload);
			if (!result.success) {
				console.warn('Failed to persist style to profile', result);
			}
			return { local: applied, persisted: result, theme };
		} catch (e) {
			return { local: applied, persisted: { success: false, error: e instanceof Error ? e.message : 'unknown' }, theme };
		}
	}
	return { local: applied, theme };
}

export default {
	PRESETS,
	listPresets,
	readLocalTheme,
	setLocalTheme,
	applyPreset,
	persistStyleToProfile,
};

