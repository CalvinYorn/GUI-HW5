/* 
Name: Calvin Yorn
Due Date: 12/17/2025
File: scrabble.js

GUI Assignment:
    This assignment is about creating a web app copy of the infamous game scrabble, by utilizing jQuery and our knowledge of
    HTML, CSS, and JavaScript.

Calvin Yorn, UMass Lowell Computer Science, calvin_yorn@student.uml.edu
Copyright (c) 2025 by Calvin Yorn. All rights reserved.
*/

const USE_FULL_BOARD = true; // use 15x15 board

// board configurations
const BOARD_CONFIG = {
    size: 15,
    squares: [
        // row 0
        ['TW', 'N',  'N',  'DL', 'N',  'N',  'N',  'TW', 'N',  'N',  'N',  'DL', 'N',  'N',  'TW'],
        // row 1
        ['N',  'DW', 'N',  'N',  'N',  'TL', 'N',  'N',  'N',  'TL', 'N',  'N',  'N',  'DW', 'N'],
        // row 2
        ['N',  'N',  'DW', 'N',  'N',  'N',  'DL', 'N',  'DL', 'N',  'N',  'N',  'DW', 'N',  'N'],
        // row 3
        ['DL', 'N',  'N',  'DW', 'N',  'N',  'N',  'DL', 'N',  'N',  'N',  'DW', 'N',  'N',  'DL'],
        // row 4
        ['N',  'N',  'N',  'N',  'DW', 'N',  'N',  'N',  'N',  'N',  'DW', 'N',  'N',  'N',  'N'],
        // row 5
        ['N',  'TL', 'N',  'N',  'N',  'TL', 'N',  'N',  'N',  'TL', 'N',  'N',  'N',  'TL', 'N'],
        // row 6
        ['N',  'N',  'DL', 'N',  'N',  'N',  'DL', 'N',  'DL', 'N',  'N',  'N',  'DL', 'N',  'N'],
        // row 7
        ['TW', 'N',  'N',  'DL', 'N',  'N',  'N',  'DW', 'N',  'N',  'N',  'DL', 'N',  'N',  'TW'],
        // row 8
        ['N',  'N',  'DL', 'N',  'N',  'N',  'DL', 'N',  'DL', 'N',  'N',  'N',  'DL', 'N',  'N'],
        // row 9
        ['N',  'TL', 'N',  'N',  'N',  'TL', 'N',  'N',  'N',  'TL', 'N',  'N',  'N',  'TL', 'N'],
        // row 10
        ['N',  'N',  'N',  'N',  'DW', 'N',  'N',  'N',  'N',  'N',  'DW', 'N',  'N',  'N',  'N'],
        // row 11
        ['DL', 'N',  'N',  'DW', 'N',  'N',  'N',  'DL', 'N',  'N',  'N',  'DW', 'N',  'N',  'DL'],
        // row 12
        ['N',  'N',  'DW', 'N',  'N',  'N',  'DL', 'N',  'DL', 'N',  'N',  'N',  'DW', 'N',  'N'],
        // row 13
        ['N',  'DW', 'N',  'N',  'N',  'TL', 'N',  'N',  'N',  'TL', 'N',  'N',  'N',  'DW', 'N'],
        // row 14
        ['TW', 'N',  'N',  'DL', 'N',  'N',  'N',  'TW', 'N',  'N',  'N',  'DL', 'N',  'N',  'TW']
    ]
};

// letter distribution and point values
const LETTER_DISTRIBUTION = {
    'A': { count: 9,  points: 1 },   'B': { count: 2,  points: 3 },   'C': { count: 2,  points: 3 },
    'D': { count: 4,  points: 2 },   'E': { count: 12, points: 1 },   'F': { count: 2,  points: 4 },
    'G': { count: 3,  points: 2 },   'H': { count: 2,  points: 4 },   'I': { count: 9,  points: 1 },
    'J': { count: 1,  points: 8 },   'K': { count: 1,  points: 5 },   'L': { count: 4,  points: 1 },
    'M': { count: 2,  points: 3 },   'N': { count: 6,  points: 1 },   'O': { count: 8,  points: 1 },
    'P': { count: 2,  points: 3 },   'Q': { count: 1,  points: 10 },  'R': { count: 6,  points: 1 },
    'S': { count: 4,  points: 1 },   'T': { count: 6,  points: 1 },   'U': { count: 4,  points: 1 },
    'V': { count: 2,  points: 4 },   'W': { count: 2,  points: 4 },   'X': { count: 1,  points: 8 },
    'Y': { count: 2,  points: 4 },   'Z': { count: 1,  points: 10 }
};

// game state
const gameState = {
    board: [],
    rack: [],
    tilesBag: [],
    score: 0,
    tilesOnBoard: {},
    tilesRefreshedThisRound: false,
    firstTilePlacedThisRound: false
};

// initialization
$(document).ready(function() {
    initializeGame();
    setupEventListeners();
});

function initializeGame() {
    // initialize board
    gameState.board = USE_FULL_BOARD ? BOARD_CONFIG.squares.map(row => [...row]) : [];
    gameState.tilesOnBoard = {};
    gameState.score = 0;
    gameState.tilesRefreshedThisRound = false;
    gameState.firstTilePlacedThisRound = false;
    
    // create tile bag
    createTileBag();
    
    // deal tiles to rack
    dealTilesToRack(7);
    
    // render board and rack
    renderBoard();
    renderRack();
    updateLetterStats();
}

function createTileBag() {
    gameState.tilesBag = [];
    
    for (const letter in LETTER_DISTRIBUTION) {
        const count = LETTER_DISTRIBUTION[letter].count;
        for (let i = 0; i < count; i++) {
            gameState.tilesBag.push(letter);
        }
    }
    
    shuffleArray(gameState.tilesBag);
}

function dealTilesToRack(count) {
    for (let i = 0; i < count && gameState.tilesBag.length > 0; i++) {
        gameState.rack.push(gameState.tilesBag.pop());
    }
}

function checkAdjacency(row, col) {
    // check if tile is adjacent (horizontally or vertically) to another placed tile
    const adjacent = [
        [row - 1, col],  // above
        [row + 1, col],  // below
        [row, col - 1],  // left
        [row, col + 1]   // right
    ];
    
    for (let [r, c] of adjacent) {
        if (r >= 0 && r < BOARD_CONFIG.size && c >= 0 && c < BOARD_CONFIG.size) {
            const squareId = `${r}-${c}`;
            if (gameState.tilesOnBoard[squareId]) {
                return true;
            }
        }
    }
    return false;
}

function renderBoard() {
    const $board = $('#scrabbleBoard');
    $board.empty();
    
    for (let row = 0; row < BOARD_CONFIG.size; row++) {
        for (let col = 0; col < BOARD_CONFIG.size; col++) {
            const squareType = BOARD_CONFIG.squares[row][col];
            const $square = $(`<div class="board-square" data-row="${row}" data-col="${col}"></div>`);
            
            // add classes based on square type
            switch(squareType) {
                case 'TW': $square.addClass('triple-word').html('<span>Triple<br>Word<br>Score</span>'); break;
                case 'DW': $square.addClass('double-word').html('<span>Double<br>Word<br>Score</span>'); break;
                case 'TL': $square.addClass('triple-letter').html('<span>Triple<br>Letter<br>Score</span>'); break;
                case 'DL': $square.addClass('double-letter').html('<span>Double<br>Letter<br>Score</span>'); break;
                default: $square.addClass('normal');
            }
            
            // mark center
            if (row === 7 && col === 7) {
                $square.addClass('center').text('★');
            }
            
            $board.append($square);
            makeDroppable($square);
        }
    }
}

function renderRack() {
    const $rack = $('.tile-rack');
    $rack.empty();
    
    gameState.rack.forEach((letter, index) => {
        const tileImgPath = `graphics_data/Scrabble_Tile_${letter}.jpg`;
        const $tile = $(`<div class="tile" data-letter="${letter}" data-rack-index="${index}">
                            <img src="${tileImgPath}" alt="${letter}">
                        </div>`);
        $rack.append($tile);
        makeDraggable($tile);
    });
    
    // make rack a drop target for tiles from board
    makeRackDroppable($rack);
}

function makeRackDroppable($rack) {
    $rack.droppable({
        accept: '.tile',
        drop: function(event, ui) {
            const $tile = ui.draggable;
            const boardRow = $tile.data('board-row');
            const boardCol = $tile.data('board-col');
            const letter = $tile.data('letter');
            
            // cannot drag back if tiles were refreshed
            if (gameState.tilesRefreshedThisRound) {
                showMessage('Cannot drag tiles back after refreshing!', 'error');
                return;
            }
            
            // only accept tiles from the board (not from rack)
            if (boardRow !== undefined && boardCol !== undefined) {
                const squareId = `${boardRow}-${boardCol}`;
                
                // remove from board
                delete gameState.tilesOnBoard[squareId];
                
                // reset first tile flag if all tiles are removed
                if (Object.keys(gameState.tilesOnBoard).length === 0) {
                    gameState.firstTilePlacedThisRound = false;
                }
                
                // add back to rack
                gameState.rack.push(letter);
                renderRack();
                
                // clear the board square
                $(`[data-row="${boardRow}"][data-col="${boardCol}"]`).empty();
                
                // add bonus square text back
                const squareType = BOARD_CONFIG.squares[boardRow][boardCol];
                const $square = $(`[data-row="${boardRow}"][data-col="${boardCol}"]`);
                switch(squareType) {
                    case 'TW': $square.html('<span>Triple<br>Word<br>Score</span>'); break;
                    case 'DW': $square.html('<span>Double<br>Word<br>Score</span>'); break;
                    case 'TL': $square.html('<span>Triple<br>Letter<br>Score</span>'); break;
                    case 'DL': $square.html('<span>Double<br>Letter<br>Score</span>'); break;
                }
                if (boardRow === 7 && boardCol === 7) $square.text('★');
                
                showMessage('Tile returned to rack!', 'info');
            }
        }
    });
}

function setupDragAndDrop() {
    // drag and drop is set up in makeDraggable and makeDroppable
}

function makeDraggable($element) {
    $element.draggable({
        revert: 'invalid',
        helper: 'clone',
        appendTo: 'body',
        zIndex: 1000,
        opacity: 0.7,
        start: function() {
            $(this).css('opacity', '0.5');
        },
        stop: function() {
            $(this).css('opacity', '1');
        }
    });
}

function makeDroppable($element) {
    $element.droppable({
        accept: '.tile',
        drop: function(event, ui) {
            const $tile = ui.draggable;
            const row = $(this).data('row');
            const col = $(this).data('col');
            const letter = $tile.data('letter');
            
            handleDrop($tile, $(this), letter, row, col);
        }
    });
}

function handleDrop($tile, $square, letter, row, col) {
    const squareId = `${row}-${col}`;
    
    // check if square already has a tile
    if (gameState.tilesOnBoard[squareId]) {
        showMessage('Square already occupied!', 'error');
        return;
    }
    
    // check if this is the first tile and it must cover the center star
    if (Object.keys(gameState.tilesOnBoard).length === 0 && !gameState.firstTilePlacedThisRound) {
        if (row !== 7 || col !== 7) {
            showMessage('First tile must cover the center star (★)!', 'error');
            return;
        }
    }
    
    // check adjacency if not first tile
    if (Object.keys(gameState.tilesOnBoard).length > 0) {
        const hasAdjacentTile = checkAdjacency(row, col);
        if (!hasAdjacentTile) {
            showMessage('Tile must be placed next to another tile!', 'error');
            return;
        }
    }
    
    // place tile on board
    gameState.tilesOnBoard[squareId] = letter;
    
    // mark that first tile has been placed this round
    if (Object.keys(gameState.tilesOnBoard).length === 1) {
        gameState.firstTilePlacedThisRound = true;
    }
    
    const tileImgPath = `graphics_data/Scrabble_Tile_${letter}.jpg`;
    const $placedTile = $(`<div class="tile" data-letter="${letter}">
                             <img src="${tileImgPath}" alt="${letter}">
                          </div>`);
    
    $square.empty().append($placedTile);
    
    // make placed tile draggable back to rack (unless tiles were refreshed)
    if (!gameState.tilesRefreshedThisRound) {
        makeDraggable($placedTile);
        $placedTile.data('board-row', row);
        $placedTile.data('board-col', col);
    }
    
    // remove from rack
    const rackIndex = $tile.data('rack-index');
    if (rackIndex !== undefined) {
        gameState.rack.splice(rackIndex, 1);
        renderRack();
    }
    
    showMessage('Tile placed! Drag back to rack or click Validate Word to score.', 'info');
}

function validateWord() {
    if (Object.keys(gameState.tilesOnBoard).length === 0) {
        showMessage('No tiles on board!', 'error');
        return;
    }
    
    // simple scoring: count points of placed tiles
    let wordScore = 0;
    let wordMultiplier = 1;
    
    for (const squareId in gameState.tilesOnBoard) {
        const [row, col] = squareId.split('-').map(Number);
        const letter = gameState.tilesOnBoard[squareId];
        const points = LETTER_DISTRIBUTION[letter].points;
        const squareType = BOARD_CONFIG.squares[row][col];
        
        let tileScore = points;
        
        if (squareType === 'DL') tileScore *= 2;
        if (squareType === 'TL') tileScore *= 3;
        if (squareType === 'DW') wordMultiplier *= 2;
        if (squareType === 'TW') wordMultiplier *= 3;
        
        wordScore += tileScore;
    }
    
    wordScore *= wordMultiplier;
    gameState.score += wordScore;
    
    // deal new tiles
    dealTilesToRack(Object.keys(gameState.tilesOnBoard).length);
    gameState.tilesOnBoard = {};
    
    // reset flags for next round
    gameState.tilesRefreshedThisRound = false;
    gameState.firstTilePlacedThisRound = false;
    
    renderRack();
    updateScore();
    showMessage(`Word scored ${wordScore} points! Total: ${gameState.score}`, 'success');
}

function recallTile() {
    // cannot recall if tiles were refreshed
    if (gameState.tilesRefreshedThisRound) {
        showMessage('Cannot recall after refreshing tiles!', 'error');
        return;
    }
    
    // move last placed tile back to rack
    if (Object.keys(gameState.tilesOnBoard).length > 0) {
        const lastSquareId = Object.keys(gameState.tilesOnBoard).pop();
        const letter = gameState.tilesOnBoard[lastSquareId];
        const [row, col] = lastSquareId.split('-').map(Number);
        
        gameState.rack.push(letter);
        delete gameState.tilesOnBoard[lastSquareId];
        
        // reset first tile flag if all tiles are recalled
        if (Object.keys(gameState.tilesOnBoard).length === 0) {
            gameState.firstTilePlacedThisRound = false;
        }
        
        $(`[data-row="${row}"][data-col="${col}"]`).empty().text('');
        renderRack();
        showMessage('Tile recalled to rack!', 'success');
    } else {
        showMessage('No tiles on board to recall!', 'error');
    }
}

function refreshTiles() {
    // return all rack tiles to bag and deal new ones
    gameState.tilesBag.push(...gameState.rack);
    gameState.rack = [];
    shuffleArray(gameState.tilesBag);
    dealTilesToRack(7);
    
    // mark that tiles have been refreshed this round
    gameState.tilesRefreshedThisRound = true;
    
    renderRack();
    showMessage('Hand refreshed! Cannot recall or drag tiles back to rack for this word.', 'info');
}

function newGame() {
    gameState.score = 0;
    gameState.rack = [];
    gameState.tilesOnBoard = {};
    gameState.tilesRefreshedThisRound = false;
    gameState.firstTilePlacedThisRound = false;
    
    // clear board and reset bonus text
    BOARD_CONFIG.squares.forEach((row, rowIdx) => {
        row.forEach((squareType, colIdx) => {
            const $square = $(`[data-row="${rowIdx}"][data-col="${colIdx}"]`);
            $square.empty();
            switch(squareType) {
                case 'TW': $square.html('<span>Triple<br>Word<br>Score</span>'); break;
                case 'DW': $square.html('<span>Double<br>Word<br>Score</span>'); break;
                case 'TL': $square.html('<span>Triple<br>Letter<br>Score</span>'); break;
                case 'DL': $square.html('<span>Double<br>Letter<br>Score</span>'); break;
            }
            if (rowIdx === 7 && colIdx === 7) $square.text('★');
        });
    });
    
    createTileBag();
    dealTilesToRack(7);
    renderRack();
    updateScore();
    updateLetterStats();
    showMessage('New game started!', 'success');
}

function updateScore() {
    $('#scoreValue').text(gameState.score);
}

function updateLetterStats() {
    const $statsTable = $('.stats-table');
    $statsTable.empty();
    
    for (const letter in LETTER_DISTRIBUTION) {
        const remaining = gameState.tilesBag.filter(t => t === letter).length +
                         gameState.rack.filter(t => t === letter).length;
        
        const $row = $(`<div class="stat-row">
                            <span class="stat-letter">${letter}</span>
                            <span class="stat-count">${remaining}</span>
                        </div>`);
        $statsTable.append($row);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showMessage(message, type) {
    const $msgBox = $('#messageBox');
    $msgBox.removeClass('success error info').addClass(type).text(message).addClass('show');
    
    setTimeout(() => {
        $msgBox.removeClass('show');
    }, 3000);
}

function setupEventListeners() {
    $('#validateWordBtn').on('click', validateWord);
    $('#newGameBtn').on('click', newGame);
    $('#recallBtn').on('click', recallTile);
    $('#refreshHandBtn').on('click', refreshTiles);
    setupTrashBin();
}

function setupTrashBin() {
    const $trash = $('#trashIcon');
    
    $trash.droppable({
        accept: '.tile',
        drop: function(event, ui) {
            const $tile = ui.draggable;
            const letter = $tile.data('letter');
            const rackIndex = $tile.data('rack-index');
            const boardRow = $tile.data('board-row');
            const boardCol = $tile.data('board-col');
            
            // check if tile is from rack
            if (rackIndex !== undefined) {
                // discard from rack
                gameState.rack.splice(rackIndex, 1);
                gameState.tilesBag.push(letter);
                renderRack();
                showMessage('Tile discarded!', 'info');
            }
            // check if tile is from board
            else if (boardRow !== undefined && boardCol !== undefined) {
                const squareId = `${boardRow}-${boardCol}`;
                
                // remove from board
                delete gameState.tilesOnBoard[squareId];
                gameState.tilesBag.push(letter);
                
                // clear the board square
                $(`[data-row="${boardRow}"][data-col="${boardCol}"]`).empty();
                
                // add bonus square text back
                const squareType = BOARD_CONFIG.squares[boardRow][boardCol];
                const $square = $(`[data-row="${boardRow}"][data-col="${boardCol}"]`);
                switch(squareType) {
                    case 'TW': $square.html('<span>Triple<br>Word<br>Score</span>'); break;
                    case 'DW': $square.html('<span>Double<br>Word<br>Score</span>'); break;
                    case 'TL': $square.html('<span>Triple<br>Letter<br>Score</span>'); break;
                    case 'DL': $square.html('<span>Double<br>Letter<br>Score</span>'); break;
                }
                if (boardRow === 7 && boardCol === 7) $square.text('★');
                
                showMessage('Tile discarded!', 'info');
            }
        }
    });
}
