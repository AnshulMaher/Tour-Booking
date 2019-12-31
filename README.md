# Tours Booking Web Application

Web Application for booking tours online.

## Requisites

Create config.env file in root directory with these configurations:

```
NODE_ENV=development
PORT=<port number>
USERNAME=<username>

DATABASE_PASSWORD=<db password>
DATABASE=mongodb+srv://username:<password>@cluster.mongodb.net/db_name
The <password> will be replaced by DATABASE_PASSWORD

DATABASE_LOCAL=<local database url string>

JWT_SECRET=my-super-long-and-super-secure-string
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

EMAIL_FROM=<your mail>

For development only
EMAIL_USERNAME=<username>
EMAIL_PASSWORD=<password>
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525

For Production
SENDGRID_USERNAME=<username>
SENDGRID_PASSWORD=<api key>

STRIPE_PUBLIC_KEY=<public key>
STRIPE_SECRET_KEY=<private key>

```
