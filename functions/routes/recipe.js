const express = require('express');
const RecipeModel = require('../models/recipe');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const recipes = await RecipeModel.find();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', getRecipe, (req, res) => {
    res.json(res.recipe);
});

//Create author
router.post('/', async (req, res) => {
    try {
        if (!req.body.name || !req.body.cuisine){
            return res.status(400).json({ message: 'Name and cuisine are required'});
        }

        const existingRecipe = await RecipeModel.findOne({ name: req.body.name});
        if (existingRecipe){
            return res.status(400).json({ message: 'Recipe Already Exist'});
        }

        const recipe = new RecipeModel(req.body);
        const newRecipe = await recipe.save();
        res
        .status(201)
        .json({ message: 'Recipe created succesfully', recipe: newRecipe});
    } catch (err) {
        res.status(400).json({ message: err.message});
    }
});

//update author
router.patch('/:id', getRecipe, async (req, res) => {
    try {
        if(req.body.name != null){
            res.recipe.name = req.body.name;
        }
        const updatedRecipe = await res.recipe.save();
        res.json(updatedRecipe);
    } catch (err) {
        res.status(400).json({ message: err.message});
    }
});

router.put('/:id', getRecipe, async (req, res) => {
    try {
        const updatedRecipe = await RecipeModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        res.json(updatedRecipe);
    } catch (err) {
        res.status(400).json({ message: err.message});
    }
});

//delete author
router.delete('/:id', getRecipe, async (req, res) => {
    try {
        await RecipeModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Recipe deleted'});
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
});

async function getRecipe(req, res, next) {
    try {
        const recipe = await recipeModel.findById(req.params.id);
        if (!recipe){
            return res.status(404).json({ message: 'Recipe not found'});
        }
        res.recipe = recipe;
        next();
    }catch (err) {
        res.status(500).json({ message: err.message});
    }
}

module.exports = router;