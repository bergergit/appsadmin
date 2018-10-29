package com.bergermobile;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.session.data.redis.config.ConfigureRedisAction;

@SpringBootApplication
@EnableZuulProxy
//@EnableRedisHttpSession
@EnableAsync
public class AppsAdminApplication {

	public static void main(String[] args) {
		SpringApplication.run(AppsAdminApplication.class, args);
	}
	
	/**
	 * @see <a href="http://docs.spring.io/spring-session/docs/current/reference/html5/#api-redisoperationssessionrepository-sessiondestroyedevent>http://docs.spring.io/spring-session/docs/current/reference/html5/#api-redisoperationssessionrepository-sessiondestroyedevent</a>
	 * @return
	 */
	@Bean
	public static ConfigureRedisAction configureRedisAction() {
	    return ConfigureRedisAction.NO_OP;
	}

}
