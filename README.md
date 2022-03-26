# Tyba Backend Test

## Miguel Angel Ramos Hurtado

Para empezar con la ejecución del código necesitaremos ejecutar varios comandos en la consola primero. (Antes de hacerlo, asegurarse que docker se está ejecutando en el equipo.)

```bash
-npm run build
-docker-compose up -d
-npm run dev
```

Ya con esto tendremos lo necesario para realizar los request a la API. En caso de que el API Key para el Api de Google Maps ya no sea válida se tiene que especificar una nueva API Key en el archivo .env que contiene la variable de entorno.

## Endpoints

url = http://localhost:3000/

### SignUp Usuario

POST {{url}}signUp

En el header del response de este endpoint se retorna el token-auth necesario para llevar a cabo las peticiones que requieren estar logeado. El body del request tiene que ser de la forma:

```bash
{
    "firstName":"Jhonny",
    "lastName":"Doe",
    "email":"jhondoe@gmail.com",
    "password":"12345"
}
```

### LogIn Usuario

POST {{url}}logIn

En el header del response de este endpoint se retorna el token-auth necesario para llevar a cabo las peticiones que requieren estar logeado. El body del request tiene que ser de la forma:

```bash
{
    "email":"jhondoe@gmail.com",
    "password":"12345"
}
```

### LogOut Usuario

GET {{url}}

Esta petición no tiene body al ser un GET. Sin embargo, para la validación del "LoggedOut" este retorna en el response el Cookie que se le debe asignar a el header de las peticiones que necesitan que el usuario este logeado. Dado que es desde el server side, esta es la forma para comprobar que al no estar logeado no le permita usar dichos endpoints.

### Buscar Restaurantes

POST {{url}}searchRest

Esta petición se puede hacer con el body de 2 formas, dependiendo de si lo que se quiere buscar es por coordenadas o por ciudad.

Body para el caso de ciudad:

```bash
{
    "city":"NombreCiudad, Pais"
}
```

Body para el caso de coordenadas:

```bash
{
    "lat":numero,
    "lng":numero
}
```

### Consultar historial de transacciones

GET {{url}}transactions

Esta petición no tiene body al ser un GET. Retorna un JSON con el historial de transacciones realizadas en la base de datos.

## Anexos

Por facilidad, hice una colección de postman con ejemplos de los diferentes endpoints. No alcancé a hacer las pruebas mediante Jest.
