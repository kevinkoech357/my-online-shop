// Capitalize the first letter of users first and last names
const capitalizeFirstLetter = async (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default capitalizeFirstLetter;
