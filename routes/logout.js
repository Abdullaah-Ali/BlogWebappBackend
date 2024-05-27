const express = require('express');
const router = express.Router();
const path = require('path');


router.route('/')
    .post(async (req, res) => {


        try {
            res.clearCookie('jwtToken');
            return res.status(200).json({ status: 'ok' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });



module.exports = router;