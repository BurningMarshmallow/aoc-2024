import {
	t
} from "./modules/parser.js"
import {
	Array2d as A,
	Graph,
	V
} from "./modules/index.js"
import {
	inRange,
	vec
} from "./modules/vec.js"

export const useExample = false

export const exampleInput = `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`

export const parseInput = t.arr(t.vec()).parse

const hash = (p) => p.join()
const N = useExample ? 6 : 70

export function part1(input) {
	let grid = initGrid()
	let bytesToFall = input.slice(0, 1024)
	for (const byteToFall of bytesToFall) {
		A.set(grid, byteToFall, 'X')
	}
	return go(grid)
}

export function part2(input) {
	let grid = initGrid()
	for (let index = 0; index < input.length; index++) {
		A.set(grid, input[index], 'X')
		if (go(grid) == -1) {
			return input[index];
		}
	}
}

function initGrid() {
	let emptyLine = []
	for (let x = 0; x < N + 1; x++) {
		emptyLine.push('.')
	}
	let grid = []
	for (let y = 0; y < N + 1; y++) {
		grid.push(emptyLine.slice())
	}
	return grid
}

function go(grid) {
	const getNexts = (p) => V.DIRS_4.values()
		.map((dir) => V.add(p, dir))
		.filter((p) => inRange(p, vec(0, 0), vec(N, N)) && A.get(grid, p) != "X")

	for (let path of Graph.bfs(getNexts, [vec(0, 0)], hash)) {
		if (V.eq(path.value, vec(N, N))) {
			return path.distance
		}
	}

	return -1
}