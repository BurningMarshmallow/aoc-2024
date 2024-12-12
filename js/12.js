import { Array2d, V } from "./modules/index.js"
import { t } from "./modules/parser.js"

export const useExample = false

export const exampleInput = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`

export const parseInput = t.arr(t.arr(t.str(), "")).parse

const valToHash = (p) => p.join(":")

export function part1(input) {
	const visited = new Set()
	const getNexts = (p) => V.DIRS_4.values()
		.map((dir) => [V.add(p, dir), p])
		.filter(([p, oldP]) => Array2d.contains(input, p) && Array2d.get(input, p) == Array2d.get(input, oldP))
		.map(([p, _]) => p)

	let total = 0
	for (const v of Array2d.traverse(input)) {
		if (visited.has(valToHash(v.pos))) {
			continue
		}

		let [area, perimeter] = [1, 4]
		const evalForToVisit = (_) => perimeter--
		const evalForVisiting = (_) => {
			area += 1
			perimeter += 4
		}

		bfsWithEval(getNexts, [v.pos], visited, valToHash, evalForToVisit, evalForVisiting)
		total += area * perimeter
	}

	return total
}

export function part2(input) {
	const visited = new Set()
	const getNexts = (p) => V.DIRS_4.values()
		.map((dir) => [V.add(p, dir), p])
		.filter(([p, oldP]) => Array2d.contains(input, p) && Array2d.get(input, p) == Array2d.get(input, oldP))
		.map(([p, _]) => p)

	let total = 0
	for (const v of Array2d.traverse(input)) {
		if (visited.has(valToHash(v.pos))) {
			continue
		}

		let [area, corners] = [1, countCorners(input, v.pos)]
		const evalForToVisit = (_) => {}
		const evalForVisiting = (v) => {
			area += 1
			corners += countCorners(input, v)
    	}

		bfsWithEval(getNexts, [v.pos], visited, valToHash, evalForToVisit, evalForVisiting)
		total += area * corners
	}

	return total
}

export function bfsWithEval(getNext, starts, visited, valToHash, evalForToVisit, evalForVisiting) {
	const queue = []

	for (const start of starts) {
		queue.push(start)
		visited.add(valToHash(start))
	}

	while (queue.length) {
		const current = queue.shift()

		for (const next of getNext(current)) {
			const hash = valToHash(next)
			evalForToVisit(next)
			if (!visited.has(hash)) {
				evalForVisiting(next)
				visited.add(hash)
				queue.push(next)
			}
		}
	}
}

const countCorners = (input, pos) =>
	[0, 1, 2, 3]
		.map(d => [V.DIRS_4[d], V.DIRS_4[(d + 1) % 4]])
		.map(([dir1, dir2]) => [
			Array2d.get(input, pos),
			Array2d.get(input, V.add(pos, dir1)),
			Array2d.get(input, V.add(pos, dir2)),
			Array2d.get(input, V.add(V.add(pos, dir1), dir2))
		])
		.filter(([plant, left, right, mid]) => (left !== plant && right !== plant) || (left === plant && right === plant && mid !== plant))
		.length;
