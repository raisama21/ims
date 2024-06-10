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
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

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
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

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
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

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
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

                PRIMARY KEY (id),
                FOREIGN KEY (group_id) REFERENCES groups (id)
            )
        `;

        console.log("created 'customer' table");
    } catch (error) {
        console.log("error while trying to seed 'customer' table: ", error);
    }
}

async function seedCustomerAddress() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS "customer_address" (
                id UUID NOT NULL DEFAULT uuid_generate_v4(),
                customer_id UUID NOT NULL,
                street_address VARCHAR(256) NOT NULL,
                city VARCHAR(256) NOT NULL,
                provience VARCHAR(256) NOT NULL,
                postal_code NUMERIC NOT NULL,

                PRIMARY KEY (id),
                FOREIGN KEY (customer_id) REFERENCES customers (id)
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
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

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
                customer_address_id UUID NOT NULL,
                sub_total NUMERIC NOT NULL,
                delivery_charge NUMERIC,
                discount_in_percentage NUMERIC,
                total NUMERIC NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

                PRIMARY KEY (id),
                FOREIGN KEY (group_id) REFERENCES groups(id),
                FOREIGN KEY (customer_id) REFERENCES customers(id),
                FOREIGN KEY (customer_address_id) REFERENCES customer_address(id)
            )
        `;
        console.log("created 'orders' table");
    } catch (error) {
        console.log("error while trying to seed 'orders' table: ", error);
    }
}

async function seedOrderTracking() {
    try {
        await sql`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_tracking_status') THEN
                   CREATE TYPE order_tracking_status as ENUM (
                       'order_created',
                       'processing',
                       'shipped',
                       'delivered'
                   );
                END IF; 
            END$$;
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS "order_tracking" (
                id UUID NOT NULL DEFAULT uuid_generate_v4(),
                group_id UUID NOT NULL,
                order_id UUID NOT NULL,
                customer_id UUID NOT NULL,
                status ORDER_TRACKING_STATUS NOT NULL DEFAULT 'order_created',
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                processed_at TIMESTAMPTZ,
                shipped_at TIMESTAMPTZ,
                delivered_at TIMESTAMPTZ,

                FOREIGN KEY (group_id) REFERENCES groups(id),
                FOREIGN KEY (customer_id) REFERENCES customers(id),
                FOREIGN KEY (order_id) REFERENCES orders(id),
                PRIMARY KEY (id)
            )
        `;
        console.log("created 'order_tracking' table");
    } catch (error) {
        console.log(
            "error while trying to seed 'order_tracking' table: ",
            error
        );
    }
}

async function seedOrderDetails() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS "order_details" (
                id UUID NOT NULL DEFAULT uuid_generate_v4(),
                order_id UUID NOT NULL,
                product_name VARCHAR(256) NOT NULL,
                quantity NUMERIC NOT NULL,
                price NUMERIC NOT NULL,

                PRIMARY KEY (id),
                FOREIGN KEY (order_id) REFERENCES orders(id)
            )
        `;
        console.log("created 'order_details' table");
    } catch (error) {
        console.log(
            "error while trying to seed 'order_details' table: ",
            error
        );
    }
}

async function seedPayments() {
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
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
                   CREATE TYPE payment_status as ENUM (
                       'pending',
                       'paid'
                   );
                END IF; 
            END$$;
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS "payments" (
                id UUID NOT NULL DEFAULT uuid_generate_v4(),
                order_id UUID NOT NULL,
                payment_method PAYMENT_METHOD,
                payment_id NUMERIC, 
                status PAYMENT_STATUS NOT NULL DEFAULT 'pending',

                PRIMARY KEY (id),
                FOREIGN KEY (order_id) REFERENCES orders(id)
            )
        `;

        console.log("created 'payments' table");
    } catch (error) {
        console.log("error while trying to seed 'payments' table: ", error);
    }
}

async function main() {
    await seedGroups();
    await seedUsers();
    await seedCategories();
    await seedCustomer();
    await seedCustomerAddress();
    await seedProducts();
    await seedOrders();
    await seedOrderTracking();
    await seedOrderDetails();
    await seedPayments();

    sql.end();
}

main();
