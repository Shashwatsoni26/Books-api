import React, { useEffect, useState } from 'react';
import './style.css';

function Main() {
    const [booksBySubjects, setBooksBySubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
//book api
//shashwat
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const urls = [
                    "https://openlibrary.org/subjects/thriller.json?details=true",
                    "https://openlibrary.org/subjects/love.json?details=true",
                    "https://openlibrary.org/subjects/kids.json?details=true",
                    "https://openlibrary.org/subjects/romance.json?details=true",
                ];

                const responses = await Promise.all(urls.map(url => fetch(url)));
                const results = await Promise.all(responses.map(response => response.json()));

                setBooksBySubjects(results);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchBooks();
    }, []);

    useEffect(() => {
        // Filter books by search term
        const filteredBooks = booksBySubjects.map(subject => ({
            ...subject,
            works: subject.works.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()))
        }));
        setSearchResults(filteredBooks);
    }, [searchTerm, booksBySubjects]);

    // Function to handle search input change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by book title"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button>Search</button>
            </div>
            {searchResults.map((booksBySubject, index) => (
                <div key={index}>
                    <h3>{booksBySubject?.name}</h3>
                    {booksBySubject?.works?.map((bookInfo, index) => (
                        <div className="book-wrapper" key={index}>
                            <div className="second">
                                <h3>{bookInfo.title}</h3>
                                <div className="image" key={index}>
                                    <img src={`http://covers.openlibrary.org/b/id/${bookInfo.cover_id}-M.jpg`} alt="cover_id" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </>
    );
}

export default Main;
