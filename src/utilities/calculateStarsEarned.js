const calculateStarsEarned = (score, data) => {
  const highestScore = data.length * 20;
  const userScore = score;
  const percentage = (userScore / highestScore) * 100;
  const roundedUpPercentage = Math.ceil(percentage);
  let starsEarned;

  if (roundedUpPercentage >= 80) {
    starsEarned = 3; // If percentage is 80% or higher, earn 3 stars
    return 3;
  } else if (roundedUpPercentage > highestScore) {
    starsEarned = 3; // If percentage is 80% or higher, earn 3 stars
    return 3;
  } else if (roundedUpPercentage >= 60) {
    starsEarned = 2; // If percentage is between 60% and 79%, earn 2 stars
    return 2;
  } else if (roundedUpPercentage >= 45) {
    starsEarned = 1; // If percentage is between 45% and 59%, earn 1 star
    return 1;
  } else {
    starsEarned = 0; // If percentage is below 45%, earn 0 stars
    return 0;
  }
  console.log(`Stars earned: ${starsEarned}`);
  console.log(`Number Of Data: ${data.length}`);
};

export default calculateStarsEarned;
