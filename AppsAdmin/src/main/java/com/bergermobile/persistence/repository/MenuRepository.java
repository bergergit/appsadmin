package com.bergermobile.persistence.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.bergermobile.persistence.domain.Menu;

@RepositoryRestResource
public interface MenuRepository extends CrudRepository<Menu, Integer> {

}
