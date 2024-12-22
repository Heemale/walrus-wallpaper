import {
  extractErrorCodeAndModule,
  extractErrorCodeAndModuleByDev,
  ERROR_CODE,
} from "@local/wallpaper-sdk/utils";

export const handleTxError = (message: string) => {
  const { module, errorCode } = extractErrorCodeAndModule(message);

  if (!module || !errorCode) {
    return message;
  }

  const moduleErrors = ERROR_CODE?.[module];
  const errorMessage = moduleErrors?.[errorCode.toString()];

  return errorMessage ? `${module}_${errorMessage}` : message;
};

export const handleDevTxError = (message: string) => {
  const { module, errorCode } = extractErrorCodeAndModuleByDev(message);

  if (!module || !errorCode) {
    return message;
  }

  const moduleErrors = ERROR_CODE?.[module];
  const errorMessage = moduleErrors?.[errorCode.toString()];

  return errorMessage ? `${module}_${errorMessage}` : message;
};
