import { t } from "./modules/parser.js"

export const useExample = false

export const exampleInput = ``

export const parseInput = t.str().parse

export function part1(input) {
	let regex = /mul\((\d+)\,(\d+)\)/g

	return input
		.matchAll(regex)
		.map(([_, a, b]) => a * b)
		.sum()
}

export function part2(input) {
	let doMultiply = true
	let ans = 0
	let regex = /(mul)\((\d+)\,(\d+)\)|(don't)\(\)|(do)\(\)/g

	for (let [, mulCmd, a, b, off, on] of input.matchAll(regex))
		if (mulCmd && doMultiply) {
			ans += a * b
		}
		else if (off) {
			doMultiply = false
		}
		else if (on) {
			doMultiply = true
		}
	
	return ans
}