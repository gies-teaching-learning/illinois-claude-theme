import type { Register, ThemeColors, ThemeSetArgs } from 'claude-code'

import { checkColors, makeColors } from './make-colors.js'

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

// The Illinois "finial" brand pattern (brand.illinois.edu, --il-pattern-finial), one 80-point tile,
// drawn as a quiet line pattern over the page color so it follows light and dark mode.
const FINIAL =
  'M58.6,0H31h-2H1.4H0v1.4V29v2v27.6V60h1.4H29h2h27.6H60v-1.4V31v-2V1.4V0H58.6z M31,1h26.6L31,27.6V1z M29,1v26.6L2.4,1H29z M1,2.4L27.6,29H1V2.4z M1,57.6V31h26.6L1,57.6z M29,59H2.4L29,32.4V59z M31,59V32.4L57.6,59H31z M59,57.6L32.4,31H59V57.6z M59,29H32.4L59,2.4V29z'

const BACKDROP: ThemeSetArgs['backdrop'] = {
  vector: {
    viewBox: 60,
    size: [80, 80],
    repeat: true,
    paths: [
      { d: 'M0 0H60V60H0Z', color: 'surface-0' },
      { d: FINIAL, color: 'surface-3' },
    ],
  },
}

const COLORS_ONLY: ThemeSetArgs = { colors, backdrop: BACKDROP }

const LOOK: ThemeSetArgs = {
  colors,
  backdrop: BACKDROP,
  style: {
    Heading: { color: 'text-primary', fontWeight: 'bold' },
    UserMessage: {
      backgroundColor: 'bg-user-message',
      color: 'text-user-message',
      radius: 12,
      borderColor: ILLINI_ORANGE,
      borderWidth: 2,
    },
  },
}

export const register: Register = on => {
  on('tool.run', { tool: /^mcp__illinois-theme__theme_status$/ }, async $ => {
    let error = ''
    let set
    try {
      set = await $.theme.set(LOOK)
    } catch (err) {
      error = String(err)
      set = await $.theme.set(COLORS_ONLY)
    }
    const report = JSON.stringify({ set, styleError: error, checkColors: checkColors(colors), unpainted: problems.filter(l => l.startsWith("Desktop won't")) }, null, 2)
    return { result: report, text: report }
  })

  on('session.start', async ($, e, next) => {
    await $.tool.register({ name: 'theme_status', description: 'Re-apply the Illinois theme and report what the app answered.', isDeferred: false, inputSchema: { type: 'object', properties: {} } })
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    let set
    try {
      set = await $.theme.set(LOOK)
    } catch (error) {
      $.ui.log(String(error))
      set = await $.theme.set(COLORS_ONLY)
    }

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })
}
