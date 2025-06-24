export type TemplateName = keyof typeof templates;

export const templates = {
  default_sale: {
    backgroundOverlay: {
      type: "gradient",
      colors: ["rgba(0,0,0,0.6)", "rgba(0,0,0,0.2)"],
      direction: "to top",
      heightRatio: 0.35,
    },
    text: {
      headline: {
        font: "bold 48px Arial",
        color: "#ffffff",
        align: "center" as const,
        xRatio: 0.5,
        yRatio: 0.75,
      },
      subtext: {
        font: "28px Arial",
        color: "#dddddd",
        align: "center" as const,
        xRatio: 0.5,
        yRatio: 0.85,
      },
    },
  },

  bold_announcement: {
    backgroundOverlay: {
      type: "solid",
      color: "rgba(255,255,255,0.8)",
      heightRatio: 1.0,
    },
    text: {
      headline: {
        font: "bold 60px Arial",
        color: "#000000",
        align: "center",
        xRatio: 0.5,
        yRatio: 0.4,
      },
      subtext: {
        font: "32px Arial",
        color: "#333333",
        align: "center",
        xRatio: 0.5,
        yRatio: 0.55,
      },
    },
  },

  light_theme_toptext: {
    backgroundOverlay: {
      type: "solid",
      color: "rgba(255,255,255,0.7)",
      heightRatio: 0.3,
    },
    text: {
      headline: {
        font: "bold 42px Arial",
        color: "#222",
        align: "center",
        xRatio: 0.5,
        yRatio: 0.15,
      },
      subtext: {
        font: "24px Arial",
        color: "#555",
        align: "center",
        xRatio: 0.5,
        yRatio: 0.22,
      },
    },
  },

  boldMinimal: {
    backgroundOverlay: {
      type: "solid",
      color: "rgba(0,0,0,0.6)",
      heightRatio: 1.0,
    },
    text: {
      headline: {
        font: "bold 48px Arial",
        color: "#ffffff",
        align: "center",
        xRatio: 0.5,
        yRatio: 0.5,
      },
      subtext: {
        font: "24px Arial",
        color: "#cccccc",
        align: "center",
        xRatio: 0.5,
        yRatio: 0.6,
      },
    },
  },

  softPastel: {
    backgroundOverlay: {
      type: "solid",
      color: "rgba(255, 228, 235, 0.8)", // close to bg-pink-100
      heightRatio: 1.0,
    },
    text: {
      headline: {
        font: "italic 36px Georgia",
        color: "#9b2c2c", // close to text-pink-800
        align: "center",
        xRatio: 0.5,
        yRatio: 0.5,
      },
      subtext: {
        font: "24px Georgia",
        color: "#b83280", // a slightly darker tone
        align: "center",
        xRatio: 0.5,
        yRatio: 0.6,
      },
    },
  },

  gradientFocus: {
    backgroundOverlay: {
      type: "gradient",
      colors: ["#ec4899", "#ef4444", "#facc15"], // pink to red to yellow
      direction: "to right",
      heightRatio: 1.0,
    },
    text: {
      headline: {
        font: "extrabold 48px Arial",
        color: "#ffffff",
        align: "center",
        xRatio: 0.5,
        yRatio: 0.5,
      },
      subtext: {
        font: "28px Arial",
        color: "#ffffff",
        align: "center",
        xRatio: 0.5,
        yRatio: 0.6,
      },
    },
  },

  corporateSlide: {
    backgroundOverlay: {
      type: "solid",
      color: "#ffffff",
      heightRatio: 1.0,
    },
    text: {
      headline: {
        font: "medium 32px Arial",
        color: "#1f2937", // text-gray-800
        align: "left",
        xRatio: 0.3,
        yRatio: 0.4,
      },
      subtext: {
        font: "24px Arial",
        color: "#4b5563", // text-gray-600
        align: "left",
        xRatio: 0.3,
        yRatio: 0.5,
      },
    },
  },
};
