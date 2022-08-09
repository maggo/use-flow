// @TODO: Refactor to better argument type system */
export type Argument = [any, any];
export type ArgumentFunction = (arg: Function, t: any) => Argument[];
