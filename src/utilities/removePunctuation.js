const removePunctuation = (text) => {
  // Define punctuation characters to be removed
  const punctuation = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
  // Remove punctuation characters using regular expression
  return text.replace(punctuation, "");
};

export default removePunctuation;
