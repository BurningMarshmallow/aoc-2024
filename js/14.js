import { mul } from "./modules/lib.js"
import { t } from "./modules/parser.js"

export const useExample = false

export const exampleInput = `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`

export const parseInput = t.arr(t.tpl`p=${"px|int"},${"py|int"} v=${"vx|int"},${"vy|int"}`).parse

export function part1(input) {
	let robots = input
	let [width, height] = calculateWidthAndHeight(robots)

	for (let steps = 0; steps < 100; steps++) {
		moveRobots(robots, width, height)
	}

	let robotQuadrants = countRobotQuadrants(width, height, robots)
	return robotQuadrants.values().reduce(mul)
}

export function part2(input) {
	let robots = input
	let [width, height] = calculateWidthAndHeight(robots)

	let noRobots = []
	for (let x = 0; x < width; x++) {
		noRobots.push(false)
	}
	let pic = []
	for (let y = 0; y < height; y++) {
		pic.push(noRobots.slice())
	}

	for (let steps = 0; steps < 10000; steps++) {
		for (let y = 0; y < height; y++) {
			pic[y] = noRobots.slice()
		}

		for (const robot of robots) {
			pic[robot.py][robot.px] = true
		}

		let foundTree = false
		for (const line of pic) {
			let robotSequence = 0
			for(const isRobot of line) {
				if (isRobot) {
					robotSequence++
					if (robotSequence > 9) {
						foundTree = true
						break
					}
				} else {
					robotSequence = 0
				}
			}
		}
		if (foundTree) {
			console.log(pic.map((x) => x.map(t => t == 1 ? "#" : ".")).join('\n'))
			return steps
		}

		moveRobots(robots, width, height)
	}
}

function calculateWidthAndHeight(robots) {
	return [Math.max(...robots.map((r) => r.px)) + 1, Math.max(...robots.map((r) => r.py)) + 1]
}

function moveRobots(robots, width, height) {
	for (const robot of robots) {
		robot.px += robot.vx
		if (robot.px > width - 1) {
			robot.px %= width
		}
		while (robot.px < 0) {
			robot.px += width
		}

		robot.py += robot.vy
		if (robot.py > height - 1) {
			robot.py %= height
		}
		while (robot.py < 0) {
			robot.py += height
		}
	}
}

function countRobotQuadrants(width, height, robots) {
	let robotQuadrants = [0, 0, 0, 0]
	let [middleX, middleY] = [(width - 1) / 2, (height - 1) / 2]

	for (const robot of robots) {
		let quadrant = 0

		if (robot.px == middleX || robot.py == middleY) {
			continue
		}

		if (robot.px < middleX) {
			if (robot.py < middleY) {
				quadrant = 0
			} else {
				quadrant = 1
			}

		} else {
			if (robot.py < middleY) {
				quadrant = 2
			} else {
				quadrant = 3
			}
		}
		robotQuadrants[quadrant]++
	}

	return robotQuadrants
}
