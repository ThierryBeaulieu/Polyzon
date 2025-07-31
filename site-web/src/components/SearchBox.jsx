import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBox.css';

const QuerySelect = {
  ALL_PRODUCTS: 'All_products',
  EXACT_SEARCH: 'Exact_search',
};

function SearchBox() {
  const navigate = useNavigate();
  const [productInput, setProductInput] = useState('');
  const [queryType, setQueryType] = useState(QuerySelect.ALL_PRODUCTS);

  const handleSubmit = (e) => {
    e.preventDefault();
    const isSearchExact = QuerySelect.EXACT_SEARCH === queryType;
    navigate(`/search?productInput=${productInput}&isSearchExact=${isSearchExact}`);
  };

  const handleQueryTypeChange = (e) => {
    setQueryType(e.target.value);
  };

  return (
    <form id='search-form' onSubmit={handleSubmit} action='#'>
      <div className='search-box'>
        <div className='select-wrapper'>
          <select
            name='queryType'
            className='filter-box'
            value={queryType}
            onChange={handleQueryTypeChange}
          >
            <option value={QuerySelect.ALL_PRODUCTS}>Tous les produits</option>
            <option value={QuerySelect.EXACT_SEARCH}>Exact</option>
          </select>
        </div>
        <div className='search-field'>
          <input
            id='search-input'
            type='text'
            placeholder='Rechercher sur Polyzon'
            value={productInput}
            onChange={(e) => setProductInput(e.target.value)}
          />
          <button className='fa fa-lg fa-search search-button' type='submit'></button>
        </div>
      </div>
    </form>
  );
}

export default SearchBox;
