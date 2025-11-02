// Goal: Stable, typed-ish error mapping by class or name.1000
const { HTTP } = require('./http');

/**
 * @param {unknown} e
 * @returns {e is AppError}
 */
class AppError extends Error {
  /** @type {string} */ code;
  /** @type {number} */ statusCode;
  /** @type {boolean} */ isOperational;

  /**
   * @param {string} message
   * @param {string} code
   * @param {number} statusCode
   * @param {{ cause?: unknown }} [opts]
   */
  constructor(message, code, statusCode, opts = {}) {
    super(message);
    if (opts && 'cause' in opts) this.cause = opts.cause;

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
    if (Error.captureStackTrace) Error.captureStackTrace(this, new.target);

    const normalizedCode = String(code || 'APP_ERROR').toUpperCase();
    const normalizedStatus = Number.isInteger(statusCode) ? statusCode : 500;

    // Declare + lock the fields (checker now knows they exist)
    Object.defineProperties(this, {
      code: { value: normalizedCode, enumerable: true },
      statusCode: { value: normalizedStatus, enumerable: true },
      isOperational: { value: true, enumerable: false },
    });
  }
}

/** @extends AppError */
class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 'BAD_REQUEST', HTTP.BAD_REQUEST);
  }
}

/** @extends AppError */
class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', HTTP.UNAUTHORIZED);
  }
}

/** @extends AppError */
class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(message, 'NOT_FOUND', HTTP.NOT_FOUND);
  }
}

/** @extends AppError */
class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 'CONFLICT', HTTP.CONFLICT);
  }
}

/** @extends AppError */
// ConfigError is usually thrown at startup, but if it ever surfaces in HTTP, 500 is OK
class ConfigError extends AppError {
  constructor(message = 'Invalid configuration') {
    super(message, 'CONFIG_ERROR', HTTP.INTERNAL_SERVER_ERROR);
  }
}

function getName(err) {
  return err &&
    typeof err === 'object' &&
    'name' in err &&
    typeof err.name === 'string'
    ? err.name
    : '';
}

function getMessageOr(defaultMsg, err) {
  return err &&
    typeof err === 'object' &&
    'message' in err &&
    typeof err.message === 'string'
    ? err.message
    : defaultMsg;
}

function toHttp(err) {
  if (err instanceof AppError) {
    return {
      status: err.statusCode,
      body: { error: err.code, message: err.message },
    };
  }

  const name = getName(err);

  switch (name) {
    case 'BadRequestError':
    case 'ValidationError':
    case 'ZodError':
      return {
        status: HTTP.BAD_REQUEST,
        body: {
          error: 'BAD_REQUEST',
          message: getMessageOr('Invalid input', err),
        },
      };
    case 'UnauthorizedError':
      return {
        status: HTTP.UNAUTHORIZED,
        body: {
          error: 'UNAUTHORIZED',
          message: getMessageOr('Unauthorized', err),
        },
      };
    case 'NotFoundError':
      return {
        status: HTTP.NOT_FOUND,
        body: { error: 'NOT_FOUND', message: getMessageOr('Not found', err) },
      };
    case 'ConflictError':
      return {
        status: HTTP.CONFLICT,
        body: { error: 'CONFLICT', message: getMessageOr('Conflict', err) },
      };
    default:
      return {
        status: HTTP.INTERNAL_SERVER_ERROR,
        body: {
          error: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong',
        },
      };
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  ConfigError,
  toHttp,
};

// Notes: We purposely don't include err.stack or raw err.message for unknown errors (security).
// For known validation paths we return the message because it's user input related
