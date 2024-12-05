import { t } from "./modules/parser.js"

export const useExample = false

export const exampleInput = `\
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
`

export const parseInput = t.arr(t.arr(t.int())).parse

export function part1(input) {
	return input.values().count(isSafe)
}

export function part2(input) {
	let numOfSafe = 0
	for (const level of input) {
		if (isSafe(level)) {
			numOfSafe++
			continue
		}

		for (let i = 0; i < level.length; i++) {
			if (isSafe(level.slice().toSpliced(i, 1))) {
				numOfSafe++
				break
			}
		}
	}

	return numOfSafe
}

function isSafe(arr) {
	let firstDiffSign = Math.sign(arr[1] - arr[0])
	let safe = true

	for (let i = 0; i < arr.length - 1; i++) {
		let diff = arr[i + 1] - arr[i]
		let absDiff = Math.abs(diff)
		if (absDiff < 1 || absDiff > 3) {
			safe = false
		}

		if (Math.sign(diff) != firstDiffSign) {
			safe = false
		}
	}

	return safe
}
