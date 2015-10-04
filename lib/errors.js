"use strict";

class DecryptionError extends Error {
  constructor(e) {
    super(e);
  }
}

class EncryptionError extends Error {
  constructor(e) {
    super(e);
  }
}

class KeyManagerError extends Error {
  constructor(e) {
    super(e);
  }
}

class VerificationError extends Error {}

module.exports = {
  DecryptionError: DecryptionError,
  EncryptionError: EncryptionError,
  KeyManagerError: KeyManagerError,
  VerificationError: VerificationError
};
