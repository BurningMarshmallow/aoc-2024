import { t } from "./modules/parser.js"
import { range } from "./modules/itertools.js"

export const useExample = false

export const exampleInput = `2333133121414131402`

export const parseInput = t.arr(t.int(), "").parse

export function part1(input) {
	let files = createFiles(input)

	while (hasFreeSpace(files)) {
		let whereTo = files.findIndex((x) => x.freeSpace > 0)
		let whereFrom = files.length - 1

		let fileToMove = files[whereFrom]
		let freeSpaceWhereToMove = files[whereTo].freeSpace
		
		files[whereTo].freeSpace = 0

		if (freeSpaceWhereToMove < fileToMove.numOfBlocks) {
			files[whereFrom].numOfBlocks -= freeSpaceWhereToMove

			let partFile = { numOfBlocks: freeSpaceWhereToMove, freeSpace: 0, fileId: fileToMove.fileId }
			files.splice(whereTo + 1, 0, partFile)
		} else {
			let partFile = { numOfBlocks: fileToMove.numOfBlocks, freeSpace: freeSpaceWhereToMove - fileToMove.numOfBlocks, fileId: fileToMove.fileId }

			files.splice(whereTo + 1, 0, partFile)
			files.pop()
		}
	}

	return getChecksum(files)
}

export function part2(input) {
	let files = createFiles(input)

	for (let originalFileId = files.length - 1; originalFileId >= 0; originalFileId--) {
		if (!canMove(files, originalFileId)) {
			continue
		}
		let { whereTo, whereFrom } = canMove(files, originalFileId)
		if (whereFrom == whereTo + 1) {
			files[whereFrom].freeSpace += files[whereTo].freeSpace
			files[whereTo].freeSpace = 0
			continue
		}

		let fileToMove = files[whereFrom]
		let totalFileToMoveSpace = files[whereFrom].freeSpace + files[whereFrom].numOfBlocks

		files.splice(whereFrom, 1)
		files.splice(whereTo + 1, 0, fileToMove)
		files[whereTo + 1].freeSpace = files[whereTo].freeSpace - files[whereTo + 1].numOfBlocks
		files[whereTo].freeSpace = 0

		if (whereFrom != files.length - 1) {
			files[whereFrom].freeSpace += totalFileToMoveSpace
		}

		if (whereFrom == files.length - 1) {
			files[whereFrom].freeSpace = 0
		}
	}

	return getChecksum(files)
}


function createFiles(input) {
	let files = []
	for (const i of range(0, input.length, 2)) {
		files.push({ numOfBlocks: input[i], freeSpace: i == input.length - 1 ? 0 : input[i + 1], fileId: Math.floor(i / 2) })
	}
	return files
}

function hasFreeSpace(files) {
	return files
		.slice(0, files.length - 1)  // except last file
		.some((x) => x.freeSpace > 0)
}

function getChecksum(files) {
	let cs = 0
	let pos = 0
	for (const file of files) {
		for (const _ of range(0, file.numOfBlocks)) {
			cs += pos * file.fileId
			pos++
		}
		pos += file.freeSpace
	}

	return cs
}

function canMove(files, originalFileId) {
	let whereFrom = files.findIndex((x) => x.fileId == originalFileId)
	for (let whereTo = 0; whereTo < whereFrom; whereTo++) {
		if (files[whereTo].freeSpace >= files[whereFrom].numOfBlocks) {
			return { whereTo, whereFrom }
		}
	}

	return false
}