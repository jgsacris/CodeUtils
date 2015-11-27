/**
 * Created by garcia on 07/10/15.
 */
(function(){
    'use strict';
    angular.module('myApp')
        .service('EventChannel', ['$rootScope', function($rootScope){
            var unsubscribeHandlers = {};

            Object.defineProperty(Function.prototype, 'my_uuid',{
                writable:true,
                enumerable:true,
                configurable:true
            });

            var _this = this;

            this.events = {
                onUserLoggedIn: 'onUserLoggedIn',
                onUserLoggedOut: 'onUserLoggedOut',
                onCompanySelected: 'onCompanySelected',
                onCompanyChanged: 'onCompanyChanged',
                onAddNewCompany: 'onAddNewCompany',
                onCategorySelected: 'onCategorySelected',
                onAddNewCategory: 'onAddNewCategory',
                onCategoryChanged: 'onCategoryChanged',
                onLocationSelected: 'onLocationSelected',
                onAddNewLocation: 'onAddNewLocation',
                onLocationChanged: 'onLocationChanged',
                onUserSelected: 'onUserSelected',
                onAddNewUser: 'onAddNewUser',
                onUserChanged: 'onUserChanged'
            };


            this.publishEvent = function (eventName, args) {
                $rootScope.$emit(eventName, args);
            };

            this.addMyEventListener = function (eventName,  handler, $scope){

                //console.log('addListener to '+eventName, handler);
                //console.trace();

                if(!unsubscribeHandlers[eventName]){
                    unsubscribeHandlers[eventName] = [];
                }

                if(handler.my_uuid &&  unsubscribeHandlers[eventName][handler.my_uuid]){
                    console.log("the handler for the event "+eventName+" is already added", handler);
                    return;
                }
                handler.my_uuid = handler.name + new Date().getTime().toString();

                var unsubscribe = $rootScope.$on(eventName, function(event, args){
                    handler(event,args);
                });
                unsubscribeHandlers[eventName][handler.my_uuid] = unsubscribe;
                if($scope){
                    $scope.$on('$destroy', function(){
                        //console.log(' destroy Listener to '+eventName, handler);
                        _this.removeMyEventListener(eventName, handler);
                    });
                }

            };

            this.removeMyEventListener = function(eventName, handler){
                if(!unsubscribeHandlers[eventName][handler.my_uuid]){
                    return;
                }
                //console.log(' remove Listener to '+eventName, handler);
                unsubscribeHandlers[eventName][handler.my_uuid]();
                delete(unsubscribeHandlers[eventName][handler.my_uuid]);
            };
        }])
    
})();