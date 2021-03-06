
//files holds the angular app configuratin every dependencies, services and controllers are passed to myApp
angular.module('myApp', ['ngMaterial','ngMessages','ngAnimate','userServices','authServices','designcontrolServices','adminServices','nurseServices','homeServices','appRoutes','userControllers','mainController','emailController','manageUserNeedController','adminController','nurseController','homeController'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('altTheme')
    .primaryPalette('indigo')
    .accentPalette('grey')
    .warnPalette('green',{
    	'default': '500', 
    	'hue-1': '300', 
    	'hue-2': '200', 
    	'hue-3': '100' 
    });

})

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('dark')
    .primaryPalette('indigo')
    .accentPalette('grey')
    .warnPalette('red',{
      'default': '500', 
      'hue-1': '300', 
      'hue-2': '200', 
      'hue-3': '100' 
    });

})
//inorder to inject token in every request header to make the user logged in
.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
})


