import { V, Array2d } from "./modules/index.js"
import { t } from "./modules/parser.js"

export const useExample = false

export const exampleInput = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`

export const parseInput = t.arr(t.arr(t.str(), "")).parse

export const bigNum = 10000

export function part1(input) {
	return simulate(input).pathLength
}

export function part2(input) {
	let ans = 0

	for (const v of Array2d.traverse(input)) {
		if (v.value != "^" && v.value != "#") {
			let newInput = Array2d.clone(input)
			Array2d.set(newInput, v.pos, "#")
			if (simulate(newInput).hasLoop) {
				ans++
			}
		}
	}

	return ans
}

function simulate(input) {
	let start = undefined
	let dirs = [V.DIR_TO_VEC.U, V.DIR_TO_VEC.R, V.DIR_TO_VEC.D, V.DIR_TO_VEC.L]
	let dirIdx = 0
	let dir = dirs[dirIdx]

	for (const v of Array2d.traverse(input)) {
		if (v.value == "^") {
			start = v.pos
		}
	}

	let i = 0
	let curr = start
	while (Array2d.contains(input, curr) && i != bigNum) {
		Array2d.set(input, curr, "X")

		if (Array2d.get(input, V.add(curr, dir)) === "#") {
			dirIdx = (dirIdx + 1) % 4
			dir = dirs[dirIdx]
		} else {
			curr = V.add(curr, dir)
		}
		i++
	}

	if (i == bigNum) {
		return { hasLoop: true }
	}
	return { pathLength: Array2d.traverse(input).count((v) => v.value == "X") }
}