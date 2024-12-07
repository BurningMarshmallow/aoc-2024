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
	let s = 0
	for (const { a, b } of input) {
		let curr = b[0]
		if (canBeTrue(a, b.slice(1), curr)) {
			s += a
		}
	}

	return s
}


export function part2(input) {
	let s = 0
	for (const { a, b } of input) {
		let curr = b[0]
		if (canBeTrueWithConcat(a, b.slice(1), curr)) {
			s += a
		}
	}

	return s
}


function canBeTrue(a, b, curr) {
	if (curr > a) {
		return false
	}

	if (b.length == 0) {
		return curr == a
	}

	return canBeTrue(a, b.slice(1), curr + b[0]) || canBeTrue(a, b.slice(1), curr * b[0])
}

function canBeTrueWithConcat(a, b, curr) {
	if (curr > a) {
		return false
	}

	if (b.length == 0) {
		return curr == a
	}

	return canBeTrueWithConcat(a, b.slice(1), curr + b[0]) || 
	canBeTrueWithConcat(a, b.slice(1), curr * b[0]) || 
	canBeTrueWithConcat(a, b.slice(1), Number.parseInt(curr.toString() + b[0].toString()))
}
