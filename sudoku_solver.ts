import { exists } from "fs";
import { checkServerIdentity } from "tls";
import { Writable } from "stream";


// Create an empty 2D array
function Create2DArray(rows) {
	var arr = [];

	for (var i = 0; i < rows; i++) {
	   arr[i] = [];
	}
	return arr;
}

// Check if the given number is valid for sudoku
function CheckNumValid(row, column, sudokuArr, check_num) {
	for (var c = 0; c < 9; c++) {
		if (sudokuArr[row][c] == check_num && c != column)
			return 0;
	}
	for (var r = 0; r < 9; r++) {
		if (sudokuArr[r][column] == check_num && r != row)
			return 0;
	}
	for (var sv = 0; sv < 3; sv++) {
		for (var sh = 0; sh < 3; sh++) {
			if (sudokuArr[sv + (Math.floor(row / 3) * 3)][sh + (Math.floor(column / 3) * 3)] == check_num
				&& row != sv + (Math.floor(row / 3) * 3) && column != sh + (Math.floor(column / 3) * 3)) {
					return 0;
			}
		}
	}
	return 1;
}

//God damn immutable strings. This function allows me to replace just one character.
function SetCharAt(str, index, chr) {
	if (index > str.length - 1)
		return str;
    return (str.substr(0, index) + chr + str.substr(index + 1));
}

// Make sure the sudoku file contains numbers (ASCII) only
// and is not an invalid sudoku to begin with
function ValidateSudoku(sudokuArr) {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			if (sudokuArr[i][j] > '9' || sudokuArr[i][j] < '0')
				return 0;
		}
	}

	for (var cr = 0; cr < 9; cr++) {
		for (var cc = 0; cc < 9; cc++) {
			if (sudokuArr[cr][cc] != '0' && CheckNumValid(cr, cc, sudokuArr, sudokuArr[cr][cc]) == 0)
				return 0;
		}
	}
	return 1;
}

// Find the next empty cell (with '0' in it) and return it's index
function FindNextEmpty(sudokuArr) {
	for (var i = 0; i < 81; i++) {
		if (sudokuArr[Math.floor(i / 9)][i % 9] == '0') {
			return (i);
		}
	}
	console.log("No more empty cells!");
	return -1;
}

// Solving algo. Simple backtracking implementation.
function SolveSudoku(sudokuArr) {
	var ind = FindNextEmpty(sudokuArr);
	if (ind == -1) {
		return 1;
	} else {
		var row = Math.floor(ind / 9);
		var col = ind % 9;
	}
	for (var i = 1; i < 10; i++) {
		if (CheckNumValid(row, col, sudokuArr, i.toString())) {
			sudokuArr[row] = SetCharAt(sudokuArr[row], col, i.toString());
			if (SolveSudoku(sudokuArr) == 1) {
				return 1;
			}
			sudokuArr[row] = SetCharAt(sudokuArr[row], col, '0');
		}
	}
	return 0;
}

function Main() {
	var fs = require("fs");

	try {
		var sudoku = fs.readFileSync(process.argv[2], "utf8");
		console.log(sudoku);
	} catch(e) {
		console.log("Could not open the file specified.", e.stack);
		return 0;
	}
	
	// Create our sudoku
	var sudokuArray = Create2DArray(9);
	
	for (var i = 0; i < 9; i++) {
		sudokuArray[i] = sudoku.slice(i * 9, i * 9 + 9);
	}
	
	// Sudoku is stored into an array of arrays. Now validate it. Exit if invalid.
	if (ValidateSudoku(sudokuArray) == 0) {
		console.log("File error. Make sure your file contains 81 numbers in one line, forming a valid sudoku.");
		return 0;
	} else {
		console.log("Valid sudoku. Let's solve...");
	}
	
	if (SolveSudoku(sudokuArray) == 0) {
		console.log("Make sure you have given a solvable sudoku puzzle and try again!");
		return 0;
	}
	console.log("---------")
	console.log("Solved!");
	for (var p = 0; p < 9; p++) {
		console.log(sudokuArray[p]);
	}
	console.log("---------")
}

Main();
