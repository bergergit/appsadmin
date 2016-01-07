package com.bergermobile;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;

@SpringBootApplication
//@EnableZuulProxy
@EnableRedisHttpSession
public class AppsAdminApplication {

	public static void main(String[] args) {
		SpringApplication.run(AppsAdminApplication.class, args);
	}
}
