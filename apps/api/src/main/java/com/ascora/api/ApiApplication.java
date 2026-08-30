package com.ascora.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * the server's main file
 * ApiApplication
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class ApiApplication {

	/**\
	 * the main function
	 */
	public static void main(String[] args) {
		SpringApplication.run(ApiApplication.class, args);
	}

}
