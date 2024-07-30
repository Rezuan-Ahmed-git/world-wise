import { createContext, useState, useEffect, useContext } from 'react';

const BASE_URL = 'http://localhost:8002';

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(function () {
    async function fetchCities() {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch {
        alert('There was an error loading data...');
      } finally {
        setLoading(false);
      }
    }

    fetchCities();
  }, []);

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined)
    throw new Error('Citites context was used outside the CitiesProvider');

  return context;
}

export { CitiesProvider, useCities };
