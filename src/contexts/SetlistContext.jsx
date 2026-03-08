import React, { createContext, useContext, useState } from 'react';
import { useApi } from '../composables/useApi.js';

const SetlistContext = createContext();

export const useSetlist = () => {
  const context = useContext(SetlistContext);
  if (!context) {
    throw new Error('useSetlist must be used within a SetlistProvider');
  }
  return context;
};

export const SetlistProvider = ({ children }) => {
  const today = Date.now();
  const { api } = useApi();
  const [band, setBand] = useState("");
  const [yearOf, setYearOf] = useState(new Date(today).getFullYear());
  const [setlists, setSetlists] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchBandSetlists = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.searchBandSetlists(band, yearOf);
      const transformedData = response.map((item) => ({
        setlist: item,
        set: item?.sets,
      }));
      setSetlists(transformedData);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError(err.response?.data?.error || "An error occurred.");
      await api.logError(JSON.stringify(err));
    }
  };

  const clearSetlists = () => {
    setSetlists([]);
  };

  const updateBand = (newBand) => {
    setBand(newBand);
  };

  const updateYear = (newYear) => {
    setYearOf(newYear);
  };

  const value = {
    band,
    yearOf,
    setlists,
    error,
    loading,
    searchBandSetlists,
    clearSetlists,
    updateBand,
    updateYear
  };

  return (
    <SetlistContext.Provider value={value}>
      {children}
    </SetlistContext.Provider>
  );
};
