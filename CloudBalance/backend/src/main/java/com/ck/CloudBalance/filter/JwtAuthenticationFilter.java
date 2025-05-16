package com.ck.CloudBalance.filter;

import com.ck.CloudBalance.entity.BlackListedToken;
import com.ck.CloudBalance.repository.BlackListedTokenRepository;
import com.ck.CloudBalance.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import static com.ck.CloudBalance.sessionInactivity.TokenActivityTracker.lastActivityMap;


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final BlackListedTokenRepository blackListedTokenRepository;

    public JwtAuthenticationFilter(UserDetailsService userDetailsService,
                                   JwtService jwtService,
                                   BlackListedTokenRepository blackListedTokenRepository) {
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.blackListedTokenRepository = blackListedTokenRepository;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException, java.io.IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        if(blackListedTokenRepository.existsByToken(jwt)){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        LocalDateTime lastActivity = lastActivityMap.get(jwt);
        if (lastActivity != null && lastActivity.plusMinutes(15).isBefore(LocalDateTime.now())) {
            blackListedTokenRepository.save(new BlackListedToken(jwt, LocalDateTime.now()));
            lastActivityMap.remove(jwt);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // Update last activity
        lastActivityMap.put(jwt, LocalDateTime.now());
        userEmail = jwtService.extractUsername(jwt);
        if(userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null){

            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            if(jwtService.isTokenValid(jwt, userDetails)){
                List<Long> cloudAccountIds = jwtService.extractCloudAccountIds(jwt);
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set the cloud account IDs as a request attribute
                request.setAttribute("cloudAccountIds", cloudAccountIds);

                Boolean isImpersonating = jwtService.isImpersonating(jwt);
                if (Boolean.TRUE.equals(isImpersonating)) {
                    String impersonatedBy = jwtService.extractImpersonatedBy(jwt);
                    request.setAttribute("impersonating", true);
                    request.setAttribute("impersonatedBy", impersonatedBy);
                }

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
