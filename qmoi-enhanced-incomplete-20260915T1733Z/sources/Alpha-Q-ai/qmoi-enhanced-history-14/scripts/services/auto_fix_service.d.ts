// TypeScript declarations for auto_fix_service to help resolve imports during build
export interface AutoFixService {
  runFixes(): Promise<{ success: boolean; fixes: unknown[] }>;
  getStatus(): Promise<{ running: boolean }>;
  startAutoFix(
    _status: unknown,
  ): Promise<{ success: boolean; fixes: unknown[] }>;
  startContinuousAutoFix(_getStatus: () => Promise<any>): Promise<void>;
  stopContinuousAutoFix(): Promise<void>;
}

export const autoFixService: AutoFixService;
export default autoFixService;
