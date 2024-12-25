import { transpose } from "./modules/array2d.js"
import {
	t
} from "./modules/parser.js"

export const useExample = true

export const exampleInput = `#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`

export const parseInput = t.arr(t.arr(t.str())).parse

export function part1(input) {
	let N = transpose(input[0])[0].length - 1

	let keys = []
	let locks = []
	for (const block of input) {
		if (block[0].includes("#")) {
			locks.push(getHeights(block))
		} else {
			keys.push(getHeights(block))
		}
	}

	let fittingPairs = 0
	for (const key of keys) {
		for (const lock of locks) {
			if (fits(key, lock, N)) {
				fittingPairs++
			}
		}
	}

	return fittingPairs
}

function getHeights(block) {
	let columns = transpose(block)

	let heights = []
	for (let column of columns) {
		heights.push(column.filter((x) => x == "#").length - 1)
	}
	return heights.join()
}

function fits(key, lock, N) {
	let xs = key.split(",").map((x) => Number.parseInt(x))
	let ys = lock.split(",").map((y) => Number.parseInt(y))

	let sums = xs.map((x, i) => x + ys[i])
	return sums.every((s) => s < N)
}

export function part2(input) {
	return "Merry Christmas!" // No part2 for Day 25
}

