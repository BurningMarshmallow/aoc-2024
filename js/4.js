import { V, Array2d } from "./modules/index.js"
import { t } from "./modules/parser.js"
import { range } from "./modules/itertools.js"

export const useExample = false

export const exampleInput = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`


export const parseInput = t.arr(t.arr(t.str(), "")).parse

export function part1(input) {
	return Array2d.traverse(input)
		.map((v) => V.DIRS_8.filter((dir) => isXmas(input, v.pos, dir)).length)
		.sum()
}

function isXmas(input, pos, dir) {
	for (const i of range(0, "XMAS".length)) {
		let chr = "XMAS"[i]
		if (Array2d.get(input, V.add(pos, V.scale(dir, i))) != chr) {
			return false
		}
	}

	return true
}

export function part2(input) {
	return Array2d.traverse(input)
		.map((v) => V.DIRS_4D.filter((dir) => isMas(input, v.pos, dir)).length)
		.count((x) => x == 2)
}

function isMas(input, pos, dir) {
	for (const i of range(0, "MAS".length)) {
		let chr = "MAS"[i]
		if (Array2d.get(input, V.add(pos, V.scale(dir, i - 1))) != chr) {
			return false
		}
	}

	return true
}
