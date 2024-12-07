import { add, mul } from "./modules/lib.js"
import { t } from "./modules/parser.js"

export const useExample = false

export const exampleInput = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`


export const parseInput = t.arr(t.tpl`${"a|int"}: ${"b|int[]"}`).parse

export function part1(input) {
	return solve(input, [add, mul])
}

export function part2(input) {
	return solve(input, [add, mul, concatNumbers])
}

function solve(input, transforms) {
	return input
		.values()
		.filter(({ a, b }) => canBeTrue(a, b.slice(1), b[0], transforms))
		.map(({ a, _ }) => a)
		.sum()
}

function canBeTrue(a, b, curr, transforms) {
	if (curr > a) {
		return false
	}

	if (b.length == 0) {
		return curr == a
	}

	return transforms.some((f) => canBeTrue(a, b.slice(1), f(curr, b[0]), transforms))
}

function concatNumbers(a, b) {
	return Number.parseInt(a.toString() + b.toString())
}