import {
	t
} from "./modules/parser.js"

export const useExample = true

export const exampleInput = `125 17`

export const parseInput = t.arr(t.int()).parse

export function part1(input) {
	return solve(input, 25)
}

export function part2(input) {
	return solve(input, 75)
}

function solve(input, rounds) {
	return input.values().map((x) => getStonesCount(x, rounds)).sum()
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

const getStonesCount = memoize((stone, rounds) => {
	if (rounds == 0) {
		return 1
	}

	if (stone == 0) {
		return getStonesCount(1, rounds - 1)
	} else {
		if (stone.toString().length % 2 == 0) {
			let n = stone.toString().length
			let a = Number.parseInt(stone.toString().slice(0, Math.floor(n / 2)))
			let b = Number.parseInt(stone.toString().slice(Math.floor(n / 2)))

			return getStonesCount(a, rounds - 1) + getStonesCount(b, rounds - 1)
		} else {
			return getStonesCount(stone * 2024, rounds - 1)
		}
	}
})
