declare module "../../../scripts/services/auto_fix_service" {
  export type QCityStatus = {
    errors: unknown[];
    [k: string]: unknown;
  };

  export type AutoFixService = {
    startContinuousAutoFix?: (getStatus: () => Promise<QCityStatus>) => void;
    stopContinuousAutoFix?: () => void;
    startAutoFix?: (status: QCityStatus) => Promise<any>;
  };

  export const autoFixService: AutoFixService;
  export default autoFixService;
}

declare module "../../scripts/services/auto_fix_service" {
  export type QCityStatus = {
    errors: unknown[];
    [k: string]: unknown;
  };

  export type AutoFixService = {
    startContinuousAutoFix?: (getStatus: () => Promise<QCityStatus>) => void;
    stopContinuousAutoFix?: () => void;
    startAutoFix?: (status: QCityStatus) => Promise<any>;
  };

  export const autoFixService: AutoFixService;
  export default autoFixService;
}
