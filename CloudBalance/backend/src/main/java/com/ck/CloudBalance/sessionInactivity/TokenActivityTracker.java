package com.ck.CloudBalance.sessionInactivity;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TokenActivityTracker {
    public static final ConcurrentHashMap<String, LocalDateTime> lastActivityMap = new ConcurrentHashMap<>();
}