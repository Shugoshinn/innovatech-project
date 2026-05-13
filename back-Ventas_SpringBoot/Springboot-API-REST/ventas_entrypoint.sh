echo "Esperando MySQL en $DB_HOST:3306..."

until nc -z $DB_HOST 3306; do
    echo "MySQL no disponible todavia :c"
    sleep 3
done

echo "MySQL disponible, iniciando el backend..."

java -jar app.jar