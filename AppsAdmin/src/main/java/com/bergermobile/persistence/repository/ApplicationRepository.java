package com.bergermobile.persistence.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.bergermobile.persistence.domain.Application;
import com.bergermobile.persistence.domain.projection.ApplicationProjection;

@RepositoryRestResource(excerptProjection=ApplicationProjection.class)
public interface ApplicationRepository extends PagingAndSortingRepository<Application, Integer> {

}
