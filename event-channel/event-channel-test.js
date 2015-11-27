/**
 * Created by garcia on 07/10/15.
 */
describe('EventChannel', function(){

    beforeEach(function(){
        module('myApp');

    });

    var eventChannel, rootScope, handler;

    beforeEach(inject(function(EventChannel, $rootScope){
        eventChannel = EventChannel;
        rootScope = $rootScope;
        handler = {
            onUserLoggedIn:function(ev, args){
                console.log("onUserLoggedIn", args);
            },
            onUserLoggedOut:function(ev, args){
                console.log("onUserLoggedOut", args);
            }
        };

        spyOn(handler, 'onUserLoggedIn').and.callThrough();
        spyOn(handler, 'onUserLoggedOut').and.callThrough();
    }));

    it('subscribes and listens to events published', function(){

        var scope = rootScope.$new();

        eventChannel.addMyEventListener(eventChannel.events.onUserLoggedIn, handler.onUserLoggedIn, scope);

        eventChannel.publishEvent(eventChannel.events.onUserLoggedIn, {'val': "1"});

        expect(handler.onUserLoggedIn).toHaveBeenCalled();


    });

    it('distinguishes between two different subscribed events', function(){

        var scope = rootScope.$new();

        eventChannel.addMyEventListener(eventChannel.events.onUserLoggedIn, handler.onUserLoggedIn, scope);
        eventChannel.addMyEventListener(eventChannel.events.onUserLoggedOut, handler.onUserLoggedOut, scope);

        eventChannel.publishEvent(eventChannel.events.onUserLoggedIn, {'val': "1"});

        expect(handler.onUserLoggedIn).toHaveBeenCalled();
        expect(handler.onUserLoggedOut).not.toHaveBeenCalled();


    });

    it('unsubscribes to events', function(){
        var scope = rootScope.$new();

        eventChannel.addMyEventListener(eventChannel.events.onUserLoggedIn, handler.onUserLoggedIn, scope);
        eventChannel.addMyEventListener(eventChannel.events.onUserLoggedOut, handler.onUserLoggedOut, scope);
        eventChannel.removeMyEventListener(eventChannel.events.onUserLoggedIn, handler.onUserLoggedIn);

        eventChannel.publishEvent(eventChannel.events.onUserLoggedIn, {'val': "1"});
        eventChannel.publishEvent(eventChannel.events.onUserLoggedOut, {'val': "1"});


        expect(handler.onUserLoggedIn).not.toHaveBeenCalled();
        expect(handler.onUserLoggedOut).toHaveBeenCalled();
    });

    it('unsubscribes events when the scope is destroyed', function(){
        var scope = rootScope.$new();

        eventChannel.addMyEventListener(eventChannel.events.onUserLoggedIn, handler.onUserLoggedIn, scope);
        eventChannel.addMyEventListener(eventChannel.events.onUserLoggedOut, handler.onUserLoggedOut, scope);

        scope.$destroy();
        eventChannel.publishEvent(eventChannel.events.onUserLoggedIn, {'val': "1"});
        eventChannel.publishEvent(eventChannel.events.onUserLoggedOut, {'val': "1"});


        expect(handler.onUserLoggedIn).not.toHaveBeenCalled();
        expect(handler.onUserLoggedOut).not.toHaveBeenCalled();

    });





});