import { int32 } from "../fable-library-ts.4.24.0/Int32.js";
import { Record } from "../fable-library-ts.4.24.0/Types.js";
import { IComparable, IEquatable } from "../fable-library-ts.4.24.0/Util.js";
import { string_type, record_type, int32_type, TypeInfo } from "../fable-library-ts.4.24.0/Reflection.js";
import { Option, some } from "../fable-library-ts.4.24.0/Option.js";
import { seq, noneOf, optWhitespace, whitespace, oneOf, string, takeWhile, test, fail, all, any, digit, lookahead, succeed, eof, letters, letter, lazy, index } from "./Parsimmon.js";
import { join } from "../fable-library-ts.4.24.0/String.js";
import { FSharpList, reduce } from "../fable-library-ts.4.24.0/List.js";

export interface ParseResult$1<t> {
    status: boolean,
    value: t
}

export interface IParserOffSet {
    column: int32,
    line: int32,
    offset: int32
}

export class TokenPosition extends Record implements IEquatable<TokenPosition>, IComparable<TokenPosition> {
    readonly offset: int32;
    readonly line: int32;
    readonly column: int32;
    constructor(offset: int32, line: int32, column: int32) {
        super();
        this.offset = (offset | 0);
        this.line = (line | 0);
        this.column = (column | 0);
    }
}

export function TokenPosition_$reflection(): TypeInfo {
    return record_type("Fable.Parsimmon.TokenPosition", [], TokenPosition, () => [["offset", int32_type], ["line", int32_type], ["column", int32_type]]);
}

export class NodeResult$1<t> extends Record implements IEquatable<NodeResult$1<t>>, IComparable<NodeResult$1<t>> {
    readonly name: string;
    readonly value: t;
    readonly start: TokenPosition;
    readonly end: TokenPosition;
    constructor(name: string, value: t, start: TokenPosition, end: TokenPosition) {
        super();
        this.name = name;
        this.value = value;
        this.start = start;
        this.end = end;
    }
}

export function NodeResult$1_$reflection(gen0: TypeInfo): TypeInfo {
    return record_type("Fable.Parsimmon.NodeResult`1", [gen0], NodeResult$1, () => [["name", string_type], ["value", gen0], ["start", TokenPosition_$reflection()], ["end", TokenPosition_$reflection()]]);
}

export interface IParser$1<t> {
    atLeast(arg0: int32): IParser$1<t[]>,
    atMost(arg0: int32): IParser$1<t[]>,
    fallback(arg0: t): IParser$1<t>,
    many(): IParser$1<t[]>,
    map<u>(arg0: ((arg0: t) => u)): IParser$1<u>,
    notFollowedBy<u>(arg0: IParser$1<u>): IParser$1<t>,
    parse(arg0: string): ParseResult$1<t>,
    sepBy<u>(arg0: IParser$1<u>): IParser$1<t[]>,
    sepBy1<u>(arg0: IParser$1<u>): IParser$1<t[]>,
    skip<u>(arg0: IParser$1<u>): IParser$1<t>,
    times(arg0: int32): IParser$1<t[]>,
    times(arg0: int32, arg1: int32): IParser$1<t[]>,
    trim<u>(arg0: IParser$1<u>): IParser$1<t>
}

export function Parsimmon_parseRaw<t>(input: string, parser: IParser$1<t>): ParseResult$1<t> {
    return parser.parse(input);
}

export function Parsimmon_parse<t>(input: string, parser: IParser$1<t>): Option<t> {
    const result: ParseResult$1<t> = parser.parse(input);
    if (result.status) {
        return some(result.value);
    }
    else {
        return undefined;
    }
}

export const Parsimmon_index: IParser$1<IParserOffSet> = index;

/**
 * Returns a new parser which tries parser, and if it fails uses otherParser. Example:
 */
export function Parsimmon_orTry<t>(otherParser: IParser$1<t>, parser: IParser$1<t>): IParser$1<t> {
    return parser.or(otherParser);
}

/**
 * Returns a new parser that tries to parse the input exactly `n` times
 */
export function Parsimmon_times<t>(n: int32, parser: IParser$1<t>): IParser$1<t[]> {
    return parser.times(n);
}

/**
 * Expects parser at least n times. Yields an array of the results.
 */
export function Parsimmon_atLeast<t>(n: int32, parser: IParser$1<t>): IParser$1<t[]> {
    return parser.atLeast(n);
}

/**
 * Expects parser at most n times. Yields an array of the results.
 */
export function Parsimmon_atMost<t>(n: int32, parser: IParser$1<t>): IParser$1<t[]> {
    return parser.atMost(n);
}

export function Parsimmon_skip<u, t>(skipped: IParser$1<u>, keep: IParser$1<t>): IParser$1<t> {
    return keep.skip<u>(skipped);
}

export function Parsimmon_many<t>(parser: IParser$1<t>): IParser$1<t[]> {
    return parser.many();
}

export const Parsimmon_ofLazy: ((arg0: (() => IParser$1<t>)) => IParser$1<t>) = lazy;

/**
 * This is the same as Parsimmon.sepBy, but matches the parser at least once.
 */
export function Parsimmon_seperateByAtLeastOne<u, t>(seperator: IParser$1<u>, parser: IParser$1<t>): IParser$1<t[]> {
    return parser.sepBy1<u>(seperator);
}

/**
 * Expects parser "after" to follow parser "before", and yields the result of "before".
 */
export function Parsimmon_chain<u, t>(after: IParser$1<u>, before: IParser$1<t>): IParser$1<u> {
    return before.then(after);
}

/**
 * Returns a new parser which tries parser "p", and on success calls the function "f" with the result of the parse, which is expected to return another parser, which will be tried next. This allows you to dynamically decide how to continue the parse, which is impossible with the other combinators.
 */
export function Parsimmon_bind<t, u>(f: ((arg0: t) => IParser$1<u>), p: IParser$1<t>): IParser$1<u> {
    return p.chain(f);
}

export const Parsimmon_letter: IParser$1<string> = letter;

/**
 * Returns a parser that tries `parser` and succeeds if `parser` is able to parse between `min` and `max` times
 */
export function Parsimmon_timesBetween<u>(min: int32, max: int32, parser: IParser$1<u>): IParser$1<u[]> {
    return parser.times(min, max);
}

export const Parsimmon_letters: IParser$1<string[]> = letters;

export const Parsimmon_endOfFile: IParser$1<string> = eof;

/**
 * Returns a parser that looks for anything but whatever "p" wants to parse, and does not consume it. Yields the same result as "before".
 */
export function Parsimmon_notFollowedBy<u, t>(p: IParser$1<u>, before: IParser$1<t>): IParser$1<t> {
    return before.notFollowedBy<u>(p);
}

export const Parsimmon_succeed: ((arg0: t) => IParser$1<t>) = succeed;

export const Parsimmon_lookahead: ((arg0: IParser$1<t>) => IParser$1<string>) = lookahead;

export const Parsimmon_digit: IParser$1<string> = digit;

export const Parsimmon_digits: IParser$1<string[]> = Parsimmon_many<string>(Parsimmon_digit);

/**
 * Returns a new parser which tries "parser" and, if it fails, yields value without consuming any input.
 */
export function Parsimmon_fallback<t>(value: t, parser: IParser$1<t>): IParser$1<t> {
    return parser.fallback(value);
}

export function Parsimmon_seperateBy<u, t>(content: IParser$1<u>, others: IParser$1<t>): IParser$1<t[]> {
    return others.sepBy<u>(content);
}

export function Parsimmon_between<t, u, v>(left: IParser$1<t>, right: IParser$1<u>, middle: IParser$1<v>): IParser$1<v> {
    return Parsimmon_skip<u, v>(right, Parsimmon_chain<v, t>(middle, left));
}

/**
 * Transforms the parsed value of the given parser.
 */
export function Parsimmon_map<t, u>(f: ((arg0: t) => u), parser: IParser$1<t>): IParser$1<u> {
    return parser.map<u>(f);
}

/**
 * Alias of Parsimmon.concat
 */
export function Parsimmon_tie(parser: IParser$1<string[]>): IParser$1<string> {
    return Parsimmon_map<string[], string>((strings: string[]): string => join("", strings), parser);
}

export const Parsimmon_any: IParser$1<string> = any;

/**
 * Accepts any number of parsers, yielding the value of the first one that succeeds, backtracking in between.
 */
export function Parsimmon_choose<t>(ps: FSharpList<IParser$1<t>>): IParser$1<t> {
    return reduce<IParser$1<t>>((acc: IParser$1<t>, parser: IParser$1<t>): IParser$1<t> => (acc.or(parser)), ps);
}

export const Parsimmon_all: IParser$1<string> = all;

export const Parsimmon_fail: ((arg0: string) => IParser$1<string>) = fail;

export const Parsimmon_satisfy: ((arg0: ((arg0: string) => boolean)) => IParser$1<string>) = test;

export const Parsimmon_takeWhile: ((arg0: ((arg0: string) => boolean)) => IParser$1<string>) = takeWhile;

export const Parsimmon_str: ((arg0: string) => IParser$1<string>) = string;

export const Parsimmon_oneOf: ((arg0: string) => IParser$1<string>) = oneOf;

export const Parsimmon_whitespace: IParser$1<string> = whitespace;

export const Parsimmon_optionalWhitespace: IParser$1<string> = optWhitespace;

/**
 * Returns a parser that succeeds one or more times
 */
export function Parsimmon_atLeastOneOrMany<t>(parser: IParser$1<t>): IParser$1<t[]> {
    return Parsimmon_atLeast<t>(1, parser);
}

export function Parsimmon_stringReturn<t>(input: string, value: t): IParser$1<t> {
    return Parsimmon_map<string, t>((_arg: string): t => value, Parsimmon_str(input));
}

export const Parsimmon_noneOf: ((arg0: string) => IParser$1<string>) = noneOf;

export const Parsimmon_seq2: ((arg0: IParser$1<t>) => ((arg0: IParser$1<u>) => IParser$1<[t, u]>)) = seq;

export function Parsimmon_trim<a, t>(trimmed: IParser$1<a>, p: IParser$1<t>): IParser$1<t> {
    return p.trim<a>(trimmed);
}

/**
 * Equivalent to `parser.map (String.concat "")`
 */
export function Parsimmon_concat(parser: IParser$1<string[]>): IParser$1<string> {
    return parser.map<string>((strings: string[]): string => join("", strings));
}

export const Parsimmon_seq3: ((arg0: IParser$1<t>) => ((arg0: IParser$1<u>) => ((arg0: IParser$1<v>) => IParser$1<[t, u, v]>))) = seq;

export const Parsimmon_seq4: ((arg0: IParser$1<t>) => ((arg0: IParser$1<u>) => ((arg0: IParser$1<v>) => ((arg0: IParser$1<w>) => IParser$1<[t, u, v, w]>)))) = seq;

export const Parsimmon_seq5: ((arg0: IParser$1<t>) => ((arg0: IParser$1<u>) => ((arg0: IParser$1<v>) => ((arg0: IParser$1<w>) => ((arg0: IParser$1<q>) => IParser$1<[t, u, v, w, q]>))))) = seq;

/**
 * Equivalent to `parser.node("description")`
 */
export function Parsimmon_node<t>(description: string, p: IParser$1<t>): IParser$1<NodeResult$1<t>> {
    return p.node(description);
}

