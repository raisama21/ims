import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL);

async function seedGroups() {
    try {
        await sql`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS "groups" (
                id UUID NOT NULL DEFAULT uuid_generate_v4(),
                business_name VARCHAR(256) UNIQUE NOT NULL,

                PRIMARY KEY (id)
            )
        `;

        console.log("created 'groups' table");
    } catch (error) {
        console.log("error while trying to seed 'groups' table: ", error);
    }
}

async function seedUsers() {
    try {
        await sql`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_roles') THEN
                   CREATE TYPE user_roles as ENUM (
                       'admin',
                       'product-manager',
                       'sales-person'
                   );
                END IF; 
            END$$;
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS "users" (
                id UUID NOT NULL DEFAULT uuid_generate_v4(),
                group_id UUID NOT NULL,
                first_name VARCHAR(256) NOT NULL,
                last_name VARCHAR(256) NOT NULL,
                email VARCHAR(256) UNIQUE NOT NULL,
                password VARCHAR(256) NOT NULL,
                roles USER_ROLES NOT NULL DEFAULT 'admin',

                PRIMARY KEY (id),
                FOREIGN KEY (group_id) REFERENCES groups (id)
            )
        `;

        console.log("created 'users' table");
    } catch (error) {
        console.log("error while trying to seed 'users' table: ", error);
    }
}

async function seedCategories() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS "categories" (
                id UUID NOT NULL DEFAULT uuid_generate_v4(),
                group_id UUID NOT NULL,
                category_name VARCHAR(256) NOT NULL,

                PRIMARY KEY (id),
                FOREIGN KEY (group_id) REFERENCES groups (id)
            )
        `;

        console.log("created 'categories' table");
    } catch (error) {
        console.log("error while trying to seed 'categories' table: ", error);
    }
}

async function seedCustomer() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS "customers" (
                id UUID NOT NULL DEFAULT uuid_generate_v4(),
                group_id UUID NOT NULL,
                first_name VARCHAR(256) NOT NULL,
                last_name VARCHAR(256) NOT NULL,
                email VARCHAR(256) UNIQUE NOT NULL,
                phone_number NUMERIC(256) NOT NULL,

                PRIMARY KEY (id),
                FOREIGN KEY (group_id) REFERENCES groups (id)
            )
        `;

        console.log("created 'customer' table");
    } catch (error) {
        console.log("error while trying to seed 'customer' table: ", error);
    }
}

async function seedProducts() {
    try {
        await sql`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_status') THEN
                   CREATE TYPE product_status as ENUM (
                       'in-stock',
                       'out-of-stock'
                   );
                END IF; 
            END$$;
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS "products" (
                id UUID NOT NULL DEFAULT uuid_generate_v4(),
                group_id UUID NOT NULL,
                product_name VARCHAR(256) NOT NULL,
                description TEXT NOT NULL,
                category VARCHAR(256) NOT NULL,
                status PRODUCT_STATUS NOT NULL,
                sku VARCHAR(256) NOT NULL,
                stock NUMERIC NOT NULL,
                purchase_price NUMERIC NOT NULL,
                selling_price NUMERIC NOT NULL,

                PRIMARY KEY (id),
                FOREIGN KEY (group_id) REFERENCES groups (id)

            )
        `;

        console.log("created 'products' table");
    } catch (error) {
        console.log("error while trying to seed 'products' table: ", error);
    }
}

async function seedOrders() {
    try {
        await sql`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
                   CREATE TYPE payment_method as ENUM (
                       'e-wallet',
                       'mobile-banking',
                       'in-person'
                   );
                END IF; 
            END$$;
        `;

        await sql`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
                   CREATE TYPE order_status as ENUM (
                       'pending',
                       'paid'
                   );
                END IF; 
            END$$;
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS "orders" (
                id UUID NOT NULL DEFAULT uuid_generate_v4(),
                group_id UUID NOT NULL,
                customer_id UUID NOT NULL,
                sub_total NUMERIC NOT NULL,
                delivery_charge NUMERIC,
                discount_in_percentage NUMERIC,
                total NUMERIC NOT NULL,
                street_address VARCHAR(256) NOT NULL,
                city VARCHAR(256) NOT NULL,
                provience VARCHAR(256) NOT NULL,
                postal_code NUMERIC NOT NULL,
                payment_method PAYMENT_METHOD NOT NULL,
                payment_id VARCHAR(256),
                status ORDER_STATUS NOT NULL DEFAULT 'pending',
                created_at DATE NOT NULL DEFAULT NOW(),

                PRIMARY KEY (id),
                FOREIGN KEY (group_id) REFERENCES groups(id)
            )
        `;
        console.log("created 'orders' table");
    } catch (error) {
        console.log("error while trying to seed 'orders' table: ", error);
    }
}

async function seedProductOrderDetails() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS "product-order-details" (
                id UUID NOT NULL DEFAULT uuid_generate_v4(),
                order_id UUID NOT NULL,
                product_name VARCHAR(256) NOT NULL,
                quantity NUMERIC NOT NULL,

                PRIMARY KEY (id),
                FOREIGN KEY (order_id) REFERENCES orders(id)
            )
        `;
        console.log("created 'product-order-details' table");
    } catch (error) {
        console.log(
            "error while trying to seed 'product-order-details' table: ",
            error
        );
    }
}

async function main() {
    await seedGroups();
    await seedUsers();
    await seedCategories();
    await seedCustomer();
    await seedProducts();
    await seedOrders();
    await seedProductOrderDetails();

    sql.end();
}

main();
