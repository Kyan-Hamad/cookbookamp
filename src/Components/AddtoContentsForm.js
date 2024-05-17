import React, { useState } from 'react';
import { createPage as createPageMutation, updateBook as updateBookMutation } from '../graphql/mutations';
import { generateClient } from 'aws-amplify/api';
import { listBooks } from '../graphql/queries';
import '../Styles/AddToContentsForm.css';

const client = generateClient();

const AddToContentsForm = ({ title, tableOfContents, setTableOfContents, setShowForm }) => {
    const [pageId, setPageId] = useState('');
    const [isLink, setIsLink] = useState(false);

    const handleContentChange = (e) => {
        setPageId(e.target.value);
    };

    const handleCheckboxChange = (e) => {
        setIsLink(e.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let contentToAdd = pageId;
        if (isLink) {
            contentToAdd = `<a href="${pageId}">${pageId}</a>`;
        }

        try {
            const apiData = await client.graphql({
                query: listBooks,
                variables: { filter: { title: { eq: title } } },
            });

            if (apiData.data.listBooks.items.length === 0) {
                console.error(`No book found with title: ${title}`);
                return;
            }

            const book = apiData.data.listBooks.items[0];
            const bookId = book.id;

            const pageData = {
                bookId,
                bookTitle: title,
                pageId: pageId,
                recipeStory: ["story"],
                ingredients: [],
                steps: []
            };

            await client.graphql({
                query: createPageMutation,
                variables: { input: pageData }
            });

            const updatedTableOfContents = [...tableOfContents, contentToAdd];
            await client.graphql({
                query: updateBookMutation,
                variables: {
                    input: {
                        id: bookId,
                        tableOfContents: updatedTableOfContents.join('\n')
                    }
                }
            });

            setTableOfContents(updatedTableOfContents);
            setPageId('');
            setShowForm(false);
        } catch (error) {
            console.error('Error adding content:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor='pageId'>Add Content:</label>
            <input
                type='text'
                id='pageId'
                value={pageId}
                onChange={handleContentChange}
                required
            />
            <label>
                Make Link:
                <input
                    type="checkbox"
                    checked={isLink}
                    onChange={handleCheckboxChange}
                />
            </label>
            <button type="submit" className="add-button">Add Content</button>
        </form>
    );
};

export default AddToContentsForm;
