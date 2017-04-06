'use strict';

var express = require('express');
var router = new express.Router();

var config = require('../../config');
var chat_db = require('../models/chat');

router.get('/data:ops((?:_convo)?)/:id([a-z0-9]+):convo((?:_\\S+)?)', function (req, res) {
    var board_found = false;

    if (req.params.id == 'all' || req.params.id == 'moderate')
    {
	board_found = true;
    }
    else
    {
        for (var board in config.boards)
        {
            if (config.boards[board].name == req.params.id)
            {
	        board_found = true;
                break;
            }
        }
    }

    if (!board_found) {
        return res.send('Does not exist :(');
    }

    var search = {};
    var limit = 0;
    var fields = '';
    if (req.params.id === 'all') {
        limit = 50;
        fields = config.all_fields;
    } else if (req.params.id === 'moderate') {
        limit = 50;
        fields = config.moderate_fields;
    } else if (req.params.convo) {
    	search.convo = decodeURI(req.params.convo.slice(1));
    	console.log("\n\n", search.convo, "\n\n");
    	search.chat = req.params.id;
        limit = 200;
        fields = config.board_fields;
    } else {
        search.chat = req.params.id;
        limit = 550;
        fields = config.board_fields;
    }

    if (req.params.ops === '_convo') {
        search.is_convo_op = true;
        limit = 15;
    }

    chat_db.find(search)
        .sort({
            count: -1
        })
        .select(fields)
        .limit(limit)
        .exec(function (e, d) {
            if (!e) {
                res.json(d);
            } else {
                res.send('db_error');
            }
        });
});

module.exports = router;
