'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const propertyTypes = ['Apartment', 'House', 'Villa', 'Cottage'];

export default function PropertyFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [beds, setBeds] = useState(searchParams.get('beds') || '');
  const [baths, setBaths] = useState(searchParams.get('baths') || '');
  const [min, setMin] = useState(searchParams.get('min') || '');
  const [max, setMax] = useState(searchParams.get('max') || '');
  const [from, setFrom] = useState(searchParams.get('from') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (search) params.set('search', search);
    if (type) params.set('type', type);
    if (beds) params.set('beds', beds);
    if (baths) params.set('baths', baths);
    if (min) params.set('min', min);
    if (max) params.set('max', max);
    if (from) params.set('from', from);
    if (sort) params.set('sort', sort);

    // Always reset page to 1 on new filter
    params.set('page', '1');

    router.push(`/properties?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch('');
    setType('');
    setBeds('');
    setBaths('');
    setMin('');
    setMax('');
    setFrom('');
    setSort('newest');
    router.push('/properties');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 border rounded-lg bg-white shadow"
    >
      <div className="col-span-2">
        <label className="block text-sm font-medium">Search</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Title or location"
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Any</option>
          {propertyTypes.map((pt) => (
            <option key={pt} value={pt}>
              {pt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Sort by</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Bedrooms</label>
        <input
          type="number"
          value={beds}
          onChange={(e) => setBeds(e.target.value)}
          min="0"
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Bathrooms</label>
        <input
          type="number"
          value={baths}
          onChange={(e) => setBaths(e.target.value)}
          min="0"
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Min Price</label>
        <input
          type="number"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          min="0"
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Max Price</label>
        <input
          type="number"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          min="0"
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Available From</label>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div className="md:col-span-4 flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="w-full sm:w-auto bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Reset Filters
        </button>
      </div>
    </form>
  );
}

