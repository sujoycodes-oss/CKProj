package com.ck.CloudBalance.globalException;

public class DatabaseException extends RuntimeException {
  public DatabaseException(String message, Throwable cause) {
    super(message, cause);
  }
}

