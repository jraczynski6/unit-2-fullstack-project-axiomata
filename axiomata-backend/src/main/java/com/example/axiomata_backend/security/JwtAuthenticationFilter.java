package com.example.axiomata_backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        // 1. Get the Authorization header from the request
        final String authHeader = request.getHeader("Authorization");

        // Debug: log incoming request and header
        System.out.println("JWT Filter: Incoming request " + request.getMethod() + " " + request.getRequestURI());
        System.out.println("Authorization header: " + authHeader);

        String username = null;
        String jwt = null;

        // 2. Check if header starts with "Bearer"
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7).trim(); // trim removes newline or spaces
            System.out.println("JWT Filter: Token received = " + jwt);

            try {
                username = jwtUtil.extractUsername(jwt); // get username from token
                System.out.println("JWT Filter: Username extracted = " + username);
            } catch (Exception e) {
                System.out.println("JWT Filter: Error extracting username - " + e.getMessage());
            }
        } else {
            System.out.println("JWT Filter: No Bearer token found or header malformed");
        }

        // 3. proceed if user is not already authenticated
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 4. Validate the token (no UserDetails needed)
            if (jwtUtil.validateToken(jwt)) {

                // 5. Create authentication token manually
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                username, // principal is just username now
                                null,     // no credentials
                                null      // no roles for MVP
                        );

                // 6. Set request details
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 7. Set authentication
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("JWT Filter: SecurityContext set for " + username);
            } else {
                System.out.println("JWT Filter: Token invalid or expired");
            }
        }

        // 8. Continue the filter chain
        filterChain.doFilter(request, response);
    }
}
