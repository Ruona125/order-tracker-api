CREATE SEQUENCE ref_no_seq_exp START WITH 1001;

CREATE TABLE expenses ( expenses_id VARCHAR(255) PRIMARY KEY not null, ref_no integer DEFAULT nextval('ref_no_seq_exp'), amount integer not null, description varchar(255) not null, name_of_expenses varchar(255) not null, date date not null, order_id VARCHAR(255) not null, FOREIGN KEY (order_id) REFERENCES orders(order_id) );