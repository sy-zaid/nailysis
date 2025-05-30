import psycopg2

# Change these if needed
conn = psycopg2.connect(
    dbname="postgres",         # default admin DB
    user="postgres",           # your PostgreSQL username
    password="postgres",       # your PostgreSQL password
    host="localhost",
    port="5432"
)
conn.autocommit = True
cur = conn.cursor()

db_name = "test_nailysis_db_zf4o"  # your test DB name
cur.execute(f"""
    SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = %s AND pid <> pg_backend_pid();
""", (db_name,))

print(f"Terminated active connections to {db_name}")
cur.close()
conn.close()
