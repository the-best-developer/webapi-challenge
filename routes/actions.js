
const express = require('express');
const router = express.Router();
const actionData = require('../data/helpers/actionModel');

//  ##########
//  ##########
//     GET
//  ##########
//  ##########

router.get('/', (req, res) => {
    actionData.get()
    .then(projects => {
        res.status(200).json(projects);
    })
    .catch(_ => {
        res.status(500).json({ error: "Actions could not be retrieved." });
    })
});

router.get('/:id', CheckId, (req, res) => {
    const {id} = req.params;

    actionData.get(id)
    .then(project => {
        res.status(200).json(project);
    })
    .catch(_ => {
        res.status(500).json({ error: "This action could not be retrieved." });
    })
});

//  ##########
//  ##########
//    DELETE
//  ##########
//  ##########

router.delete('/:id', CheckId, (req, res) => {
    const {id} = req.params;

    actionData.remove(id)
    .then(info => {
        res.status(200).json(info);
    })
    .catch(_ => {
        res.status(500).json({ error: "This action could not be removed." });
    })
});

//  ##########
//  ##########
//     PUT
//  ##########
//  ##########

router.put('/:id', CheckId, (req, res) => {
    const {id} = req.params;
    const data = req.body;
    
    actionData.update(id, data)
    .then(info => {
        res.status(200).json(info);
    })
    .catch(_ => {
        res.status(500).json({ error: "The action information could not be changed" });
    })
});

function CheckId(req, res, next) {
    const {id} = req.params;
    
    actionData.get(id)
    .then(action => {
        if (action.description != "") {
            next();
        }
        else {
            res.status(400).json({ message: "invalid id" });
        }
    })
    .catch(_ => {
        res.status(400).json({ message: "invalid id" });
    })
};

module.exports = router;
