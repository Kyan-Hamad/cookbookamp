import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditPageForm from './EditPageForm';
import '../Styles/PageDetails.css';
import { getPage } from '../graphql/queries';
import { generateClient } from 'aws-amplify/api';
import { updatePage as updatePageMutation } from '../graphql/mutations';

const client = generateClient();


const PageDetails = () => {
const { pageId, title } = useParams();
const [pageContent, setPageContent] = useState({});
const [showForm, setShowForm] = useState(false);
const navigateTo = useNavigate();
const handleNavigation = (route) => {
    navigateTo(route);
};
useEffect(() => {
    const fetchPageContent = async () => {
        if (!pageId) return;
        try {
            const apiData = await client.graphql({ query: getPage, variables: { id: pageId } });
            if (apiData && apiData.data && apiData.data.getPage) {
                setPageContent(apiData.data.getPage);
            } else {
                console.error('Received invalid data:', apiData);
                setPageContent({}); // Reset or set to default to prevent errors
            }
        } catch (error) {
            console.error('Error fetching page content:', error);
        }
    };
    fetchPageContent();
}, [pageId]);
const handleSavePage = async (newPageContent) => {
    setPageContent((prevPageContent) => ({
        ...prevPageContent,
        ...newPageContent,
    }));
    setShowForm(false);
    try {
        await client.graphql({
            query: updatePageMutation,
            variables: {
                input: {
                    id: pageId,
                    ...newPageContent,
                }
            }
        });
    } catch (error) {
        console.error('Error updating page:', error);
    }
};

const conversionRates = {
    dry: {
        usToMetric: {
            'cup': 120,
            'tablespoon': 15,
            'dry teaspoon': 5,
        },
        metricToUS: {
            'gramsToCup': 1 / 120,
            'gramsToTablespoon': 1 / 15,
            'gramsToTeaspoon': 1 / 5,
        },
    },
    liquid: {
        usToMetric: {
            'cup': 236.588,
            'tablespoon': 14.7868,
            'teaspoon': 4.92892,
        },
        metricToUS: {
            'mlToCup': 1 / 236.588,
            'mlToTablespoon': 1 / 14.7868,
            'mlToTeaspoon': 1 / 4.92892,
        },
    },
};

const convertDryUSToMetric = (ingredients) => {
return ingredients.map((ingredient) => {
    const { name, quantity, unit } = ingredient;
    let convertedQuantity = quantity;
    let convertedUnit = unit;

    if (unit === 'dry cup') {
        convertedQuantity = quantity * conversionRates.dry.usToMetric.cup;
        convertedUnit = 'g';
    } else if (unit === 'dry tablespoon') {
        convertedQuantity = quantity * conversionRates.dry.usToMetric.tablespoon;
        convertedUnit = 'g';
    } else if (unit === 'dry teaspoon') {
        convertedQuantity = quantity * conversionRates.dry.usToMetric['dry teaspoon'];
        convertedUnit = 'g';
    }
    

    return { name, quantity: convertedQuantity, unit: convertedUnit };
});
};

const convertDryMetricToUS = (ingredients) => {
return ingredients.map((ingredient) => {
    const { name, quantity, unit } = ingredient;
    let convertedQuantity = quantity;
    let convertedUnit = unit;

    if (unit === 'g') {
        convertedQuantity = quantity * conversionRates.dry.metricToUS['gramsToCup'];
        convertedUnit = 'dry cup';
    } else if (unit === 'g') {
        convertedQuantity = quantity * conversionRates.dry.metricToUS['gramsToTablespoon'];
        convertedUnit = 'dry tablespoon';
    } else if (unit === 'g') {
        convertedQuantity = quantity * conversionRates.dry.metricToUS['gramsToTeaspoon'];
        convertedUnit = 'dry teaspoon';
    }
    

    return { name, quantity: convertedQuantity, unit: convertedUnit };
});
};

const convertUSToMetric = (ingredients) => {
ingredients = convertDryUSToMetric(ingredients);

const conversionRates = {
    volume: {
        'teaspoon': 4.92892,
        'tablespoon': 14.7868,
        'fl oz': 29.5735,
        'cup': 236.588, 
        'pints': 473.176,
        'quarts': 946.353,
        'gallons': 3785.41,
    },
    weight: {
        'oz': 28.3495,
        'lbs': 453.592,
    }
};

return ingredients.map((ingredient) => {
    const { name, quantity, unit } = ingredient;
    let convertedQuantity = quantity;
    let convertedUnit = unit;

    if (conversionRates.volume[unit]) {
        convertedQuantity = quantity * conversionRates.volume[unit];
        convertedUnit = 'ml';
    }

    else if (conversionRates.weight[unit]) {
        convertedQuantity = quantity * conversionRates.weight[unit];
        convertedUnit = 'g';
    }

    if (typeof convertedQuantity === 'number') {
        convertedQuantity = convertedQuantity.toFixed(2);
    }

    return { name, quantity: convertedQuantity, unit: convertedUnit };
});
};

const convertMetricToUS = (ingredients) => {
ingredients = convertDryMetricToUS(ingredients);

const conversionRates = {
    volume: {
        'ml': 0.033814,
        'l': 1.05669,
    },
    weight: {
        'g': 0.035274,
        'kg': 2.20462,
    }
};

return ingredients.map((ingredient) => {
    const { name, quantity, unit } = ingredient;
    let convertedQuantity = quantity;
    let convertedUnit = unit;

    if (unit === 'ml') {
        convertedQuantity = (quantity * conversionRates.volume.ml).toFixed(2);
        convertedUnit = 'fl oz';
    } else if (unit === 'l') {
        convertedQuantity = (quantity * conversionRates.volume.l).toFixed(2);
        convertedUnit = 'quarts';
    } else if (unit === 'g') {
        convertedQuantity = (quantity * conversionRates.weight.g).toFixed(2);
        convertedUnit = 'oz';
    } else if (unit === 'kg') {
        convertedQuantity = (quantity * conversionRates.weight.kg).toFixed(2);
        convertedUnit = 'lbs';
    }

    return { name, quantity: convertedQuantity, unit: convertedUnit };
});
};

const handleConvertToMetric = () => {
const convertedIngredients = convertUSToMetric(pageContent.ingredients);
handleSavePage({ ...pageContent, ingredients: convertedIngredients });
};


const handleConvertToUS = () => {
const convertedIngredients = convertMetricToUS(pageContent.ingredients);
handleSavePage({ ...pageContent, ingredients: convertedIngredients });
};

const renderContent = () => {
    return (
        <>
            {showForm ? (
                <EditPageForm
                    onSave={handleSavePage}
                    pageId={pageId}
                    recipeStory={pageContent.recipeStory}
                    ingredients={pageContent.ingredients}
                    steps={pageContent.steps}
                />
            ) : (
                <div className='book-header'>
                    <p id='rec-book-title' onClick={() => handleNavigation("./..")}>{title}</p>
                    <div className='recipe-page'>
                        <p className="recipe-name" id='recipe-name'>{pageId}</p>
                        {pageContent && pageContent.recipeStory && (
                            <div className="divider"></div>
                        )}
                        <p className="recipe-story">{pageContent?.recipeStory}</p>
                        <div className="divider"></div>
                        <p className="ingredient-title" id='ingredients'>Ingredients:</p>
                        <div className="ingredient-header">
                            <button onClick={handleConvertToMetric} className="convert-button">Metric</button>
                            <button onClick={handleConvertToUS} className="convert-button">US</button>
                        </div>
                        <ul className="ingredient-list">
                            {pageContent.ingredients && pageContent.ingredients.map((ingredient, index) => {
                                const hasContent = ingredient.name || ingredient.quantity || ingredient.unit;
                                return (
                                    <li key={index} className="ingredient-item">
                                        {hasContent && <code id='ingbullet'>•</code>} {ingredient.quantity} {ingredient.unit} {ingredient.name}
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="divider"></div>
                        {Array.isArray(pageContent.steps) && pageContent.steps.length > 0 ? (
                            <div>
                                <p className="steps" id='steps'>Steps:</p>
                                    <ol className="step-list">
                                        {pageContent.steps.map((step, index) => {
                                            const hasStepContent = step.trim() !== '';
                                            return (
                                                <li key={index} className="step-item">
                                                    {hasStepContent && (
                                                        <>
                                                            <span id='step-count'>Step {index + 1}: </span>
                                                            {step}
                                                        </>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ol>
                                </div>
                            ) : (
                                <p>No steps available.</p>
                            )}

                            {!showForm && (
                                <>
                                    <button onClick={() => setShowForm(true)} className="edit-button">Edit Page</button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </>
        );
    };

    return <div className="page-details">{renderContent()}</div>;
};

export default PageDetails;