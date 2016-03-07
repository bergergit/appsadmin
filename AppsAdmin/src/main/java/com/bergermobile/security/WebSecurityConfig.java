package com.bergermobile.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;


/**
 * Security config
 * 
 * @author fabioberger
 *
 */
@Configuration
@EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true) 
public class WebSecurityConfig {
	
	/**
	 * Used for form login security for the rest api
	 * @author fabioberger
	 *
	 */
	@Configuration
    @Order(1)                                                        
    public static class RestWebSecurityConfigurationAdapter extends WebSecurityConfigurerAdapter {
		protected void configure(HttpSecurity http) throws Exception {
			//http.csrf().disable();
			// @formatter:off
            http.antMatcher("/rest/**")                               
                .authorizeRequests()
                    .anyRequest().hasAnyRole("ADMIN", "USER")
                    .and()
                .httpBasic();
         // @formatter:on
        }
	}
	
	/**
	 * Used for form login security for the screens
	 * @author fabioberger
	 *
	 */
	@Configuration 
    public static class FormLoginWebSecurityConfigurerAdapter extends WebSecurityConfigurerAdapter {

		@Override
		protected void configure(HttpSecurity http) throws Exception {
			//http.csrf().disable();
			
			// @formatter:off
			http
				.authorizeRequests()
				.antMatchers(HttpMethod.GET, "/", "/fonts/**", "/webjars/**", "/messageBundle/**",
						"/fragments/**","/login/**","/bmauth/**","/mobileapps/contents/**", "/files/**")
					.permitAll()
				.antMatchers(HttpMethod.POST, "/bmauth/logout")
					.permitAll()
				.antMatchers(HttpMethod.POST, "/rest/contents")
					.hasAnyRole("USER", "ADMIN")
				.antMatchers(HttpMethod.GET, "/admin","/users","/rest/contents","/rest/applications/**")
					.hasRole("USER")
				//.antMatchers(HttpMethod.POST, "/bmauth/**")
				//	.hasRole("ADMIN")
				.antMatchers(HttpMethod.GET, "/admin","/users")
					.hasRole("ADMIN")
				.anyRequest()
					.authenticated()
				.and()
					.formLogin()
					.loginPage("/login?reset")
				.and()
					.logout().logoutUrl("/logout")
				.and()
	            	.addFilterAfter(new CsrfHeaderFilter(), CsrfFilter.class)
	            	.csrf().csrfTokenRepository(csrfTokenRepository());
			// @formatter:on
		}
		
		private CsrfTokenRepository csrfTokenRepository() {
			HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
			repository.setHeaderName("X-XSRF-TOKEN");
			return repository;
		}
	}
	
}
