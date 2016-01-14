package com.bergermobile.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		//http.csrf().disable();
		http.httpBasic().disable();
		
		// @formatter:off
		http
			.authorizeRequests()
			.antMatchers(HttpMethod.GET, "/", "/fonts/**", "/webjars/**", "/messageBundle/**",
					"/fragments/**","/login/**","/bmauth/**", "/rest/**")
				.permitAll()
			.antMatchers(HttpMethod.POST, "/bmauth/logout")
				.permitAll()
			.antMatchers(HttpMethod.POST, "/bmauth/**")
				.hasRole("ADMIN")
			.antMatchers(HttpMethod.GET, "/admin/**")
				.hasRole("ADMIN")
			.anyRequest()
				.authenticated()
			.and()
				.formLogin()
				.loginPage("/")
				.permitAll()
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
