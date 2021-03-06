package com.bergermobile.persistence.domain;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import org.springframework.data.rest.core.annotation.RestResource;

/**
 * The persistent class for the field database table.
 * 
 */
@Entity
@Data
@EqualsAndHashCode(of={"fieldId"})
@ToString(of={"fieldId","name","restName", "fieldOrder"})
public class Field implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer fieldId;

	private String description;

	@Lob
	private String extras;

	private Boolean frontpage;

	private int level;

	private String name;

	private int fieldOrder;

	private String restName;

	// bi-directional many-to-one association to Content
	@OneToMany(mappedBy = "field")
	@OrderBy("groupId")
	@RestResource(exported=false)
	private List<Content> contents;

	// bi-directional many-to-one association to Type
	@ManyToOne
	@RestResource(exported=false)
	private Type type;

	// bi-directional many-to-one association to Menu
	@ManyToOne
	private Menu menu;

}