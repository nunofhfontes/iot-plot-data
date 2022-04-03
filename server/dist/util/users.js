"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.userLeft = exports.userJoin = void 0;
var users = [];
var userJoin = function (id, username) {
    var user = users.find(function (user) { return user.username === username; });
    if (user) {
        return false;
    }
    users.push({ id: id, username: username });
    return true;
};
exports.userJoin = userJoin;
var userLeft = function (id) {
    users = users.filter(function (user) { return user.id !== id; });
};
exports.userLeft = userLeft;
var getUsers = function () { return users; };
exports.getUsers = getUsers;
