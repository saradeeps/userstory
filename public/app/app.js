angular.module('MyApp', ['appRoute','mainCtrl','authServices','userCtrl','userService','storyService', 'storyCtrl','reverseDirective'])

.config(function($httpProvider){

	$httpProvider.interceptors.push('AuthInterceptor');
})
