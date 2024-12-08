import { V, Array2d } from "./modules/index.js"
import { t } from "./modules/parser.js"

export const useExample = true

export const exampleInput = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`


export const parseInput = t.arr(t.arr(t.str(), "")).parse

export function part1(input) {
	return solve(input, antinodesPart1)

}

export function part2(input) {
	return solve(input, antinodesPart2)
}


function solve(input, antinodesGenerator) {
	const posByChr = new Map()
	const posSet = new Set()
	for (const v of Array2d.traverse(input)) {
		if (v.value != ".") {
			if (posByChr.has(v.value)) {
				posByChr.get(v.value).push(v.pos)
			} else {
				posByChr.set(v.value, [v.pos])
			}
			posSet.add(v.pos)
		}
	}

	for (const positions of posByChr.values()) {
		for (let i = 0; i < positions.length; i++) {
			for (let j = i + 1; j < positions.length; j++) {
				let a = positions[i]
				let b = positions[j]

				for (const v of antinodesGenerator(input, a, b)) {
					Array2d.set(input, v, "#")
				}
			}
		}
	}
	
	return Array2d.traverse(input).count((x) => x.value == "#")
}


function* antinodesPart1(input, a, b) {
	let diff = V.sub(b, a)

	let v1 = V.add(b, diff)
	if (Array2d.contains(input, v1)) {
		yield v1
	}

	let v2 = V.sub(a, diff)
	if (Array2d.contains(input, v2)) {
		yield v2
	}
}


function* antinodesPart2(input, a, b) {
	let diff = V.sub(b, a)

	let v1 = b
	while (Array2d.contains(input, v1)) {
		yield v1
		v1 = V.add(v1, diff)
	}

	let v2 = a
	while (Array2d.contains(input, v2)) {
		yield v2
		v2 = V.sub(v2, diff)
	}
}
