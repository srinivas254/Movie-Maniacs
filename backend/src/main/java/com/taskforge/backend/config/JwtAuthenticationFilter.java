package com.taskforge.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper = new ObjectMapper();
    @Autowired
    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    private void handleException(HttpServletResponse response, int status, String type, Exception ex){
        response.setStatus(status);
        response.setContentType("application/json");
        try{
            String json = objectMapper.writeValueAsString(Map.of("error",type + ": " + ex.getMessage()));
            response.getWriter().write(json);
        }catch(IOException ignored){
        }
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                    FilterChain filterChain) {
        try {
            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                Claims claims = jwtUtil.validateToken(token);

                String id = jwtUtil.getUserId(claims);
                String userName = jwtUtil.getUserName(claims);

                CustomPrincipal principal = new CustomPrincipal(id,userName);

                List<SimpleGrantedAuthority> authorities = List.of(
                        new SimpleGrantedAuthority(
                                "ROLE_" + jwtUtil.getUserRole(claims)));

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        principal, null, authorities);


                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
            filterChain.doFilter(request, response);
        } catch(ExpiredJwtException ex){
            SecurityContextHolder.clearContext();
            handleException(response, HttpServletResponse.SC_UNAUTHORIZED,"Token expired", ex);
        } catch(MalformedJwtException ex){
            SecurityContextHolder.clearContext();
            handleException(response, HttpServletResponse.SC_BAD_REQUEST,"Token malformed", ex);
        } catch(JwtException ex){
            SecurityContextHolder.clearContext();
            handleException(response, HttpServletResponse.SC_UNAUTHORIZED,"Invalid token", ex);
        } catch(ServletException ex){
            handleException(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR ,"Servlet error", ex);
        } catch(IOException ex){
            handleException(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,"IO error", ex);
        }
    }

}
