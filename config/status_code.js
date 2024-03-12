'use strict';

export const HttpStatusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  UNAUTHERISED: 401,
  EXPIRED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
};
export const ErrorCodes = {
  1001: { message: 'Validation error', code: 1001 },
  1002: { message: 'Not found', code: 1002 },
  1003: { message: 'Internal Server Error', code: 1003 },
  1004: { message: 'Unauthorized', code: 1004 },
  1005: { message: 'Forbidden', code: 1005 },
  1009: { message: 'Expired', code: 1009 },
};

export const TimeRegex = new RegExp("^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$")
