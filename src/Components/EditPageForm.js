import React, { useState } from 'react';
import { updatePage } from '../graphql/mutations';
import { generateClient } from 'aws-amplify/api';
import '../Styles/EditPageForm.css';

const client = generateClient();

const EditPageForm = ({ onSave, pageId, bookId, bookTitle, recipeStory: initialStory, ingredients: initialIngredients, steps: initialSteps }) => {
    const [recipeStory, setRecipeStory] = useState(initialStory || '');
    const [ingredients, setIngredients] = useState(initialIngredients || [{ name: '', quantity: '', unit: '' }]);
    const [steps, setSteps] = useState(initialSteps || ['']);

    const handleIngredientChange = (index, key, value) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index][key] = value;
        setIngredients(updatedIngredients);
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
    };

    const handleStepChange = (index, value) => {
        const updatedSteps = [...steps];
        updatedSteps[index] = value;
        setSteps(updatedSteps);
    };

    const handleAddStep = () => {
        setSteps([...steps, '']);
    };

    const submitForm = async () => {
        try {
            await client.graphql({
                query: updatePage,
                variables: {
                    input: {
                        id: pageId,
                        bookId: bookId,
                        bookTitle: bookTitle,
                        recipeStory,
                        ingredients: ingredients.map(ing => ({
                            name: ing.name,
                            quantity: parseFloat(ing.quantity),
                            unit: ing.unit
                        })),
                        steps: steps.map(step => ({ description: step }))
                    }
                }
            });
            onSave({ recipeStory, ingredients, steps });
        } catch (error) {
            console.error('Error updating page:', error);
        }
    };

    // Define metric and US units, including the dry versions
    const metricUnits = ['L', 'ml', 'g', 'kg'].sort();
    const usUnits = ['teaspoon', 'dry tablespoon', 'tablespoon', 'dry teaspoon', 'fl oz', 'cup', 'dry cup', 'pints', 'quarts', 'gallons', 'oz', 'lbs'].sort();

    return (
        <div className="edit-page-form">
            <h3>Edit Page</h3>
            <form>
                <div>
                    <label>Recipe Story (optional):</label>
                    <textarea
                        value={recipeStory}
                        onChange={(e) => setRecipeStory(e.target.value)}
                        placeholder="Enter recipe story"
                        className="recipe-story"
                    ></textarea>
                </div>
                <div>
                    <label>Ingredients:</label>
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="ingredient-inputs">
                            <input
                                type="text"
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                placeholder="Ingredient"
                                className="ingredient-name"
                            />
                            <input
                                type="number"
                                value={ingredient.quantity}
                                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                placeholder="Quantity"
                                className="ingredient-quantity"
                            />
                            <select
                                value={ingredient.unit}
                                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                className="ingredient-unit"
                            >
                                <option value="">Unit</option>
                                <optgroup label="Metric">
                                    {metricUnits.map((unit) => (
                                        <option key={unit} value={unit}>{unit}</option>
                                    ))}
                                </optgroup>
                                <optgroup label="US">
                                    {usUnits.map((unit) => (
                                        <option key={unit} value={unit}>{unit}</option>
                                    ))}
                                </optgroup>
                            </select>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddIngredient} className="add-ingredient-button">Add Ingredient</button>
                </div>
                <div>
                    <label>Steps:</label>
                    {steps.map((step, index) => (
                        <div key={index} className="step-inputs">
                            <textarea
                                value={step}
                                onChange={(e) => handleStepChange(index, e.target.value)}
                                placeholder={`Step ${index + 1}`}
                                className="step"
                            ></textarea>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddStep} className="add-step-button">Add Step</button>
                </div>
                <div className='button-container'>
                    <button type="button" onClick={submitForm} className="save-button">Save Page</button>
                </div>
            </form>
        </div>
    );
};

export default EditPageForm;
