import { Array2d, V } from "./modules/index.js"
import { t } from "./modules/parser.js"

export const useExample = false

export const exampleInput = `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`

const CHR_TO_DIR = {
	"^": [0, -1],
	"v": [0, 1],
	"<": [-1, 0],
	">": [1, 0],
}

export const parseInput = t.arr(t.str()).parse

export function part1(input) {
	return solve(input[0], input[1], false)
}

export function part2(input) {
	let increasedInput = input[0]
		.replaceAll("O", "[]")
		.replaceAll(".", "..")
		.replaceAll("#", "##")
		.replaceAll("@", "@.")

	return solve(increasedInput, input[1], true)
}

function solve(gridStr, movesStr, isHard) {
	let grid = t.arr(t.arr(t.str(), ""), "\n").parse(gridStr)
	let moves = movesStr.replaceAll("\n", "")

	let robotPos = Array2d.traverse(grid).filter((x) => x.value == "@").first().pos

	for (let movement of moves) {
		let dir = CHR_TO_DIR[movement]

		if (!isHard || movement == "<" || movement == ">") {
			if (canMoveSimple(robotPos, grid, dir)) {
				Array2d.set(grid, robotPos, ".")
				robotPos = V.add(robotPos, dir)
				moveSimple(robotPos, grid, "@", dir)
			}
		} else {
			if (canMove(robotPos, grid, dir)) {
				Array2d.set(grid, robotPos, ".")
				robotPos = V.add(robotPos, dir)
				move(robotPos, grid, dir, "@")
			}
		}
	}

	let boxChr = isHard ? "[" : "O"
	return Array2d.traverse(grid).filter((x) => x.value == boxChr).map((x => x.pos[1] * 100 + x.pos[0])).sum()
}

function canMoveSimple(pos, grid, dir) {
	while (Array2d.get(grid, pos) != "#") {
		if (Array2d.get(grid, pos) == ".") {
			return true
		}
		pos = V.add(pos, dir)
	}

	return false
}

function moveSimple(pos, grid, prev, dir) {
	while (true) {
		if (Array2d.get(grid, pos) == ".") {
			Array2d.set(grid, pos, prev)
			break
		} else {
			let curr = Array2d.get(grid, pos)
			Array2d.set(grid, pos, prev)
			prev = curr
			pos = V.add(pos, dir)
		}
	}
}

function canMove(pos, grid, dir) {
	let chr = Array2d.get(grid, pos)
	switch (chr) {
		case ".":
			return true
		case "#":
			return false
		case "@":
			return canMove(V.add(pos, dir), grid, dir)
		case "O":
			return canMove(V.add(pos, dir), grid, dir)
		case "[":
			return canMove(V.add(pos, dir), grid, dir) && canMove(V.add(V.add(pos, V.DIR_TO_VEC.R), dir), grid, dir)
		case "]":
			return canMove(V.add(pos, dir), grid, dir) && canMove(V.add(V.add(pos, V.DIR_TO_VEC.L), dir), grid, dir)
		default:
			return undefined
	}
}

function move(pos, grid, dir, prev) {
	let chr = Array2d.get(grid, pos)
	switch (chr) {
		case "#":
			return
		case ".":
			Array2d.set(grid, pos, prev)
			return true
		case "@":
			Array2d.set(grid, pos, ".")
			move(V.add(pos, dir), grid, dir, prev)
			return
		case "O":
			Array2d.set(grid, pos, prev)
			move(V.add(pos, dir), grid, dir, prev)
			return
		case "[":
			Array2d.set(grid, pos, prev)
			Array2d.set(grid, V.add(pos, V.DIR_TO_VEC.R), ".")
			move(V.add(pos, dir), grid, dir, "[")
			move(V.add(V.add(pos, V.DIR_TO_VEC.R), dir), grid, dir, "]")
			return
		case "]":
			Array2d.set(grid, pos, prev)
			Array2d.set(grid, V.add(pos, V.DIR_TO_VEC.L), ".")
			move(V.add(pos, dir), grid, dir, "]")
			move(V.add(V.add(pos, V.DIR_TO_VEC.L), dir), grid, dir, "[")
			return
		default:
			return undefined
	}
}
