/** @TODO Refactor to better argument type system */

export type ArgumentFunction = (
  arg: ArgFunc,
  t: FType
) => ReturnType<ArgFunc>[];

export type ArgFunc<
  T = any,
  F extends FType<T>[keyof FType] = FType<T>[keyof FType]
> = (value: T, xform: F) => ArgumentObject<T, F>;

export type ArgType<T = any> = (
  label: string,
  asArgument: (value: T) => any
) => { label: string; asArgument: (value: T) => any };

type ArgumentObject<Value, Form extends FType[keyof FType]> = {
  value: Value;
  xform: Form;
};

interface FType<T = any> {
  UInt: ArgType<string>;
  Int: ArgType<string>;
  UInt8: ArgType<string>;
  Int8: ArgType<string>;
  UInt16: ArgType<string>;
  Int16: ArgType<string>;
  UInt32: ArgType<string>;
  Int32: ArgType<string>;
  UInt64: ArgType<string>;
  Int64: ArgType<string>;
  UInt128: ArgType<string>;
  Int128: ArgType<string>;
  UInt256: ArgType<string>;
  Int256: ArgType<string>;
  Word8: ArgType<string>;
  Word16: ArgType<string>;
  Word32: ArgType<string>;
  Word64: ArgType<string>;
  UFix64: ArgType<string>;
  Fix64: ArgType<string>;
  String: ArgType<string>;
  Character: ArgType<string>;
  Bool: ArgType<boolean>;
  Address: ArgType<string>;
  Optional: (value: ArgType<T>) => ArgType<T>;
  Array: (value: ArgType<T>) => ArgType<T>;
  Dictionary: (value: { key: ArgType; value: ArgType }) => ArgType;
  Path: (value: {
    domain: "public" | "private" | "storage";
    identifier: string;
  }) => ArgType<string>;
}
