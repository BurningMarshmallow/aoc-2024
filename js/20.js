import { Array2d, Graph, V } from "./modules/index.js"
import {
	t
} from "./modules/parser.js"
import { add } from "./modules/lib.js"
import { vec } from "./modules/vec.js"

export const useExample = false

export const exampleInput = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`

export const parseInput = t.arr(t.arr(t.str(), "")).parse

const hash = (p) => `${p.pos.join()}`

export function part1(input) {
	return solve(input, 2)
}

export function part2(input) {
	return solve(input, 20)
}

function solve(input, cheatSize) {
	let start = Array2d.traverse(input).filter((x) => x.value == "S").first().pos

	const paths = Graph.bfs(
		(p) => V.DIRS_4.filter((dir) => Array2d.get(input, V.add(p.pos, dir)) != "#")
			.map((dir) => ({
				pos: V.add(p.pos, dir),
				distance: p.distance + 1,
			})),
		[
			{ pos: start, distance: 0 }
		],
		hash
	)

	const visited = new Map()
	for (const path of paths) {
		visited.set(hash(path.value), path.distance)
	}

	return Array2d.traverse(input).filter((x) => x.value != "#").map((x) => getNumberOfBestCheats(input, x.pos, visited, cheatSize)).reduce(add)
}

function getNumberOfBestCheats(input, pos, visited, cheatSize) {
	let bestCheats = 0

	for (let posX = pos[0] - cheatSize; posX <= pos[0] + cheatSize; posX++) {
		let rx = Math.abs(pos[0] - posX)
		for (let posY = pos[1] - (cheatSize - rx); posY <= pos[1] + (cheatSize - rx); posY++) {
			let newPos = vec(posX, posY)
			const endsOnNormalTrack = Array2d.get(input, newPos) != "#"
			const savedTime = visited.get(newPos.join()) - visited.get(pos.join())
			const cheatTime = V.mLen(newPos, pos)
			if (endsOnNormalTrack && savedTime - cheatTime >= 100) {
				bestCheats++
			}
		}
	}

	return bestCheats
}
