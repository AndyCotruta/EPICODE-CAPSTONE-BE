# Food App Backend

This is the Backend part of a full stack project focused on food lifestyle.

Below is the link for the FE side of the project

[FOOD_APP_FRONTEND](https://github.com/AndyCotruta/EPICODE-CAPSTONE-FE)

The REST APIs contain users, recipes, food categories, featured categories, restaurants and restaurants reviews.

## API Reference

### Users

When you register as a new user, a default **role** as 'regular' is automatically added. This restricts the access to certain endpoints. You will only be able to access **/me** endpoints for users, and **GET** endpoints for restaurants, categories and featured categories.

To be able to access individual restaurant endpoints, register for **role** 'owner'.

To be able to access all endpoints, register for **role** 'admin'.

#### Register as a new user

```http
  POST /users/register
```

| Request Body | Type     | Description                                                                |
| :----------- | :------- | :------------------------------------------------------------------------- |
| `email`      | `string` | **Required**. Your valid email                                             |
| `password`   | `string` | **Required**. If you register via email&password.                          |
| `password`   | `string` | **Optional**. No password needed if you register via Google/Facebook/Apple |

#### User Login

```http
  POST /users/login
```

| Request Body | Type     | Description                                                             |
| :----------- | :------- | :---------------------------------------------------------------------- |
| `email`      | `string` | **Required**. Your valid email                                          |
| `password`   | `string` | **Required**. If you login via email&password.                          |
| `password`   | `string` | **Optional**. No password needed if you login via Google/Facebook/Apple |

#### Get your user info

```http
  GET /users/me
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Edit your user info

```http
  PUT /users/me
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Delete your user

```http
  DELETE /users/me
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Add a review

```http
  POST /users/me/reviews
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Edit your review

```http
  PUT /users/me/reviews/${id}
```

| Parameter | Type     | Description                  |
| :-------- | :------- | :--------------------------- |
| `api_key` | `string` | **Required**. Your API key   |
| `id`      | `string` | **Required**. Your review id |

#### Delete your review

```http
  DELETE /users/me/reviews/${id}
```

| Parameter | Type     | Description                  |
| :-------- | :------- | :--------------------------- |
| `api_key` | `string` | **Required**. Your API key   |
| `id`      | `string` | **Required**. Your review id |

#### Add your recipe

```http
  POST /users/me/recipes
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get all your recipes

```http
  GET /users/me/recipes
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Edit your recipe

```http
  PUT /users/me/recipes/${id}
```

| Parameter | Type     | Description                  |
| :-------- | :------- | :--------------------------- |
| `api_key` | `string` | **Required**. Your API key   |
| `id`      | `string` | **Required**. Your recipe id |

#### Delete your recipe

```http
  DELETE /users/me/recipes/${id}
```

| Parameter | Type     | Description                  |
| :-------- | :------- | :--------------------------- |
| `api_key` | `string` | **Required**. Your API key   |
| `id`      | `string` | **Required**. Your recipe id |

#### Get all users

```http
  GET /users
```

| Parameter | Type     | Description                           |
| :-------- | :------- | :------------------------------------ |
| `api_key` | `string` | **Required**. Your API key            |
| `limit`   | `string` | **Optional**. Limit number of results |

#### Get user

```http
  GET /users/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of user to fetch |
| `api_key` | `string` | **Required**. Your API key        |

#### Edit user

```http
  PUT /users/${id}
```

| Parameter | Type     | Description                      |
| :-------- | :------- | :------------------------------- |
| `id`      | `string` | **Required**. Id of user to edit |
| `api_key` | `string` | **Required**. Your API key       |

#### Delete user

```http
  DELETE /users/${id}
```

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `id`      | `string` | **Required**. Id of user to delete |
| `api_key` | `string` | **Required**. Your API key         |

### RECIPES

If you are an user with **role** 'admin' you have access to all CRUD operations for managing the 'book' of recipes that all users have access to.

#### Post new recipe

```http
  POST /recipes
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get all recipes

```http
  GET /recipes
```

| Parameter | Type     | Description                           |
| :-------- | :------- | :------------------------------------ |
| `api_key` | `string` | **Required**. Your API key            |
| `query`   | `string` | **Optional**. Your Search Query       |
| `limit`   | `string` | **Optional**. Limit number of results |

#### Get restuarant

```http
  GET /recipes/${id}
```

| Parameter | Type     | Description                         |
| :-------- | :------- | :---------------------------------- |
| `id`      | `string` | **Required**. Id of recipe to fetch |
| `api_key` | `string` | **Required**. Your API key          |

#### Edit recipe

```http
  PUT /recipes/${id}
```

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `id`      | `string` | **Required**. Id of recipe to edit |
| `api_key` | `string` | **Required**. Your API key         |

#### Delete recipe

```http
  DELETE /recipes/${id}
```

| Parameter | Type     | Description                          |
| :-------- | :------- | :----------------------------------- |
| `id`      | `string` | **Required**. Id of recipe to delete |
| `api_key` | `string` | **Required**. Your API key           |

### RESTAURANTS

This endpoints allow interaction with restaurants based on the **role**. Check **USERS** section for details.

#### Post new restaurant

```http
  POST /restaurants
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get all restaurants

```http
  GET /restaurants
```

| Parameter | Type     | Description                           |
| :-------- | :------- | :------------------------------------ |
| `api_key` | `string` | **Required**. Your API key            |
| `query`   | `string` | **Optional**. Your Search Query       |
| `limit`   | `string` | **Optional**. Limit number of results |

#### Get restuarant

```http
  GET /restaurants/${id}
```

| Parameter | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `id`      | `string` | **Required**. Id of restaurant to fetch |
| `api_key` | `string` | **Required**. Your API key              |

#### Edit restaurant

```http
  PUT /restaurants/${id}
```

| Parameter | Type     | Description                            |
| :-------- | :------- | :------------------------------------- |
| `id`      | `string` | **Required**. Id of restaurant to edit |
| `api_key` | `string` | **Required**. Your API key             |

#### Delete restaurant

```http
  DELETE /restaurants/${id}
```

| Parameter | Type     | Description                              |
| :-------- | :------- | :--------------------------------------- |
| `id`      | `string` | **Required**. Id of restaurant to delete |
| `api_key` | `string` | **Required**. Your API key               |

### FOOD CATEGORIES

If you are an user with **role** 'admin' you have access to all CRUD operations in regard to specific food categories.

#### Post new category

```http
  POST /categories
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get all categories

```http
  GET /categories
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get restuarant

```http
  GET /categories/${id}
```

| Parameter | Type     | Description                           |
| :-------- | :------- | :------------------------------------ |
| `id`      | `string` | **Required**. Id of category to fetch |
| `api_key` | `string` | **Required**. Your API key            |

#### Edit category

```http
  PUT /categories/${id}
```

| Parameter | Type     | Description                          |
| :-------- | :------- | :----------------------------------- |
| `id`      | `string` | **Required**. Id of category to edit |
| `api_key` | `string` | **Required**. Your API key           |

#### Delete category

```http
  DELETE /categories/${id}
```

| Parameter | Type     | Description                            |
| :-------- | :------- | :------------------------------------- |
| `id`      | `string` | **Required**. Id of category to delete |
| `api_key` | `string` | **Required**. Your API key             |

### RESTAURANT REVIEWS

The following endpoints give access to restaurant reviews based on user's **role**. Check **USERS** section for details.

#### Post new review

```http
  POST /reviews
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get all reviews

```http
  GET /reviews
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get restuarant

```http
  GET /reviews/${id}
```

| Parameter | Type     | Description                         |
| :-------- | :------- | :---------------------------------- |
| `id`      | `string` | **Required**. Id of review to fetch |
| `api_key` | `string` | **Required**. Your API key          |

#### Edit review

```http
  PUT /reviews/${id}
```

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `id`      | `string` | **Required**. Id of review to edit |
| `api_key` | `string` | **Required**. Your API key         |

#### Delete review

```http
  DELETE /reviews/${id}
```

| Parameter | Type     | Description                          |
| :-------- | :------- | :----------------------------------- |
| `id`      | `string` | **Required**. Id of review to delete |
| `api_key` | `string` | **Required**. Your API key           |

### FEATURED CATEGORIES

Section reserved only for users with **role** 'admin' allows you to perform CRUD operations on featured categories.

#### Post new featuredCategory

```http
  POST /featuredCategory
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get all featuredCategory

```http
  GET /featuredCategory
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get restuarant

```http
  GET /featuredCategory/${id}
```

| Parameter | Type     | Description                                   |
| :-------- | :------- | :-------------------------------------------- |
| `id`      | `string` | **Required**. Id of featuredCategory to fetch |
| `api_key` | `string` | **Required**. Your API key                    |

#### Edit featuredCategory

```http
  PUT /featuredCategory/${id}
```

| Parameter | Type     | Description                                  |
| :-------- | :------- | :------------------------------------------- |
| `id`      | `string` | **Required**. Id of featuredCategory to edit |
| `api_key` | `string` | **Required**. Your API key                   |

#### Delete featuredCategory

```http
  DELETE /featuredCategory/${id}
```

| Parameter | Type     | Description                                    |
| :-------- | :------- | :--------------------------------------------- |
| `id`      | `string` | **Required**. Id of featuredCategory to delete |
| `api_key` | `string` | **Required**. Your API key                     |

## Authors

- [@andyaristidecotruta](https://www.linkedin.com/in/andy-aristide-cotruta-03b7a4136/)
