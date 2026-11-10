import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.cubicflow.solver",
  appName: "Cubic Flow",
  webDir: "dist",
  backgroundColor: "#f5f6fb",
  android: {
    allowMixedContent: false,
    captureInput: true,
  },
};

export default config;
