// Validate email
export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  // Validate password strength
  export const isValidPassword = (password) => {
    // Password should be at least 8 characters with at least one uppercase, one lowercase, and one number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };
  
  // Validate name (letters and spaces only)
  export const isValidName = (name) => {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(name);
  };
  