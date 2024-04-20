import { useSearchParams } from 'react-router-dom';

// we get lat and lng from the url using useSearchParams custom hook provided by react router
export function useUrlPosition() {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  return [lat, lng];
}
