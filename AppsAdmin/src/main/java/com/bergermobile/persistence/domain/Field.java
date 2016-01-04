package com.bergermobile.persistence.domain;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the field database table.
 * 
 */
@Entity
public class Field implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="field_id")
	private Integer fieldId;

	private String description;

	@Lob
	private String extras;

	private byte frontpage;

	private int level;

	private String name;

	private int fieldOrder;

	@Column(name="rest_name")
	private String restName;

	//bi-directional many-to-one association to Content
	@OneToMany(mappedBy="field")
	private List<Content> contents;

	//bi-directional many-to-one association to Type
	@ManyToOne
	private Type type;

	//bi-directional many-to-one association to Menu
	@ManyToOne
	private Menu menu;

	public Field() {
	}

	public Integer getFieldId() {
		return this.fieldId;
	}

	public void setFieldId(Integer fieldId) {
		this.fieldId = fieldId;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getExtras() {
		return this.extras;
	}

	public void setExtras(String extras) {
		this.extras = extras;
	}

	public byte getFrontpage() {
		return this.frontpage;
	}

	public void setFrontpage(byte frontpage) {
		this.frontpage = frontpage;
	}

	public int getLevel() {
		return this.level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getFieldOrder() {
		return this.fieldOrder;
	}

	public void setFieldOrder(int fieldOrder) {
		this.fieldOrder = fieldOrder;
	}

	public String getRestName() {
		return this.restName;
	}

	public void setRestName(String restName) {
		this.restName = restName;
	}

	public List<Content> getContents() {
		return this.contents;
	}

	public void setContents(List<Content> contents) {
		this.contents = contents;
	}

	public Content addContent(Content content) {
		getContents().add(content);
		content.setField(this);

		return content;
	}

	public Content removeContent(Content content) {
		getContents().remove(content);
		content.setField(null);

		return content;
	}

	public Type getType() {
		return this.type;
	}

	public void setType(Type type) {
		this.type = type;
	}

	public Menu getMenu() {
		return this.menu;
	}

	public void setMenu(Menu menu) {
		this.menu = menu;
	}

}