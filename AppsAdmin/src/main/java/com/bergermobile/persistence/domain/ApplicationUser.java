package com.bergermobile.persistence.domain;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import org.springframework.data.rest.core.annotation.RestResource;

import lombok.Data;

/**
 * Relationship with BMAuth users with AppsAdmin created applications
 * 
 */
@Table(uniqueConstraints=@UniqueConstraint(columnNames={"userId","application_applicationId"}))
@Entity
@Data
public class ApplicationUser implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer applicationUserId;
	
	@NotNull
	private Integer userId;
	
	@ManyToOne
	@RestResource(exported=false)
	private Application application;
	
}