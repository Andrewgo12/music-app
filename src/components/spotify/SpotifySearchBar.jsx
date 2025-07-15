import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

function SpotifySearchBar({ onSearch, placeholder = "What do you want to listen to?" }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-md">
      <div className={`relative flex items-center bg-white rounded-full transition-all duration-200 ${
        isFocused ? 'ring-2 ring-white' : ''
      }`}>
        <Search 
          size={16} 
          className="absolute left-3 text-black" 
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full py-2 pl-10 pr-10 text-black text-sm bg-transparent rounded-full focus:outline-none placeholder-gray-600"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={14} className="text-black" />
          </button>
        )}
      </div>
    </form>
  );
}

export default SpotifySearchBar;
