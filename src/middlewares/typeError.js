const handleValidationError = (err, res) => {
  let errors = Object.values(err.errors).map((el) => el.message);

  if (errors.length > 1) {
    const msgErr = errors.join(" || ");
    res.status(400).send({ message: msgErr });
  } else {
    res.status(400).send({ messages: errors[0] });
  }
};

const typeError = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    // Mongoose validation error
    return handleValidationError(err, res);
  }

  if (err.code === 11000) {
    // Mongoose unique constraint error (e.g duplicate email)
    const duplicatedField = Object.keys(err.keyPattern)[0];
    return res.status(400).send({
      message: `Duplicated field values: ${duplicatedField} already exists.`,
    });
  }

  if (err.origin === "user") {
    console.warn("Error came from user registration.");
    return res.status(400).send({
      message: "There was an error while trying to regist a user",
    });
  }

  console.error(err);
  res.status(500).send({
    message: "There was a problem",
    error: err,
  });
};

module.exports = { typeError };
