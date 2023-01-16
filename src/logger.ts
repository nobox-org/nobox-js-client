const showLogs = false;
const showCompulsoryLogs = true;

export const Logger = {
  ...console,
  log: (...args: any[]) => {
    showLogs && console.log(...args);
  },
  sLog: (...args: any[]) => {
    const [first, ...rest] = args;
    showLogs && console.log(JSON.stringify(first), rest);
  },
};
export const cLogger = {
  ...console,
  log: (...args: any[]) => {
    showCompulsoryLogs && console.log(...args);
  },
  sLog: (...args: any[]) => {
    const [first, ...rest] = args;
    showCompulsoryLogs && console.log(JSON.stringify(first), rest);
  },
};
