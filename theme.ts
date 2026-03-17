export type TextStyleToken = {
  fontFamily: string;
  fontSize: number;
  fontWeight: 400 | 500 | 600 | 700;
  lineHeight: number;
};

export type NativeShadowToken = {
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: {
    width: number;
    height: number;
  };
  elevation: number;
};

const fontFamilyBase =
  "SF Pro Text, PingFang SC, Helvetica Neue, Arial, sans-serif";

const fontFamilyMono = "SFMono-Regular, Menlo, monospace";

export const primitive = {
  color: {
    blue: {
      50: "#EAF2FF",
      100: "#D7E7FF",
      300: "#8BB4FF",
      500: "#4C8BF5",
      600: "#3D73D1",
    },
    green: {
      100: "#EAF8EF",
      500: "#34C759",
      600: "#28A745",
    },
    orange: {
      100: "#FFF3E1",
      500: "#FFB340",
      600: "#F59E0B",
    },
    red: {
      100: "#FFE8E8",
      500: "#FF6B6B",
      600: "#E55454",
    },
    purple: {
      100: "#F2EAFF",
      500: "#9B7BFF",
    },
    teal: {
      100: "#E6F8F5",
      500: "#55C7B8",
    },
    gray: {
      0: "#FFFFFF",
      50: "#F7F8FA",
      100: "#F1F3F5",
      200: "#E5E7EB",
      300: "#D1D5DB",
      500: "#6B7280",
      700: "#4B5563",
      900: "#1F2937",
    },
  },
  font: {
    family: {
      base: fontFamilyBase,
      mono: fontFamilyMono,
    },
    size: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      display: 32,
    },
    weight: {
      regular: 400 as const,
      medium: 500 as const,
      semibold: 600 as const,
      bold: 700 as const,
    },
    lineHeight: {
      xs: 18,
      sm: 20,
      md: 24,
      lg: 26,
      xl: 30,
      display: 38,
    },
  },
  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    14: 56,
    16: 64,
  },
  radius: {
    none: 0,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 999,
  },
  border: {
    width: {
      none: 0,
      thin: 1,
      medium: 2,
    },
  },
  opacity: {
    disabled: 0.4,
    muted: 0.64,
    overlay: 0.32,
  },
  zIndex: {
    base: 0,
    sticky: 10,
    floating: 20,
    overlay: 30,
    sheet: 40,
    toast: 50,
  },
  icon: {
    size: {
      sm: 16,
      md: 20,
      lg: 24,
      xl: 28,
    },
  },
  motion: {
    duration: {
      fast: 120,
      normal: 200,
      slow: 280,
    },
    easing: {
      standard: "cubic-bezier(0.2, 0, 0, 1)",
      entrance: "cubic-bezier(0.16, 1, 0.3, 1)",
      exit: "cubic-bezier(0.4, 0, 1, 1)",
    },
  },
} as const;

export const semantic = {
  color: {
    bg: {
      page: primitive.color.gray[50],
      surface: primitive.color.gray[0],
      surfaceSoft: primitive.color.blue[50],
      overlay: "rgba(31,41,55,0.32)",
    },
    text: {
      primary: primitive.color.gray[900],
      secondary: primitive.color.gray[700],
      tertiary: primitive.color.gray[500],
      inverse: primitive.color.gray[0],
      brand: primitive.color.blue[500],
    },
    border: {
      default: primitive.color.gray[200],
      strong: primitive.color.gray[300],
      brand: primitive.color.blue[300],
      danger: primitive.color.red[500],
    },
    icon: {
      primary: primitive.color.gray[900],
      secondary: primitive.color.gray[700],
      tertiary: primitive.color.gray[500],
      brand: primitive.color.blue[500],
      inverse: primitive.color.gray[0],
    },
    fill: {
      brand: primitive.color.blue[500],
      brandSoft: primitive.color.blue[50],
      success: primitive.color.green[500],
      warning: primitive.color.orange[500],
      danger: primitive.color.red[500],
      neutralSoft: primitive.color.gray[100],
    },
    tag: {
      thought: {
        bg: "#EEF3FB",
        text: "#58708F",
      },
      research: {
        bg: "#F2EAFF",
        text: "#7A5CC2",
      },
      task: {
        bg: "#EAF2FF",
        text: primitive.color.blue[600],
      },
      emotion: {
        bg: "#FFF1EC",
        text: "#D97757",
      },
      idea: {
        bg: "#E8F8EF",
        text: "#2E8B57",
      },
    },
  },
  textStyle: {
    pageTitle: {
      fontFamily: fontFamilyBase,
      fontSize: primitive.font.size.xxl,
      fontWeight: primitive.font.weight.semibold,
      lineHeight: primitive.font.lineHeight.xl,
    } satisfies TextStyleToken,
    sectionTitle: {
      fontFamily: fontFamilyBase,
      fontSize: primitive.font.size.lg,
      fontWeight: primitive.font.weight.semibold,
      lineHeight: primitive.font.lineHeight.lg,
    } satisfies TextStyleToken,
    cardTitle: {
      fontFamily: fontFamilyBase,
      fontSize: primitive.font.size.md,
      fontWeight: primitive.font.weight.semibold,
      lineHeight: primitive.font.lineHeight.md,
    } satisfies TextStyleToken,
    body: {
      fontFamily: fontFamilyBase,
      fontSize: primitive.font.size.sm,
      fontWeight: primitive.font.weight.regular,
      lineHeight: primitive.font.lineHeight.md,
    } satisfies TextStyleToken,
    caption: {
      fontFamily: fontFamilyBase,
      fontSize: primitive.font.size.xs,
      fontWeight: primitive.font.weight.regular,
      lineHeight: primitive.font.lineHeight.xs,
    } satisfies TextStyleToken,
    statNumber: {
      fontFamily: fontFamilyBase,
      fontSize: primitive.font.size.display,
      fontWeight: primitive.font.weight.semibold,
      lineHeight: primitive.font.lineHeight.display,
    } satisfies TextStyleToken,
  },
  layout: {
    pagePaddingX: primitive.space[4],
    pagePaddingTop: primitive.space[5],
    sectionGap: primitive.space[6],
    cardGap: primitive.space[3],
    inlineGap: primitive.space[2],
    chipGap: primitive.space[2],
  },
} as const;

export const shadow = {
  sm: {
    web: "0 2px 8px rgba(31,41,55,0.06)",
    native: {
      shadowColor: "#1F2937",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      elevation: 2,
    } satisfies NativeShadowToken,
  },
  md: {
    web: "0 8px 24px rgba(31,41,55,0.10)",
    native: {
      shadowColor: "#1F2937",
      shadowOpacity: 0.1,
      shadowRadius: 24,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      elevation: 6,
    } satisfies NativeShadowToken,
  },
} as const;

export const component = {
  button: {
    primary: {
      height: 52,
      paddingX: primitive.space[4],
      radius: primitive.radius.xl,
      bg: {
        default: semantic.color.fill.brand,
        pressed: primitive.color.blue[600],
        disabled: primitive.color.gray[300],
      },
      text: {
        default: semantic.color.text.inverse,
        disabled: semantic.color.text.inverse,
      },
    },
    secondary: {
      height: 44,
      paddingX: primitive.space[4],
      radius: primitive.radius.lg,
      bg: {
        default: semantic.color.bg.surface,
        pressed: primitive.color.gray[100],
        disabled: primitive.color.gray[100],
      },
      border: {
        default: semantic.color.border.default,
        pressed: semantic.color.border.strong,
      },
      text: {
        default: semantic.color.text.primary,
        disabled: semantic.color.text.tertiary,
      },
    },
    ghost: {
      height: 40,
      paddingX: primitive.space[3],
      radius: primitive.radius.lg,
      text: {
        default: semantic.color.text.secondary,
        pressed: semantic.color.text.primary,
      },
    },
  },
  input: {
    textArea: {
      minHeight: 96,
      padding: primitive.space[4],
      radius: primitive.radius.lg,
      bg: semantic.color.bg.surface,
      border: {
        default: semantic.color.border.default,
        focus: semantic.color.border.brand,
        error: semantic.color.border.danger,
      },
      text: {
        value: semantic.color.text.primary,
        placeholder: semantic.color.text.tertiary,
      },
    },
  },
  chip: {
    height: 32,
    paddingX: primitive.space[3],
    radius: primitive.radius.full,
    textStyle: semantic.textStyle.caption,
    default: {
      bg: primitive.color.gray[100],
      text: semantic.color.text.secondary,
    },
    selected: {
      bg: semantic.color.fill.brandSoft,
      text: semantic.color.text.brand,
      border: semantic.color.border.brand,
    },
  },
  card: {
    default: {
      bg: semantic.color.bg.surface,
      border: semantic.color.border.default,
      radius: primitive.radius.lg,
      padding: primitive.space[4],
    },
    highlight: {
      bg: semantic.color.bg.surfaceSoft,
      border: semantic.color.border.brand,
      radius: primitive.radius.lg,
      padding: primitive.space[4],
    },
  },
  bottomSheet: {
    bg: semantic.color.bg.surface,
    radiusTop: primitive.radius.xxl,
    paddingTop: primitive.space[3],
    paddingX: primitive.space[4],
    paddingBottom: primitive.space[6],
    shadow: shadow.md,
  },
  segmentedControl: {
    height: 36,
    radius: primitive.radius.full,
    bg: primitive.color.gray[100],
    thumbBg: semantic.color.bg.surface,
    text: {
      default: semantic.color.text.secondary,
      selected: semantic.color.text.primary,
    },
  },
  toast: {
    bg: primitive.color.gray[900],
    text: semantic.color.text.inverse,
    radius: primitive.radius.lg,
    paddingX: primitive.space[4],
    paddingY: primitive.space[3],
  },
} as const;

export const page = {
  home: {
    backgroundColor: semantic.color.bg.page,
    taskCard: component.card.highlight,
    pendingCard: component.card.default,
    primaryAction: component.button.primary,
  },
  quickNote: {
    backgroundColor: semantic.color.bg.overlay,
    container: component.bottomSheet,
    input: component.input.textArea,
    quickAction: component.chip,
    primaryAction: component.button.primary,
  },
  inbox: {
    backgroundColor: semantic.color.bg.page,
    filter: component.segmentedControl,
    noteCard: component.card.default,
    primaryAction: component.button.secondary,
  },
  stats: {
    backgroundColor: semantic.color.bg.page,
    chartCard: component.card.default,
    insightCard: component.card.highlight,
    statNumberStyle: semantic.textStyle.statNumber,
  },
} as const;

export const theme = {
  primitive,
  semantic,
  shadow,
  component,
  page,
} as const;

export type Theme = typeof theme;

export default theme;
