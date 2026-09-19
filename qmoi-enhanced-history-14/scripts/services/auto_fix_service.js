// Minimal auto-fix service shim to satisfy TypeScript/Next imports during build
exports.autoFixService = {
  async runFixes() {
    return { success: true, fixes: [] };
  },
  async getStatus() {
    return { running: false };
  },
  async startAutoFix(_status) {
    return {
      success: true,
      fixes: [],
      message: "Auto-fix service is available",
    };
  },
  async startContinuousAutoFix(_getStatus) {
    return;
  },
  async stopContinuousAutoFix() {
    return;
  },
};

module.exports.default = exports.autoFixService;
