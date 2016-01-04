package com.bergermobile.persistence.domain;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the type database table.
 * 
 */
@Entity
public class Type implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="type_id")
	private Integer typeId;

	private String description;

	@Lob
	private String input;

	@Column(name="mime_type")
	private String mimeType;

	private byte removable;

	//bi-directional many-to-one association to Field
	@OneToMany(mappedBy="type")
	private List<Field> fields;

	public Type() {
	}

	public Integer getTypeId() {
		return this.typeId;
	}

	public void setTypeId(Integer typeId) {
		this.typeId = typeId;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getInput() {
		return this.input;
	}

	public void setInput(String input) {
		this.input = input;
	}

	public String getMimeType() {
		return this.mimeType;
	}

	public void setMimeType(String mimeType) {
		this.mimeType = mimeType;
	}

	public byte getRemovable() {
		return this.removable;
	}

	public void setRemovable(byte removable) {
		this.removable = removable;
	}

	public List<Field> getFields() {
		return this.fields;
	}

	public void setFields(List<Field> fields) {
		this.fields = fields;
	}

	public Field addField(Field field) {
		getFields().add(field);
		field.setType(this);

		return field;
	}

	public Field removeField(Field field) {
		getFields().remove(field);
		field.setType(null);

		return field;
	}

}