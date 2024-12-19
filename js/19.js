import {
	t
} from "./modules/parser.js"
import { add } from "./modules/lib.js"

export const useExample = false

export const exampleInput = `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`

export const parseInput = t.arr(t.arr(t.str())).parse

export function part1(input) {
	let [patterns, designs] = input
	return designs.map((design) => possible(design, patterns) ? 1 : 0).reduce(add)
}

export function part2(input) {
	let [patterns, designs] = input
	return designs.map((design) => numOfWays(design, patterns)).reduce(add)
}

const memoize = (fn) => {
	let cache = {};
	return (...args) => {
		let key = args.join()
		if (key in cache) {
			return cache[key];
		} else {
			let result = fn(...args);
			cache[key] = result;
			return result;
		}
	}
}

const possible = memoize((design, patterns) => {
	if (design == "") {
		return true
	}

	for (const pattern of patterns) {
		if (design.startsWith(pattern)) {
			if (possible(design.slice(pattern.length), patterns)) {
				return true
			}
		}
	}
})

const numOfWays = memoize((design, patterns) => {
	if (design == "") {
		return 1
	}

	let s = 0
	for (const pattern of patterns) {
		if (design.startsWith(pattern)) {
			s += numOfWays(design.slice(pattern.length), patterns)
		}
	}

	return s
})
