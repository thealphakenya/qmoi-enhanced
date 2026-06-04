export interface AvatarConfig {
  userId: string;
  name: string;
  email: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: 'professional' | 'creative' | 'complete' | 'tech';
  backgroundColor?: string;
  initials?: boolean;
}

export interface AvatarSet {
  default: string;
  small: string;
  large: string;
  gradient: string;
  value: string;
}

export const AVATAR_PALETTES: Record<string, string[]> = {
  professional: [
    '#667eea,#764ba2',
    '#2196f3,#1976d2',
    '#4caf50,#45a049',
  ],
  creative: [
    '#f093fb,#f5576c',
    '#fa709a,#fee140',
    '#30cfd0,#330867',
  ],
  complete: [
    '#ecf0f1,#95a5a6',
    '#34495e,#7f8c8d',
    '#e74c3c,#c0392b',
  ],
  tech: [
    '#00d9ff,#6600ff',
    '#667eea,#764ba2',
    '#f093fb,#f5576c',
  ],
};

const SIZE_MAP: Record<'sm'|'md'|'lg'|'xl', number> = {
  sm: 48,
  md: 128,
  lg: 256,
  xl: 512,
};

/**
 * hashString function
 */
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export /**
 * extractInitials function
 */
function extractInitials(name: string = 'User'): string {
  if (!name.trim()) return 'U';
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }

  return parts
    .map((part) => part[0].toUpperCase())
    .join('');
}

export /**
 * getColorIndex function
 */
function getColorIndex(seed: string): number {
  if (!seed) return 0;
  return hashString(seed) % Object.keys(AVATAR_PALETTES).length;
}

export /**
 * validateAvatarConfig function
 */
function validateAvatarConfig(config: AvatarConfig): boolean {
  const allowedStyles = ['professional', 'creative', 'complete', 'tech'];
  const allowedSizes = ['sm', 'md', 'lg', 'xl'];

  if (!config || typeof config !== 'object') return false;
  if (!config.userId || !config.name || !config.email) return false;
  if (config.style && !allowedStyles.includes(config.style)) return false;
  if (config.size && !allowedSizes.includes(config.size)) return false;
  return true;
}

/**
 * normalizeStyle function
 */
function normalizeStyle(style?: string): keyof typeof AVATAR_PALETTES {
  const normalized = String(style || 'professional').toLowerCase();
  return (Object.keys(AVATAR_PALETTES).includes(normalized)
    ? normalized
    : 'professional') as keyof typeof AVATAR_PALETTES;
}

/**
 * normalizeSize function
 */
function normalizeSize(size?: string): 'sm' | 'md' | 'lg' | 'xl' {
  const normalized = String(size || 'md').toLowerCase();
  return (['sm', 'md', 'lg', 'xl'].includes(normalized)
    ? (normalized as 'sm' | 'md' | 'lg' | 'xl')
    : 'md');
}

/**
 * buildGradientSvg function
 */
function buildGradientSvg(name: string, palette: string[], width: number): string {
  const [start, end] = palette[0].split(',');
  const initials = extractInitials(name);

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="https://www.w3.org/2000/svg" width="${width}" height="${width}" viewBox="0 0 ${width} ${width}">\n` +
    `  <defs>\n` +
    `    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">\n` +
    `      <stop offset="0%" stop-color="${start}"/>\n` +
    `      <stop offset="100%" stop-color="${end}"/>\n` +
    `    </linearGradient>\n` +
    `  </defs>\n` +
    `  <rect width="${width}" height="${width}" fill="url(#g)" rx="${width / 8}" ry="${width / 8}"/>\n` +
    `  <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="${Math.floor(width / 2.4)}" fill="#ffffff" font-weight="700">${initials}</text>\n` +
    `</svg>`;
}

export /**
 * initializeAvatar function
 */
function initializeAvatar(config: AvatarConfig): AvatarSet {
  const validated = validateAvatarConfig(config);
  const finalConfig: AvatarConfig = {
    config,
    size: normalizeSize(config.size),
    style: normalizeStyle(config.style),
  };

  const palette = AVATAR_PALETTES[finalConfig.style];
  const paletteIndex = getColorIndex(finalConfig.userId);
  const selectedPalette = [palette[paletteIndex % palette.length]];
  const gradientSvg = buildGradientSvg(finalConfig.name, selectedPalette, SIZE_MAP[finalConfig.size]);

  return {
    default: gradientSvg,
    small: buildGradientSvg(finalConfig.name, selectedPalette, SIZE_MAP.sm),
    large: buildGradientSvg(finalConfig.name, selectedPalette, SIZE_MAP.lg),
    gradient: `linear-gradient(135deg, ${selectedPalette[0].replace(',', ' 0%, ')} 100%)`,
    value: `/avatar-default.svg`,
  };
}

export /**
 * generateAvatarBatch function
 */
function generateAvatarBatch(config: AvatarConfig): Record<string, string> {
  const finalConfig: AvatarConfig = {
    config,
    size: normalizeSize(config.size),
    style: normalizeStyle(config.style),
  };

  const avatarSet = initializeAvatar(finalConfig);

  return {
    avatar_48: avatarSet.small,
    avatar_128: avatarSet.default,
    avatar_256: avatarSet.large,
    avatar_512: buildGradientSvg(finalConfig.name, AVATAR_PALETTES[finalConfig.style], SIZE_MAP.xl),
    avatar_gradient: avatarSet.gradient,
    avatar_default: avatarSet.value,
  };
}

export /**
 * getAvatarUrl function
 */
function getAvatarUrl(config: AvatarConfig): string {
  const style = normalizeStyle(config.style);
  const size = normalizeSize(config.size);
  return `/api/avatars/${encodeURIComponent(config.userId)}?size=${SIZE_MAP[size]}&style=${encodeURIComponent(style)}`;
}
