package com.bergermobile.persistence.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.bergermobile.persistence.domain.Application;
import com.bergermobile.persistence.domain.projection.ApplicationProjection;

@RepositoryRestResource(excerptProjection=ApplicationProjection.class)
@PreAuthorize("hasRole('ROLE_ADMIN')")
public interface ApplicationRepository extends PagingAndSortingRepository<Application, Integer> {

}
