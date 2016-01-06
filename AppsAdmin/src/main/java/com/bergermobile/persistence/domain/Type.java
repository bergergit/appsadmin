package com.bergermobile.persistence.domain;

import java.io.Serializable;

import javax.persistence.*;

import java.util.List;

import lombok.Getter;


/**
 * The persistent class for the type database table.
 * 
 */
@Entity
@Getter
public class Type implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer typeId;

	private String description;

	@Lob
	private String input;

	private String mimeType;

	private byte removable;

	//bi-directional many-to-one association to Field
	@OneToMany(mappedBy="type")
	private List<Field> fields;
}