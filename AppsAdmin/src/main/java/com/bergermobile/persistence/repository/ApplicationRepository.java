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
	
	@RestResource(path="byUser", rel="byUser")
	public Iterable<Application> findByApplicationUsersUserId(@Param("userId") Integer userId);

}
