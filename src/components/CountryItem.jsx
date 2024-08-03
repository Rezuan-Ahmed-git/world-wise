import styles from './CountryItem.module.css';

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <span>
        <img
          src={`https://flagcdn.com/32x24/${country.emoji.toLowerCase()}.png`}
          alt={country.country}
        />
      </span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
