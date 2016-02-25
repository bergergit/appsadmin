package com.bergermobile.persistence.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.bergermobile.persistence.domain.Application;

//@RepositoryRestResource(excerptProjection=ApplicationProjection.class)
@RepositoryRestResource
@PreAuthorize("hasRole('ROLE_ADMIN')")
public interface ApplicationRepository extends PagingAndSortingRepository<Application, Integer> {
	
	@PreAuthorize("hasAnyRole('ROLE_USER','ROLE_ADMIN')")
	@RestResource(path="byUser", rel="byUser")
	public Iterable<Application> findByApplicationUsersUserId(@Param("userId") Integer userId);
	
	//@PreAuthorize("hasAnyRole('ROLE_USER','ROLE_ADMIN')")
	//Iterable<Application> findAll(Sort sort);

	//@PreAuthorize("hasAnyRole('ROLE_USER','ROLE_ADMIN')")
	//Page<Application> findAll(Pageable pageable);
	
	@PreAuthorize("hasAnyRole('ROLE_USER','ROLE_ADMIN')")
	Iterable<Application> findAll();

	//@PreAuthorize("hasAnyRole('ROLE_USER','ROLE_ADMIN')")
	//Iterable<Application> findAll(Iterable<Integer> ids);

	@PreAuthorize("hasAnyRole('ROLE_USER','ROLE_ADMIN')")
	Application findOne(Integer id);

}
