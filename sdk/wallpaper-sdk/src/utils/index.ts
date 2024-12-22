export const getType = (input: string): string | null => {
  const regex = /<([^<>]*)>/;
  const match = input.match(regex);

  if (match) {
    return match[1];
  } else {
    return null;
  }
};

export const extractErrorCodeAndModule = (
  errorMessage: string,
): {
  module: string | null;
  errorCode: number | null;
} => {
  const moduleMatch = errorMessage.match(/Identifier\("([^"]+)"\)/);
  const module = moduleMatch ? moduleMatch[1] : null;

  const moveAbortMatch = errorMessage.match(/MoveAbort\((.*?)\) in command/);
  const errorCode = moveAbortMatch
    ? moveAbortMatch[1].match(/, (\d+)$/)?.[1] ?? null
    : null;

  return {
    module,
    errorCode: errorCode ? parseInt(errorCode, 10) : null,
  };
};

export const extractErrorCodeAndModuleByDev = (
  message: string,
): {
  module: string | null;
  errorCode: number | null;
} => {
  // 提取括号内的内容
  const moveAbortContent = message.match(/MoveAbort\((.*)\) in command/);

  if (!moveAbortContent) {
    return { module: null, errorCode: null };
  }

  const content = moveAbortContent[1];

  // 提取模块名
  const moduleMatch = content.match(/Identifier\("([^"]+)"\)/);
  const module = moduleMatch ? moduleMatch[1] : null;

  // 提取错误码
  const lastCommaIndex = content.lastIndexOf(',');
  const errorCode =
    lastCommaIndex !== -1
      ? parseInt(content.substring(lastCommaIndex + 1).trim(), 10)
      : null;

  return { module, errorCode };
};

export * from './constants';
export * from './error';
