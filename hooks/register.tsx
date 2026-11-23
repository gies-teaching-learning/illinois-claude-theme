import type { EngineInterface, Register, ThemeColors, ThemeResult, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Official Illinois brand colors (brand.illinois.edu)
const ILLINI_ORANGE = '#FF5F05'
const ILLINI_BLUE = '#13294B'
const ALTGELD = '#C84113' // brand's accessible orange for small text on light grounds
const INDUSTRIAL = '#1D58A7'
const PRAIRIE = '#006230'
const HARVEST = '#FCB316'
const STORM_95 = '#F4F4F4'
const STORM_80 = '#C6C7C6'

// Light: white cards on a cool gray page with Illini Blue ink. Dark: a night campus in Illini Blue.
const { theme, problems } = makeColors({
  label: 'Illinois',
  roles: { accent: ILLINI_ORANGE, danger: '#B5332A', success: PRAIRIE, warning: HARVEST, pro: INDUSTRIAL },
  light: {
    roles: { accent: ALTGELD },
    gray: {
      anchors: {
        'surface-0': '#F1F2F5',
        'surface-1': '#F8F9FA',
        'surface-2': '#FFFFFF',
        'surface-3': '#FFFFFF',
        'text-primary': ILLINI_BLUE,
        'text-secondary': '#33435E',
        'text-muted': '#515E73',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0A1729',
        'surface-1': '#0E1E3A',
        'surface-2': '#102240',
        'surface-3': '#112544',
        'text-primary': STORM_95,
        'text-secondary': STORM_80,
        'text-muted': '#A7B1C2',
      },
    },
  },
})

// The person's bubble in Illini Blue (light) and a lifted blue (dark), white words.
const colors: ThemeColors = {
  ...theme,
  inputs: {
    ...theme.inputs,
    light: { ...theme.inputs.light, 'bg-user-message': ILLINI_BLUE, 'text-user-message': '#FFFFFF' },
    dark: { ...theme.inputs.dark, 'bg-user-message': '#1E3A66', 'text-user-message': '#FFFFFF' },
  },
}

// Background patterns, each a quiet tile in a palette color so it follows light and dark mode.
// finial and ascend are the Illinois brand patterns (brand.illinois.edu, --il-pattern-*), redrawn
// as vector paths. The -fade versions lay a white (light) or blue (dark) gradient over the
// pattern, as the brand's web gradients do, so it shows at the top right and fades out.
const FINIAL =
  'M58.6,0H31h-2H1.4H0v1.4V29v2v27.6V60h1.4H29h2h27.6H60v-1.4V31v-2V1.4V0H58.6z M31,1h26.6L31,27.6V1z M29,1v26.6L2.4,1H29z M1,2.4L27.6,29H1V2.4z M1,57.6V31h26.6L1,57.6z M29,59H2.4L29,32.4V59z M31,59V32.4L57.6,59H31z M59,57.6L32.4,31H59V57.6z M59,29H32.4L59,2.4V29z'
const ASCEND = 'M36 40L31 40L40 31L40 36Z M36 0L0 36L0 31L31 0Z'
type PatternName = 'finial-fade' | 'ascend-fade' | 'finial' | 'ascend' | 'none'
const PATTERN_NAMES: readonly PatternName[] = ['finial-fade', 'ascend-fade', 'finial', 'ascend', 'none']
const DEFAULT_PATTERN: PatternName = 'finial-fade'

const PATTERNS: Record<PatternName, ThemeSetArgs['backdrop']> = {
  finial: {
    vector: {
      viewBox: 60, size: [80, 80], repeat: true,
      paths: [{ d: 'M0 0H60V60H0Z', color: 'surface-0' }, { d: FINIAL, color: 'surface-1' }],
    },
  },
  ascend: {
    vector: {
      viewBox: 40, size: [48, 48], repeat: true,
      paths: [{ d: 'M0 0H40V40H0Z', color: 'surface-0' }, { d: ASCEND, color: 'surface-1' }],
    },
  },
  'finial-fade': { scene: 'finial-fade', glass: false },
  'ascend-fade': { scene: 'ascend-fade', glass: false },
  none: { color: 'surface-0' },
}

function fadeScene(tile: number, scale: number, d: string): string {
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">' +
    '<style>.base{fill:#F1F2F5}.line{fill:#DCE0E8}.s{stop-color:#F1F2F5}' +
    '@media (prefers-color-scheme: dark){.base{fill:#0A1729}.line{fill:#1A3360}.s{stop-color:#0A1729}}</style>' +
    `<defs><pattern id="p" patternUnits="userSpaceOnUse" width="${tile}" height="${tile}">` +
    `<path class="line" fill-rule="evenodd" transform="scale(${scale})" d="${d}"/></pattern>` +
    '<linearGradient id="g" x1="1" y1="0" x2="0" y2="1">' +
    '<stop offset="0" class="s" stop-opacity="0.2"/><stop offset="0.35" class="s" stop-opacity="0.75"/>' +
    '<stop offset="0.65" class="s" stop-opacity="1"/></linearGradient></defs>' +
    '<rect class="base" width="100%" height="100%"/><rect fill="url(#p)" width="100%" height="100%"/>' +
    '<rect fill="url(#g)" width="100%" height="100%"/></svg>'
  )
}

const SCENES: Record<string, { source: string; alt: string }> = {
  'finial-fade': { source: fadeScene(80, 80 / 60, FINIAL), alt: 'The Illinois finial pattern, fading out from the top right' },
  'ascend-fade': { source: fadeScene(48, 48 / 40, ASCEND), alt: 'Illinois ascending lines, fading out from the top right' },
}

const STYLE: ThemeSetArgs['style'] = {
  Heading: { color: 'text-primary', fontWeight: 'bold' },
  UserMessage: {
    backgroundColor: 'bg-user-message',
    color: 'text-user-message',
    radius: 12,
    borderColor: ILLINI_ORANGE,
    borderWidth: 2,
  },
}

async function applyLook($: EngineInterface, pattern: PatternName): Promise<{ set: ThemeResult; error: string }> {
  const backdrop = PATTERNS[pattern]
  try {
    return { set: await $.theme.set({ colors, backdrop, style: STYLE }), error: '' }
  } catch (err) {
    $.ui.log(String(err))
    return { set: await $.theme.set({ colors, backdrop }), error: String(err) }
  }
}

async function storedPattern($: EngineInterface): Promise<PatternName> {
  const v = await $.store.get('pattern')
  return PATTERN_NAMES.includes(v as PatternName) ? (v as PatternName) : DEFAULT_PATTERN
}

export const register: Register = on => {
  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    const scene = SCENES[String(e.props.scene)]
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || scene === undefined) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)
    return <Svg source={scene.source} alt={scene.alt} />
  })

  on('tool.run', { tool: /^mcp__illinois-theme__theme_status$/ }, async $ => {
    const pattern = await storedPattern($)
    const { set, error } = await applyLook($, pattern)
    const report = JSON.stringify({ pattern, set, styleError: error, unpainted: problems.filter(l => l.startsWith("Desktop won't")) }, null, 2)
    return { result: report, text: report }
  })

  on('command.run', { command: 'illinois-pattern' }, async ($, e) => {
    const want = e.args.trim().toLowerCase()
    if (!PATTERN_NAMES.includes(want as PatternName)) {
      const now = await storedPattern($)
      return { text: `Background pattern is "${now}". Choose one: /illinois-pattern ${PATTERN_NAMES.join(' | ')}` }
    }
    await $.store.set('pattern', want)
    await applyLook($, want as PatternName)
    return { text: `Background pattern set to "${want}".` }
  })

  on('session.start', async ($, e, next) => {
    await $.tool.register({ name: 'theme_status', description: 'Re-apply the Illinois theme and report what the app answered.', isDeferred: false, inputSchema: { type: 'object', properties: {} } })
    await $.command.register({ name: 'illinois-pattern', description: 'Choose the Illinois theme background: finial-fade, ascend-fade, finial, ascend or none' })

    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))
    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    const { set } = await applyLook($, await storedPattern($))
    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })
}
