// @ts-check

import { transpose } from "./modules/array2d.js"
import { compareAsc } from "./modules/lib.js"
import { t } from "./modules/parser.js"

export const useExample = false

export const exampleInput = `\
3   4
4   3
2   5
1   3
3   9
3   3
`

/** @typedef {ReturnType<typeof parseInput>} InputType */

export const parseInput = t.arr(t.arr(t.int())).map(transpose).parse

/**
 * @param {InputType} input
 */
export function part1(input) {
	const [first, second] = input.map((arr) => arr.sort(compareAsc))

	let ans = 0;
	for (var i = 0; i < first.length; i++)
	{
			ans += Math.abs(second[i] - first[i]);
	}

	return ans.toString();
}

/**
 * @param {InputType} input
 */
export function part2(input) {
	const [first, second] = input
	let ans = 0;

	const countsInSecond = {};
	for (const num of second) {
			// @ts-ignore
			countsInSecond[num] = countsInSecond[num] ? countsInSecond[num] + 1 : 1;
	}

	for (var value of first)
	{
			// @ts-ignore
			ans += value * (countsInSecond[value] ?? 0);
	}

	return ans.toString();
}