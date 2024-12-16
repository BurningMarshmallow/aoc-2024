import { Array2d, V } from "./modules/index.js"
import { t } from "./modules/parser.js"
import { PriorityQueue } from "./modules/priority-queue.js"

export const useExample = false

export const exampleInput = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`

export const parseInput = t.arr(t.str()).parse

const hash = (p) => `${p.pos.join()}:${p.dir.join()}`

export function part1(input) {
	return findBestCost(input).bestCost
}

export function part2(input) {
	const { visited, bestCost } = findBestCost(input)

	const targetPos = V.vec(Array2d.width(input) - 2, 1)
	let starts = V.DIRS_4.map((d) => { return { pos: targetPos, dir: d, distance: bestCost } }).filter((state) => visited.get(hash(state)) == bestCost)

	const numOfPlacesToSit = backward(
		starts,
		visited
	)

	return numOfPlacesToSit
}

function findBestCost(input) {
	const visited = dijkstra(
		(p) => V.DIRS_4.filter((dir) => dir != V.neg(p.dir) && Array2d.get(input, V.add(p.pos, dir)) != "#")
			.map((dir) => ({
				pos: V.eq(dir, p.dir) ? V.add(p.pos, dir) : p.pos,
				dir,
				distance: V.eq(dir, p.dir) ? p.distance + 1 : p.distance + 1000,
			})),

		(p) => p.distance,
		[
			{ pos: V.vec(1, Array2d.height(input) - 2), dir: V.vec(1, 0), distance: 0 }
		],
		hash
	)

	const targetPos = V.vec(Array2d.width(input) - 2, 1)
	let minCost = 1000000
	for (const cost of V.DIRS_4.map((d) => hash({ pos: targetPos, dir: d })).filter((key) => visited.has(key)).map((key) => visited.get(key))) {
		minCost = Math.min(minCost, cost)
	}

	return { bestCost: minCost, visited: visited }
}

function dijkstra(getNext, getDistance, starts, valToHash) {
	const visited = new Map()
	const queue = new PriorityQueue((a, b) => a.distance - b.distance)

	for (const start of starts) {
		queue.push({ distance: getDistance(start), value: start })
		visited.set(valToHash(start), 0)
	}

	while (queue.length) {
		const current = queue.pop()
		if (visited.has(hash(current.value)) && visited.get(hash(current.value)) < current.distance) {
			continue
		}

		for (const next of getNext(current.value, current)) {
			const hash = valToHash(next)
			if (!visited.has(hash) || next.distance < visited.get(hash)) {
				visited.set(hash, next.distance)
				queue.push({
					distance: getDistance(next),
					value: next,
					parent: current,
				})
			}
		}
	}

	return visited
}

function backward(starts, visited) {
	const queue = new PriorityQueue((a, b) => a.distance - b.distance)
	const bestStates = new Set()

	for (const start of starts) {
		queue.push({ distance: start.distance, value: start })
		bestStates.add(hash(start))
	}

	while (queue.length) {
		const current = queue.pop().value
		const currentDistance = visited.get(hash(current))

		let p = V.sub(current.pos, current.dir)
		let prevCost = currentDistance - 1
		if (prevCost >= 0) {
			let prevState = { pos: p, dir: current.dir, distance: prevCost }
			if (visited.has(hash(prevState)) && prevCost == visited.get(hash(prevState))) {
				if (!bestStates.has(hash(prevState))) {
					bestStates.add(hash(prevState))
					queue.push({
						distance: prevCost,
						value: prevState
					})
				}
			}
		}

		prevCost = currentDistance - 1000
		if (prevCost >= 0) {
			for (const pd of getTurns(current.dir)) {
				let prevState = { pos: current.pos, dir: pd, distance: prevCost }
				if (visited.has(hash(prevState))) {
					if (prevCost == visited.get(hash(prevState))) {
						if (!bestStates.has(hash(prevState))) {
							bestStates.add(hash(prevState))
							queue.push({
								distance: prevCost,
								value: prevState
							})
						}
					}
				}
			}
		}
	}

	let placesToSit = new Set()
	for (const state of bestStates) {
		placesToSit.add(state.split(":")[0])
	}
	return placesToSit.size
}

function getTurns(direction) {
	let dirIndex = V.DIRS_4.findIndex((d) => d == direction)
	let turns = [V.DIRS_4[(dirIndex - 1 + 4) % 4], V.DIRS_4[(dirIndex + 1) % 4]]
	return turns
}
