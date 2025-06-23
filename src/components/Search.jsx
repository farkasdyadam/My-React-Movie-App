import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {

    return (
        <div className="search">
            <div>
                <img src="search.svg" alt="search"/>
                <input
                    placeholder="Search through thousands of movies"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                />
            </div>
        </div>
    )
}
export default Search
