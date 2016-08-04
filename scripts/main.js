$(function () {
	//Pages
	var $startingPage = $('#startingPage')
		, $gamePage = $('#gamePage')
		, $postGameModal = $('#postGameModal');

	function fadeInStartPage() {
		$startingPage.fadeIn();
		$gamePage.fadeOut();
		$postGameModal.fadeOut();
	}

	function fadeInGamePage() {
		$gamePage.fadeIn();
		$postGameModal.fadeOut();
	}

	function fadeInPostGameModal() {
		$gamePage.fadeOut();
		$postGameModal.fadeIn();
	}
	//API Consumption and Object Array creation
	var getPhotosApiUrl = 'http://pixlee-ugc-game.herokuapp.com/getphotos/';
	var endpointUrl = 'http://pixlee-ugc-game.herokuapp.com/users/signup';
	var leaderboardUrl = 'http://pixlee-ugc-game.herokuapp.com/score/';
	var itemArray = [];
	var ugcArray = [];
	var proArray = [];

	function getPhotos(type, count) {
		$.ajax({
			dataType: 'json'
			, url: getPhotosApiUrl + '' + type + '/' + count
			, success: photosRetrieved
			, error: errorFunc
		});
	}

	function photosRetrieved(data) {
		$.each(data, function (index, value) {
			if (data[index].type === 'ugc') {
				ugcArray.push(value);
			}
			else if (data[index].type === 'pro') {
				proArray.push(value);
			}
		});
		itemArray = $.merge(ugcArray, proArray);
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
	//Game Page
	var currentImage = 0;
	var playerScore = 0;
	var picsRemaining = 15;
	var $scoreBadge = $('.badge.score');
	var $picsRemainingBadge = $('.badge.pics-remaining');
	var $imagesContainer = ('#images');

	function loadImages() {
		for (var item = 0; item < itemArray.length; item++) {
			$('<img>', {
				id: 'imgThumb' + item
				, class: 'img-thumbnail'
				, style: 'display: none;'
				, src: itemArray[item].url
			}).appendTo($imagesContainer);
		}
		$('#imgThumb0').show();
	}

	function nextImage() {
		if (currentImage === 15) {
			$postGameModal.modal({
				backdrop: 'static'
			});
		}
		else {
			$('#imgThumb' + (currentImage - 1)).hide();
			$('#imgThumb' + currentImage).show();
		}
	}
	//Post Game Modal
	var $playAgainBtn = $('#playAgain');
	var $quitBtn = $('#quit');
	var userName = $('#playerName');
	var userEmail = $('#playerEmail');

	function submitPlayerInfo(func) {
		userName = userName.val();
		userEmail = userEmail.val();
		$.ajax({
			url: endpointUrl
			, type: 'post'
			, data: {
				email: userEmail
				, name: userName
				, score: playerScore
			}
			, success: function (response) {
				resetGame();
				func;
			}
			, error: function (error) {
				console.log(JSON.stringify(error));
			}
		});
	}
	$playAgainBtn.on('click', function (event) {
		submitPlayerInfo(fadeInGamePage());
	});
	$quitBtn.on('click', function (event) {
		submitPlayerInfo(fadeInStartPage());
	});
	//Click Events
	$('#proBtn').on('click', function () {
		if (itemArray[currentImage].type === 'pro') {
			playerScore++;
			$scoreBadge.text(playerScore);
		}
		else if (itemArray[currentImage].type === 'ugc') {
		}
		currentImage++;
		picsRemaining--;
		$picsRemainingBadge.text(picsRemaining);
		nextImage();
	});
	$('#amateurBtn').on('click', function () {
		if (itemArray[currentImage].type === 'ugc') {
			playerScore++;
			$scoreBadge.text(playerScore);
		}
		else if (itemArray[currentImage].type === 'pro') {
			
		}
		currentImage++;
		picsRemaining--;
		$picsRemainingBadge.text(picsRemaining);
		nextImage();
	});
	$('#startGame').on('click', function () {
		fadeInGamePage();
		getPhotos('ugc', 10);
		getPhotos('pro', 10);
		setTimeout(function () {
			loadImages();
		}, 500)
	});

	function resetGame() {
		playerScore = 0;
		currentImage = 0;
		picsRemaining = 15;
		itemArray = [];
		ugcArray = [];
		proArray = [];
		$($imagesContainer).find('img').remove();
		$scoreBadge.text('0');
		$picsRemainingBadge.text('15');
	}
})