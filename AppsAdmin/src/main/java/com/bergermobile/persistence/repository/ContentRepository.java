package com.bergermobile.persistence.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.bergermobile.persistence.domain.Content;

@RepositoryRestResource
@PreAuthorize("hasAnyRole('ROLE_USER','ROLE_ADMIN')")
public interface ContentRepository extends CrudRepository<Content, Integer> {
	
	public Integer deleteByGroupId(String groupId);

	public List<Content> findByGroupId(String groupId);
}
