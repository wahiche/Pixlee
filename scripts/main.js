$(function(){
	//Pages
	var $startingPage = $('#startingPage'),
			$gamePage = $('#gamePage'),
			$postGameModal = $('#postGameModal');

	function showStartPage() {
		$startingPage.show();
		$gamePage.hide();
		$postGameModal.hide();
	}

	function showGamePage() {
		$startingPage.hide();
		$gamePage.show();
		$postGameModal.hide();
	}

	function showPostGameModal() {
		$startingPage.hide();
		$gamePage.hide();
		$postGameModal.show();
	}
	
	//API
	var getPhotosApiUrl = "http://pixlee-ugc-game.herokuapp.com/getphotos/";
	var sendDataApiUrl = "http://pixlee-ugc-game.herokuapp.com/users/signup";
	var itemArray = [];
	var ugcArray = [];
	var proArray = [];
	
	function getPhotos(type, count){
		$.ajax({
			dataType: 'json',
			url: getPhotosApiUrl + '' + type + '/' + count,
			success: photosRetrieved,
			error: errorFunc
		});
	}
	
	function photosRetrieved(data) {
		
		$.each(data, function(index, value) {
			if (data[index].type === "ugc") {
				ugcArray.push(value);
			}
			else if(data[index].type === "pro") {
				proArray.push(value);
			}
		});
		
		itemArray = $.merge(ugcArray,proArray);
		itemArray = shuffleArray(itemArray);
	}
	
	function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
	function errorFunc(err) {
		console.log(err);
	}
	//Starting Page
	getPhotos("ugc", 10);
	getPhotos("pro", 10);
	//Game Page

	//Post Game Modal
	var $playAgainBtn = $('#playAgain');
	var $quitBtn = $('#quit');
	//Click Events

	$('#startGame').on('click', function(){
		showGamePage();
	});
	$('#finishGame').on('click', function(){
		$postGameModal.modal({
			backdrop: 'static'
		});
	});
	$playAgainBtn.on('click', function(){
		showGamePage();
	});
	$quitBtn.on('click', function(){
		showStartPage();
	});
	
})