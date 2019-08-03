
const express = require('express');
const router = express.Router();
const projectData = require('../data/helpers/projectModel');
const actionData = require('../data/helpers/actionModel');

//  ##########
//  ##########
//     GET
//  ##########
//  ##########

router.get('/', (req, res) => {
    projectData.get()
    .then(projects => {
        res.status(200).json(projects);
    })
    .catch(_ => {
        res.status(500).json({ error: "Projects could not be retrieved." });
    })
});

router.get('/:id', CheckId, (req, res) => {
    const {id} = req.params;

    projectData.get(id)
    .then(project => {
        res.status(200).json(project);
    })
    .catch(_ => {
        res.status(500).json({ error: "This project could not be retrieved." });
    })
});


router.get('/:id/actions', CheckId, (req, res) => {
    const {id} = req.params;

    projectData.getProjectActions(id)
    .then(project => {
        res.status(200).json(project);
    })
    .catch(_ => {
        res.status(500).json({ error: "This project could not be retrieved." });
    })
});

//  ##########
//  ##########
//    DELETE
//  ##########
//  ##########

router.delete('/:id', CheckId, (req, res) => {
    const {id} = req.params;

    projectData.remove(id)
    .then(info => {
        res.status(200).json(info);
    })
    .catch(_ => {
        res.status(500).json({ error: "This project could not be removed." });
    })
});

//  ##########
//  ##########
//     PUT
//  ##########
//  ##########

router.put('/:id', CheckId, validateProject, (req, res) => {
    const {id} = req.params;
    const data = req.body;
    
    projectData.update(id, data)
    .then(info => {
        res.status(200).json(info);
    })
    .catch(_ => {
        res.status(500).json({ error: "The project information could not be changed" });
    })
});

//  ##########
//  ##########
//     POST
//  ##########
//  ##########

router.post('/', validateProject, (req, res) => {
    const data = req.body;

    projectData.insert(data)
    .then(info => {
        res.status(200).json(info);
    })
    .catch(err => {
        res.status(500).json({ error: "The project could not be added.", msg: err.message });
    })
});

router.post('/:id/actions', validateAction, (req, res) => {
    const data = req.body;
    const {id} = req.params;

    const newAction = {
        project_id: id,
        description: data.description,
        notes: data.notes,
        completed: !(!data.completed)
    }

    actionData.insert(newAction)
    .then(info => {
        res.status(200).json(info);
    })
    .catch(err => {
        res.status(500).json({ error: "The user information could not be retrieved.", msg: err.message });
    })
});

//  ##########
//  ##########
//    MIDDLE
//     WARE
//  ##########
//  ##########

function validateProject(req, res, next) {
    if ((req.body.name === undefined || req.body.description === undefined)) {
        res.status(400).json({ message: "missing required name or description field" });
    }
    next();
};

function validateAction(req, res, next) {
    
    console.log(req.body.description.length)
    if (req.body.description !== undefined && req.body.description.length > 128) {
        res.status(400).json({ message: "Description too long" });
    }
    if (req.body.description === undefined || req.body.notes === undefined) {
        res.status(400).json({ message: "missing required notes or description field" });
    }
    next();
};

function CheckId(req, res, next) {
    const {id} = req.params;
    
    projectData.get(id)
    .then(project => {
        if (project.name != "") {
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
