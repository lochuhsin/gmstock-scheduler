export DATABASE_URL="postgres://root:root@localhost:5432/postgres"
npx prisma migrate dev
echo "finish migrating"
