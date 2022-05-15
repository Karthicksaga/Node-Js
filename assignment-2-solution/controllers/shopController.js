const path = require('path');
const express = require('express');

exports.users = (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'users.html'));
}