import React from 'react';
import { useSetlist } from '../contexts/SetlistContext';
import SearchBar from './SearchBar.jsx';
import Spinner from 'react-bootstrap/Spinner';

const SetlistSearch = () => {
  const { yearOf, loading, searchBandSetlists, updateYear, error, setlists } = useSetlist();
  let date = new Date();

  if (setlists.length > 0) {
    return null;
  }

  return (
    <form onSubmit={searchBandSetlists} className="mb-4">
      <div className="mb-2">
        <SearchBar />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Year
        </label>
        <input
          type="number"
          value={yearOf}
          onChange={(e) => updateYear(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          placeholder={date.getFullYear()}
          required
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
      >
        {loading ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="mr-2"
          />
        ) : (
          "Search Setlists"
        )}
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default SetlistSearch;
