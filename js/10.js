import { t } from "./modules/parser.js"
import { Array2d as A, Graph, V } from "./modules/index.js"

export const useExample = false

export const exampleInput = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`

export const parseInput = t.arr(t.arr(t.int(), "")).parse

export function part1(input) {
	return solve(input, true)
}

export function part2(input) {
	return solve(input, false)
}

function solve(input, nondistinctPaths) {
	let starts = A.traverse(input).filter((x) => x.value == 0).map((x) => x.pos)
	const getNexts = (p) => V.DIRS_4.values()
		.map((dir) => [V.add(p, dir), p])
		.filter(([p, oldP]) => A.contains(input, p) && A.get(input, p) - A.get(input, oldP) == 1)
		.map(([p, _]) => p)

	let cnt = 0
	for (let start of starts) {
		for (let path of Graph.bfs(getNexts, [start], nondistinctPaths ? (p) => p.join() : undefined)) {
			if (A.get(input, path.value) == 9) {
				cnt++
			}
		}
	}

	return cnt
}
