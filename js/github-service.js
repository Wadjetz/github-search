HomeworkZengularityApp.service('GitHubApiService', [
    '$http', '$q',
    function ($http, $q) {
    	var self = this;

    	/**
		Recherche des projets github
    	*/
    	self.search = function (query) {
	    	var deferred = $q.defer();
	    	$http.get('https://api.github.com/search/repositories?q=' + query + '&per_page=16')
		        .success(function (data, status, headers, config) {
		            deferred.resolve(data);
		        })
		        .error(function (data, status, headers, config) {
		            deferred.reject("Error loading keywords");
		        });
		    return deferred.promise;
    	};

    	/**
		Récupère les 100 derniers commits d'un projet
    	*/
    	self.commits = function (name) {
    		var deferred = $q.defer();
	    	$http.get('https://api.github.com/repos/' + name + '/commits?per_page=100')
		        .success(function (data, status, headers, config) {
		            deferred.resolve(data);
		        })
		        .error(function (data, status, headers, config) {
		            deferred.reject("Error loading keywords");
		        });
		    return deferred.promise;
    	};

    	/**
		Récupère les informations sur le projet
    	*/
    	self.repository = function (name) {
    		var deferred = $q.defer();
	    	$http.get('https://api.github.com/repos/' + name)
		        .success(function (data, status, headers, config) {
		            deferred.resolve(data);
		        })
		        .error(function (data, status, headers, config) {
		            deferred.reject("Error loading keywords");
		        });
		    return deferred.promise;
    	};

    	/**
		Récupère la liste des contributeurs du projet
    	*/
    	self.contributors = function (name) {
    		var deferred = $q.defer();
	    	$http.get('https://api.github.com/repos/' + name + '/contributors')
		        .success(function (data, status, headers, config) {
		            deferred.resolve(data);
		        })
		        .error(function (data, status, headers, config) {
		            deferred.reject("Error loading keywords");
		        });
		    return deferred.promise;
    	};
    }
]);