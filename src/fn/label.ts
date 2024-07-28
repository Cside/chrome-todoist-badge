import color from "chalk";

export const label = (name: string) => color.bgHex("#2792c3").black(` ${name} `);
