import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../Styles/PageDetails.css';
import { getPage as getPageQuery} from '../graphql/queries';
import { createPage as createPageMutation, updatePage as updatePageMutation } from '../graphql/mutations';
import { generateClient } from 'aws-amplify/api';
import EditPageForm from './EditPageForm';

const client = generateClient();

const PageDetails = () => {
    const { title, pageId } = useParams();
    const [pageContent, setPageContent] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchPageContent();
    }, [pageId]);

    async function fetchPageContent() {
        try {
            const apiData = await client.graphql({
                query: getPageQuery,
                variables: { id: pageId },
            });

            const pageData = apiData.data.getPage;

            // If the page data doesn't exist, set the page content to null
            if (!pageData) {
                setPageContent(null);
            } else {
                setPageContent(pageData);
            }
        } catch (error) {
            console.error('Error fetching page content:', error);
        }
    }

    const handleSavePage = async (newPageContent) => {
        try {
            if (pageContent === null) {
                // If the page doesn't exist yet, create it
                await client.graphql({
                    query: createPageMutation,
                    variables: {
                        input: {
                            id: pageId,
                            title: title,
                            content: newPageContent,
                        }
                    }
                });
            } else {
                // If the page exists, update it
                await client.graphql({
                    query: updatePageMutation,
                    variables: {
                        input: {
                            id: pageId,
                            title: title,
                            content: newPageContent,
                        }
                    }
                });
            }

            // Fetch the updated page content
            fetchPageContent();
            setShowForm(false);
        } catch (error) {
            console.error('Error saving page:', error);
        }
    };

    return (
        <div className="page-details">
            <h2>{title}</h2>
            {pageContent ? (
                <div>
                    <h3>Page ID: {pageId}</h3>
                    <p>{pageContent.content}</p>
                    <button onClick={() => setShowForm(true)} className="edit-button">
                        Edit Page
                    </button>
                    {showForm && (
                        <EditPageForm
                            initialContent={pageContent.content}
                            onSave={handleSavePage}
                            setShowForm={setShowForm}
                        />
                    )}
                </div>
            ) : (
                <div>
                    <p>Loading page content...</p>
                    <button onClick={() => setShowForm(true)} className="edit-button">
                        Create Page
                    </button>
                    {showForm && (
                        <EditPageForm
                            initialContent=""
                            onSave={handleSavePage}
                            setShowForm={setShowForm}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default PageDetails;
