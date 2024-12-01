import { Day } from "../day";

class Day1 extends Day {

    constructor(){
        super(1);
    }

    solveForPartOne(input: string): string {
        let first = <number[]>[];
        let second = <number[]>[];

        for (var x of input.split('\n'))
        {
            first.push(Number.parseInt(x.split("   ")[0]));
            second.push(Number.parseInt(x.split("   ")[1]));
        }

        first.sort();
        second.sort()

        let ans = 0;
        for (var i = 0; i < first.length; i++)
        {
            ans += Math.abs(second[i] - first[i]);
        }

        return ans.toString();
    }

    solveForPartTwo(input: string): string {
        let first = <number[]>[];
        let second = <number[]>[];

        for (var x of input.split('\n'))
        {
            first.push(Number.parseInt(x.split("   ")[0]));
            second.push(Number.parseInt(x.split("   ")[1]));
        }

        let ans = 0;

        const countsInSecond: { [value: number]: number; } = {};
        for (const num of second) {
            countsInSecond[num] = countsInSecond[num] ? countsInSecond[num] + 1 : 1;
        }

        for (var value of first)
        {
            ans += value * (countsInSecond[value] ?? 0);
        }

        return ans.toString();
    }
}

export default new Day1;