//Darrick Foster 6200433877 
window.onload = function  () {
	"use strict";

	var $pieces = $$('#puzzlearea div'),
		$shuffle = $('shufflebutton'),
		$puzzle = $('puzzlearea'),
		game = {
			blank : [], 
			complete: false,
			inProgress : false,
			init : function(){

				var	top = 0;

				for(var i = 0; i<$pieces.length; i++){
					var left = (i % 4) * 100,
						xOffset = 400 - left,
						yOffset = 400 - top,
						position = [left, top];
					$pieces[i].addClassName('puzzlepiece');
					this.setPiece($pieces[i], position);
					$pieces[i].setStyle({
						backgroundPosition: xOffset + 'px ' + yOffset + 'px'
					}); 
					$pieces[i].writeAttribute('data-correct', [left, top]);
					
					top += ((i + 1) % 4 == 0) ? 100 : 0;
				}
				this.blank = [300, 300];
				this.stylePieces();
			},
			checkSolved : function(){
				if (!this.complete && this.inProgress){
					var solved = true;
					for (var i = 0; i < $pieces.length; i++) {
						var positionData = this.getPositionDataFromPiece($pieces[i]);
						solved = solved && positionData.current.toString() === positionData.correct.toString();
					}

					if (solved){
						$puzzle.fire('puzzle:solved');
					}
				}
			},
			setPiece : function(piece, position){
				piece.writeAttribute('data-position', position);
				piece.setStyle({
					left: position[0] + 'px',
					top: position[1] + 'px'
				});
			},
			getPositionDataFromPiece : function(piece){
				var currentPositionAsString = piece.readAttribute('data-position').split(','),
					correctPositionAsString = piece.readAttribute('data-correct').split(',');

				return {
					current: [parseInt(currentPositionAsString[0]), parseInt(currentPositionAsString[1])],
					correct: [parseInt(correctPositionAsString[0]), parseInt(correctPositionAsString[1])]
				}; 
			},
			shufflePieces : function(){
				if (!this.complete){
					for (var i = 0; i < 250; i++) {
						var movablePieces = this.getMovablePieces(),
							indexToMove = Math.floor(Math.random() * movablePieces.length),
							piece = movablePieces[indexToMove];
						this.movePiece(piece);	
					}
					this.inProgress = true;

				}
			},
			stylePieces : function(){
				$pieces.each(function(piece){
					if (piece.hasClassName('movablepiece')){
						piece.removeClassName('movablepiece');
					}
				});
				var movablePieces = this.getMovablePieces();
				movablePieces.each(function(piece){
					piece.addClassName('movablepiece');
				});			
			},
			getMovablePieces : function(){
				var positions = [],
					movablePieces = [];

				if (this.isValidPosition([this.blank[0] + 100, this.blank[1]])) { positions.push([this.blank[0] + 100, this.blank[1]]); }
				if (this.isValidPosition([this.blank[0] - 100, this.blank[1]])) { positions.push([this.blank[0] - 100, this.blank[1]]); }
				if (this.isValidPosition([this.blank[0], this.blank[1] + 100])) { positions.push([this.blank[0], this.blank[1] + 100]); }
				if (this.isValidPosition([this.blank[0], this.blank[1] - 100])) { positions.push([this.blank[0], this.blank[1] - 100]); }

				for (var i = 0; i < positions.length; i++) {
					movablePieces.push(this.findPieceByPosition(positions[i]));
				}

				return movablePieces;
			},
			isValidPosition : function(position){
				return position[0] <= 300 && position[0] >= 0 && position[1] <= 300 && position[1] >= 0;
			},
			findPieceByPosition : function(position){
				if (this.isValidPosition(position)){
					return $$('div[data-position=' + position + ']' )[0];
				}
			},
			isMovablePiece : function (piece){
				var movablePieces = this.getMovablePieces(),
					movable = false;

				for (var i = 0; i < movablePieces.length; i++) {
					movable = movable || piece === movablePieces[i];
				}
				
				return movable;
			},
			movePiece : function(piece){
				if (this.isMovablePiece(piece)){
					var position = this.getPositionDataFromPiece(piece).current,
						newPosition = game.blank;
					this.blank = position;
					this.setPiece(piece, newPosition);
					this.stylePieces();
					this.checkSolved();
				}
			}
		};

	$shuffle.observe('click', shufflePieces);

	function shufflePieces(){
		game.shufflePieces();
	}

	$pieces.each(function(item){
		item.observe('click', movePiece);
	});

	function movePiece(){
		game.movePiece(this);
	}

	$puzzle.observe('puzzle:solved', function(event){
		$puzzle.innerHTML = "<h4>CONGRATULATIONS!</h4>";
		game.complete = true;
	});

	game.init();
};