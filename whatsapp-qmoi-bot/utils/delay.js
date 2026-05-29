// Utility helper: simple async delay
module.exports = function delay(ms) {
  try {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}