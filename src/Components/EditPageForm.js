import React, { useState } from 'react';
import { updatePage as updatePageMutation } from '../graphql/mutations';
import { generateClient } from 'aws-amplify/api';
import '../Styles/EditPageForm.css';

const client = generateClient();

const EditPageForm = ({ onSave, pageId, recipeStory: initialStory, ingredients: initialIngredients, steps: initialSteps }) => {
    // State management
    const [recipeStory, setRecipeStory] = useState(initialStory || '');
    const [ingredients, setIngredients] = useState(initialIngredients || [{ name: '', quantity: '', unit: '' }]);
    const [steps, setSteps] = useState(initialSteps || ['']);

    // Handlers for form changes
    const handleIngredientChange = (index, key, value) => {
        setIngredients((prevIngredients) => {
            const updatedIngredients = [...prevIngredients];
            updatedIngredients[index][key] = value;
            return updatedIngredients;
        });
    };

    const handleAddIngredient = () => {
        setIngredients((prevIngredients) => [...prevIngredients, { name: '', quantity: '', unit: '' }]);
    };

    const handleStepChange = (index, value) => {
        setSteps((prevSteps) => {
            const updatedSteps = [...prevSteps];
            updatedSteps[index] = value;
            return updatedSteps;
        });
    };

    const handleAddStep = () => {
        setSteps((prevSteps) => [...prevSteps, '']);
    };

    // Function to submit form
    const submitForm = async () => {
        try {
            // Construct the input for the updatePageMutation
            const input = {
                id: pageId,
                recipeStory,
                ingredients: JSON.stringify(ingredients),
                steps: JSON.stringify(steps),
            };

            console.log('Submitting updated page:', input);

            // Perform the GraphQL mutation
            const response = await client.graphql({
                query: updatePageMutation,
                variables: { input },
            });

            if (response.errors) {
                console.error('Errors in response:', response.errors);
                return;
            }

            console.log('Page updated successfully:', response.data);
            
            // Call the onSave callback function
            onSave(input);
        } catch (error) {
            console.error('Error updating page:', error);
        }
    };

    // Define metric and US units
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
                    />
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
                            />
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
