const saveUserDataToLocalStorage = (userData) => {
  try {
    localStorage.setItem("userData", userData);
    console.log("User data saved successfully!");
  } catch (error) {
    console.log(`Error saving user data to localStorage:, ${error}`);
  }
};

const getUserDataFromLocalStorage = () => {
  try {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const jsonUserData = JSON.parse(userData);
      console.log("User data retrieved successfully");
      return jsonUserData;
    } else {
      console.log("No user data found in localStorage.");
      return null;
    }
  } catch (error) {
    console.log(`Error retrieving user data from localStorage:, ${error}`);
    return null;
  }
};

const removeUserDataFromLocalStorage = () => {
  try {
    localStorage.removeItem("userData");
  } catch (error) {
    console.log(`Error Removing User Data From Local Storage:, ${error}`);
  }
};

export {
  saveUserDataToLocalStorage,
  getUserDataFromLocalStorage,
  removeUserDataFromLocalStorage,
};
