import { Array2d, Graph, V } from "./modules/index.js"
import {
	t
} from "./modules/parser.js"

export const useExample = false

export const exampleInput = `029A
980A
179A
456A
379A`

const numericMap = t.arr(t.arr(t.str(), "")).parse(`789
456
123
#0A`)

const directionalMap = t.arr(t.arr(t.str(), "")).parse(`#^A
<v>`)

export const parseInput = t.arr(t.arr(t.str(), "")).parse

const bigIntMin = (...args) => args.reduce((m, e) => e < m ? e : m);
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

export function part1(input) {
	return solve(input, 2)
}

export function part2(input) {
	return solve(input, 25)
}

function solve(input, maxDepth) {
	let numericPaths = createPaths("0123456789A", numericMap)
	let dirPaths = createPaths("<>^vA", directionalMap)

	let total = 0n
	for (let str of input) {
		str = "A" + str.join("")
		let numericPart = Number.parseInt(str.replace(/\D+/g, ''))

		for (let i = 0; i < str.length - 1; i++) {
			let key = str.substring(i, i + 2)
			let subpathMin = 100000000000000000000000000n
			for (const numericSubPath of numericPaths.get(key)) {
				subpathMin = bigIntMin(subpathMin, findShortestPathLength(numericSubPath, dirPaths, 1, maxDepth))
			}

			total += subpathMin * BigInt(numericPart)
		}
	}

	return total
}

function createPaths(alph, map) {
	let paths = new Map()
	for (const { a, b } of getPairs(alph)) {
		paths.set(`${a}${b}`, Array.from(pathsBetween(a, b, map)))
	}
	return paths
}

function* getPairs(values) {
	for (let i = 0; i < values.length; i++) {
		for (let j = 0; j < values.length; j++) {
			yield { a: values[i], b: values[j] }
		}
	}
}

function* pathsBetween(a, b, keypad) {
	let start = Array2d.traverse(keypad).filter((x) => x.value == a).first().pos
	let target = Array2d.traverse(keypad).filter((x) => x.value == b).first().pos

	const paths = Graph.bfs(
		(p) => V.DIRS_4.filter((dir) =>
			Array2d.contains(keypad, V.add(p.pos, dir)) &&
			Array2d.get(keypad, V.add(p.pos, dir)) != "#" &&
			V.mLen(V.add(p.pos, dir), target) < V.mLen(p.pos, target)
		)
			.map((dir) => ({
				pos: V.add(p.pos, dir),
				path: p.path.slice().concat([dir])
			})),
		[
			{ pos: start, path: [] }
		]
	)

	for (const path of paths) {
		if (V.eq(path.value.pos, target)) {
			yield path.value.path.map((d) => (getDir(d))).join("") + "A"
		}
	}
}

function getDir(d) {
	switch (d) {
		case V.DIR_TO_VEC.U:
			return "^"
		case V.DIR_TO_VEC.D:
			return "v"
		case V.DIR_TO_VEC.R:
			return ">"
		case V.DIR_TO_VEC.L:
			return "<"
		default:
			break;
	}
}

const findShortestPathLength = memoize((path, dirPaths, depth, maxDepth) => {
	if (depth == 1) {
		path = "A" + path
	}

	let total = 0n
	for (let i = 0; i < path.length - 1; i++) {
		let paths = dirPaths.get(path.substring(i, i + 2))
		if (depth == maxDepth) {
			total += BigInt(paths[0].length) // all paths have same length
		} else {
			let minPathLength = 100000000000000000000000000n
			for (let dirPath of paths) {
				dirPath = "A" + dirPath
				let pathLength = 0n
				for (let j = 0; j < dirPath.length - 1; j++) {
					pathLength += findShortestPathLength(dirPath.substring(j, j + 2), dirPaths, depth + 1, maxDepth)
				}

				minPathLength = bigIntMin(minPathLength, pathLength)
			}

			total += minPathLength
		}
	}

	return total
})
