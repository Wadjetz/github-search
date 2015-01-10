(function (arg) {
	
})()

var HomeworkZengularityApp = angular.module('HomeworkZengularityApp', ['ui.router']);

HomeworkZengularityApp.config([
	'$stateProvider', '$urlRouterProvider', '$httpProvider',
	function ($stateProvider, $urlRouterProvider, $httpProvider) {

		$stateProvider
			.state('search', {
				url: "/",
				views: {
					'main': {
						templateUrl: "partials/search.html",
						controller: "SearchCtrl"
					}
				}
			})
			.state('repository', {
				url: "/repository/:owner/:repo",
				views: {
					'main': {
						templateUrl: "partials/repository.html",
						controller: "RepositoryCtrl"
					}
				}
			})
		;

		$urlRouterProvider.otherwise("/");
	}
]);

HomeworkZengularityApp.controller('SearchCtrl', [
	'$rootScope', '$scope', 'GitHubApiService',
	function ($rootScope, $scope, GitHubApiService) {
		$rootScope.loading = 0;
		
		$scope.submitSearch = function () {
			$scope.total_count = 1; 
			if ($scope.formSearch.$valid) {
				$rootScope.loading++;
				GitHubApiService.search($scope.query).then(function (res) {
					console.log(res);

					$scope.resultSearch = res;
					$scope.total_count = res.total_count;
					$rootScope.loading--;
				});
			}
		};
	}
]);

HomeworkZengularityApp.controller('RepositoryCtrl', [
	'$rootScope', '$scope', '$stateParams', 'GitHubApiService',
	function ($rootScope, $scope, $stateParams, GitHubApiService) {
		$rootScope.loading = 1;
		GitHubApiService.repository($stateParams.owner + '/' + $stateParams.repo).then(function (res) {
			//console.log(res);
			$scope.repository = res;
			$rootScope.loading--;
		}, function (message) {
			console.log(message);
			$rootScope.loading--;
		});

		GitHubApiService.commits($stateParams.owner + '/' + $stateParams.repo).then(function (res) {
			var commitData = res.reduce(function (last, commit) {
				if (commit && commit.committer && commit.committer.login !== null) {
					var commitDate = commit.commit.committer.date.substring(0, 10);
					last.committer[commit.committer.login] = (last.committer[commit.committer.login] || 0) + 1;
					last.timeline[commitDate] = (last.timeline[commitDate] || 0) + 1;
				}
				return last;
			}, { 'timeline': {}, 'committer': {} });

			var contributorsSort = Object.keys(commitData.committer).map(function (item) {
				return [item, commitData.committer[item]];
			}).sort(function (a, b) {
				if (a[1] > b[1]) { return -1; }
				if (a[1] < b[1]) { return 1;  }
				return 0;
			});

			contributorsSort.forEach(function (item) {
				commitData.committer[item[0]] = item[1];
			});

			var commitsSort = [];
			for (var key in commitData.timeline) {
				commitsSort.push({
					'date' : key,
					'nb' : commitData.timeline[key]
				})
			}

			$scope.activity = -1;

			if (commitsSort.length > 1) {
				var first = new Date(Date.now());
				var last = new Date(commitsSort[0].date);
				$scope.activity = ((((first - last)/1000)/60)/60)/24;
			}

			$scope.commits = commitsSort;
			$scope.contributors = contributorsSort;
			$rootScope.loading--;
		});
	}
]);

