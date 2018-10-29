# Apps Admin

## Description

This project can generate JSON content that can be consumed by any kind of mobile apps.
It is composed of 3 parts:

### Admin
In the admin area, the system administrator can create all the fields the apps is going to have, including text, images and dates
![alt tag](https://github.com/bergergit/appsadmin/raw/master/screenshots/admin1.png "Admin area")

### Owner
In the owner area, the owner of the app can add contents, using the fields created by the sysadmin.
![alt tag](https://github.com/bergergit/appsadmin/raw/master/screenshots/owner1.png "Owner area")

### JSON
The app will automatically generate a JSON output, with the contents generated by the owner

Example: http://rest.bergermobile.com.br/mobileapps/contents/app/apos/inlocale/pt-BR


## Installation

This is a Spring Boot Java application.

Install and start MySQL, and run this on a Tomcat 8 server.
Database configuration can be setup in pom.xml