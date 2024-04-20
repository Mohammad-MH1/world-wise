// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import styles from './Form.module.css';
import Button from './Button';
import BackButton from './BackButton';
import { useUrlPosition } from '../hooks/useUrlPosition';
import Message from './Message';
import Spinner from './Spinner';
import { useCities } from '../contexts/CitiesContext';
import { useNavigate } from 'react-router-dom';

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

// this api will do the reverse geocoding for us, and we should include  lat and lng that we get from the url , when we are requesting
const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

function Form() {
  const [lat, lng] = useUrlPosition();
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [isLoadingGeo, setIsLoadingGeo] = useState(false);
  const [emoji, setEmoji] = useState('');
  const [geoError, setGeoError] = useState('');
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!lat && !lng) return;
      async function fetchCityData() {
        try {
          setIsLoadingGeo(true);
          setGeoError('');
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          // if we click on an unknown place in the map (for example : middle of the sea) , we get this error
          if (!data.countryCode)
            throw new Error(
              `That doesn't seem to be a city. Click somewhere else`
            );

          setCityName(data.city || data.locality || '');
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          setGeoError(err.message);
        } finally {
          setIsLoadingGeo(false);
        }
      }

      fetchCityData();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    await createCity(newCity);
    navigate('/app');
  }

  // if we doesn't have a city list yet, this message will appear
  if (!lat && lng)
    return <Message message='start by clicking somewhere on the map' />;
  if (isLoadingGeo) return <Spinner />;
  if (geoError) return <Message message={geoError} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ''}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor='cityName'>City name</label>
        <input
          id='cityName'
          onChange={e => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor='date'>When did you go to {cityName}?</label>
        {/* <input id='date' onChange={e => setDate(e.target.value)} value={date} /> */}
        <DatePicker
          id='date'
          selected={date}
          onChange={date => setDate(date)}
          dateFormat='dd/MM/yyyy'
        />
      </div>

      <div className={styles.row}>
        <label htmlFor='notes'>Notes about your trip to {cityName}</label>
        <textarea
          id='notes'
          onChange={e => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
