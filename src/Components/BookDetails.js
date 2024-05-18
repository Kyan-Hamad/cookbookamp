import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../Styles/BookDetails.css';
import { listBooks } from '../graphql/queries';
import {updateBook as updateBookMutation } from '../graphql/mutations';
import { getUrl } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/api';
import AddToContentsForm from './AddtoContentsForm';

const client = generateClient();

const BookDetails = () => {
    const { title } = useParams();
    const [tableOfContents, setTableOfContents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [pageId, setPageId] = useState(null);
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    async function fetchBooks() {
        try {
            const apiData = await client.graphql({ query: listBooks });
            const booksFromAPI = apiData.data.listBooks.items;
            await Promise.all(
                booksFromAPI.map(async (book) => {
                    if (book.imagePath) {
                        const url = await getUrl({ key: book.imagePath });
                        book.image = url.url;
                    }
                    return book;
                })
            );
            setBooks(booksFromAPI);

            const currentBook = booksFromAPI.find((book) => book.title === title);
            if (currentBook && currentBook.tableOfContents) {
                setTableOfContents(currentBook.tableOfContents.split('\n'));
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }

    const handleContentClick = (content) => {
        if (content && content.startsWith && content.startsWith('<a href=')) {
            const url = content.split('"')[1];
            navigate(`/books/${title}/${url}`);
        } else {
            setPageId(content);
            setShowForm(true);
        }
    };

    const renderContent = (content, index) => {
        if (content && content.startsWith && content.startsWith('<a href=')) {
            const url = content.split('"')[1];
            const text = content.match(/>([^<]*)<\/a>/)[1];

            return (
                <span className="link" onClick={() => navigate(`/books/${title}/${url}`)}>
                    <span>{text}</span>
                </span>
            );
        } else {
            return <span className="header-3">{content}</span>;
        }
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(tableOfContents);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setTableOfContents(items);

        try {
            const apiData = await client.graphql({
                query: listBooks,
                variables: { filter: { title: { eq: title } } },
            });

            const book = apiData.data.listBooks.items[0];
            await client.graphql({
                query: updateBookMutation,
                variables: {
                    input: {
                        id: book.id,
                        tableOfContents: items.join('\n')
                    }
                }
            });
        } catch (error) {
            console.error('Error updating table of contents:', error);
        }
    };

    return (
        <div className='Book-Page'>
            <h2>{title}</h2>
            <h5>Table of Contents:</h5>
            <DragDropContext onDragEnd={onDragEnd}>
                {tableOfContents.length > 0 && (
                    <Droppable droppableId="table-of-contents-list">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {tableOfContents.map((content, index) => (
                                    <Draggable key={index} draggableId={`content-${index}`} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className="drag-handle"
                                            >
                                                <span
                                                    {...provided.dragHandleProps}
                                                    onClick={() => handleContentClick(content)}
                                                >
                                                    {renderContent(content, index)}
                                                </span>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                )}
            </DragDropContext>
            <div className="add-button-container">
                <button className="add-button" onClick={() => setShowForm(true)}>Add Content</button>
            </div>
            {showForm && !pageId && <AddToContentsForm title={title} tableOfContents={tableOfContents} setTableOfContents={setTableOfContents} setShowForm={setShowForm} />}
        </div>
    );
};

export default BookDetails;
