var _ = require('underscore');

/* 
  Identifiable entities
*/
var entities = {
  RETWEET: 1,
  MENTION: 2,
  REPLY: 3
};

/*
  Determines is an event is an identifiable entity
*/
var is = {
  retweet: function(event) {
    return event && event.retweeted_status ? entities.RETWEET : false;
  },
  mention: function(event) {
    return event && event.entities && event.entities.user_mentions.length && event.in_reply_to_user_id ? entities.MENTION : false;
  },
  reply: function(event) {
    return event && event.in_reply_to_status_id ? entities.REPLY : false;
  }
};

/*
  Utils for replies only
*/
var reply = {
  to: function(event, screen_name) {
    return is.reply() ? (screen_name ? screen_name === event.in_reply_to_screen_name : event.in_reply_to_screen_name) : false;
  },
  from: function(event, screen_name) {
    return is.reply() ? (screen_name ? screen_name === event.user.screen_name : event.user.screen_name) : false;
  }
};

// check functions to identify
var checks = [is.retweet, is.mention, is.reply];

/*
  Identify an event
*/
var identify = function(event) {
  var result = false;
  _.each(checks, function(check){ result = result || check(event); });
  return result;
};

/* --------------------------Exports--------------------------- */

exports.entities = entities;
exports.identify = identify;
exports.is = is;
exports.reply = reply;