CREATE SEQUENCE ref_no_seq START WITH 1001;

CREATE TABLE income ( income_id VARCHAR(255) PRIMARY KEY not null, ref_no integer DEFAULT nextval('ref_no_seq'), amount integer NOT NULL, description varchar(255) not null, name_of_income varchar(255) not null, date date not null, order_id VARCHAR(255) not null, FOREIGN KEY (order_id) REFERENCES orders(order_id) );