const express = require("express");
const labelSchemas = require("../schemas/labelsSchemas");
const Labels = require("../models/Labels");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { color } = req.body;
        const { error } = labelSchemas.newLabel.validate(req.body);
        if (error) return res.status(422).send({error: error.details[0].message});

        const label = await Labels.createLabel(color);

        res.status(201).send(label);

    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

router.get("/", async (req, res) => {
    try {
        const allLabels = await Labels.findAll();
        res.status(200).send(allLabels);

    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

module.exports = router;