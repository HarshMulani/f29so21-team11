"use strict";
// enum of eventTypes used in socket events
// reduces typos
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTypes = void 0;
var EventTypes;
(function (EventTypes) {
    EventTypes["Room"] = "room";
    EventTypes["Message"] = "message";
    EventTypes["User"] = "user";
    EventTypes["Group"] = "group";
    EventTypes["Image"] = "image";
})(EventTypes = exports.EventTypes || (exports.EventTypes = {}));
