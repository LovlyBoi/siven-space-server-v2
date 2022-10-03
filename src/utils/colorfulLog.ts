const consoleColor = {
  bold: ["\x1B[1m", "\x1B[22m"] as const,
  italic: ["\x1B[3m", "\x1B[23m"] as const,
  underline: ["\x1B[4m", "\x1B[24m"] as const,
  inverse: ["\x1B[7m", "\x1B[27m"] as const,
  strikethrough: ["\x1B[9m", "\x1B[29m"] as const,
  white: ["\x1B[37m", "\x1B[39m"] as const,
  grey: ["\x1B[90m", "\x1B[39m"] as const,
  black: ["\x1B[30m", "\x1B[39m"] as const,
  blue: ["\x1B[34m", "\x1B[39m"] as const,
  cyan: ["\x1B[36m", "\x1B[39m"] as const,
  green: ["\x1B[32m", "\x1B[39m"] as const,
  magenta: ["\x1B[35m", "\x1B[39m"] as const,
  red: ["\x1B[31m", "\x1B[39m"] as const,
  yellow: ["\x1B[33m", "\x1B[39m"] as const,
  whiteBG: ["\x1B[47m", "\x1B[49m"] as const,
  greyBG: ["\x1B[49;5;8m", "\x1B[49m"] as const,
  blackBG: ["\x1B[40m", "\x1B[49m"] as const,
  blueBG: ["\x1B[44m", "\x1B[49m"] as const,
  cyanBG: ["\x1B[46m", "\x1B[49m"] as const,
  greenBG: ["\x1B[42m", "\x1B[49m"] as const,
  magentaBG: ["\x1B[45m", "\x1B[49m"] as const,
  redBG: ["\x1B[41m", "\x1B[49m"] as const,
  yellowBG: ["\x1B[43m", "\x1B[49m"] as const,
};

export function colorfulLog(color: keyof typeof consoleColor, msg: string = '') {
  process.stdout.write(
    `${consoleColor[color][0]}${msg}${consoleColor[color][1]}`
  );
}
