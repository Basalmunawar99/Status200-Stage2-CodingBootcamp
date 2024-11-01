// Import the required modules
import http from "http";
import { URL } from "url";
import mysql from "mysql2";

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'webshop',
});

// Create an HTTP server
const server = http.createServer((request, response) => {
    // Set CORS headers to allow cross-origin requests  
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
        response.writeHead(200);
        response.end();
        return;
    }

    // Parse the URL from the incoming request
    const url = new URL(request.url, `http://${request.headers.host}`);

    // Extract the pathname from the URL
    const pathname = url.pathname;

    // Route - GET welcome message
    if (request.url === "/") {
        response.write("Welcome to my API");
        response.end();
    }
    // Route - POST register user
    else if (request.method === "POST" && pathname === "/api/register") {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            const postData = JSON.parse(body);

            // Insert the data into your database
            connection.query('INSERT INTO users (first_name, last_name, email, address, password, security_answer) VALUES (?, ?, ?, ?, ?, ?)', 
            [postData.firstname, postData.lastname, postData.email, postData.address, postData.password, postData.securityquestion], (err, results) => {
                if (err) {
                    response.statusCode = 500;
                    response.setHeader("Content-Type", "application/json");
                    response.write(JSON.stringify({ error: 'Internal Server Error' }));
                } else {
                    response.statusCode = 201;
                    response.setHeader("Content-Type", "application/json");
                    response.write(JSON.stringify({ success: 'User Registered' }));
                }
                response.end();
            });
        });
    }
    // Route - POST login user
    else if (request.method === "POST" && pathname === "/api/login") {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            const postData = JSON.parse(body);

            // Fetch the user by email from the database
            connection.query('SELECT * FROM users WHERE email = ?', [postData.email], (err, results) => {
                if (err) {
                    response.statusCode = 500;
                    response.setHeader("Content-Type", "application/json");
                    response.write(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                } else {
                    if (results.length > 0) {
                        const user = results[0];

                        // Compare the plain text password
                        if (postData.password === user.password) {
                            response.statusCode = 200;
                            response.setHeader("Content-Type", "application/json");
                            response.write(JSON.stringify({ 
                                success: true, 
                                message: 'Login successful', 
                                userId: user.id // Send back the user ID
                            }));
                        } else {
                            response.statusCode = 401;
                            response.setHeader("Content-Type", "application/json");
                            response.write(JSON.stringify({ success: false, message: 'Incorrect password' }));
                        }
                    } else {
                        response.statusCode = 404;
                        response.setHeader("Content-Type", "application/json");
                        response.write(JSON.stringify({ success: false, message: 'User not found' }));
                    }
                    response.end();
                }
            });
        });
    }
    // Route - GET search products by query
else if (request.method === "GET" && pathname === "/api/search-products") {
    const urlParams = new URLSearchParams(url.search);
    const query = urlParams.get('query');

    if (!query) {
        response.statusCode = 400;
        response.setHeader("Content-Type", "application/json");
        response.write(JSON.stringify({ success: false, message: 'Search query is required' }));
        response.end();
        return;
    }

    // Search for products where the name or description contains the query
    connection.query(
        'SELECT * FROM products WHERE name LIKE ? OR description LIKE ?',
        [`%${query}%`, `%${query}%`],
        (err, results) => {
            if (err) {
                response.statusCode = 500;
                response.setHeader("Content-Type", "application/json");
                response.write(JSON.stringify({ success: false, message: 'Internal Server Error' }));
            } else {
                response.statusCode = 200;
                response.setHeader("Content-Type", "application/json");
                response.write(JSON.stringify(results));
            }
            response.end();
        }
    );
}

    // Route - POST add to cart
    else if (request.method === "POST" && pathname === "/api/add-to-cart") {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
    
        request.on('end', () => {
            const postData = JSON.parse(body);
            const { user_id, product_id, quantity } = postData;
    
            // Check if the product is already in the user's cart
            connection.query(
                'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
                [user_id, product_id],
                (err, results) => {
                    if (err) {
                        response.statusCode = 500;
                        response.setHeader("Content-Type", "application/json");
                        response.write(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                        response.end();
                    } else {
                        if (results.length > 0) {
                            // If product exists in the cart, increase the quantity by the selected amount
                            connection.query(
                                'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                                [quantity, user_id, product_id],
                                (err, updateResult) => {
                                    if (err) {
                                        response.statusCode = 500;
                                        response.setHeader("Content-Type", "application/json");
                                        response.write(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                                    } else {
                                        response.statusCode = 200;
                                        response.setHeader("Content-Type", "application/json");
                                        response.write(JSON.stringify({ success: true, message: 'Cart updated' }));
                                    }
                                    response.end();
                                }
                            );
                        } else {
                            // If product is not in the cart, insert it with the selected quantity
                            connection.query(
                                'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                                [user_id, product_id, quantity],
                                (err, insertResult) => {
                                    if (err) {
                                        response.statusCode = 500;
                                        response.setHeader("Content-Type", "application/json");
                                        response.write(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                                    } else {
                                        response.statusCode = 200;
                                        response.setHeader("Content-Type", "application/json");
                                        response.write(JSON.stringify({ success: true, message: 'Product added to cart' }));
                                    }
                                    response.end();
                                }
                            );
                        }
                    }
                }
            );
        });
    }

    else if (request.method === "POST" && pathname === "/api/update-cart-item") {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
    
        request.on('end', () => {
            const postData = JSON.parse(body);
            const { user_id, product_id, quantity } = postData;
    
            // Update the quantity of the product in the cart
            if (quantity > 0) {
                connection.query(
                    'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
                    [quantity, user_id, product_id],
                    (err, results) => {
                        if (err) {
                            response.statusCode = 500;
                            response.setHeader("Content-Type", "application/json");
                            response.write(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                        } else {
                            response.statusCode = 200;
                            response.setHeader("Content-Type", "application/json");
                            response.write(JSON.stringify({ success: true, message: 'Cart item updated' }));
                        }
                        response.end();
                    }
                );
            } else {
                // If the quantity is 0 or less, remove the item from the cart
                connection.query(
                    'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
                    [user_id, product_id],
                    (err, results) => {
                        if (err) {
                            response.statusCode = 500;
                            response.setHeader("Content-Type", "application/json");
                            response.write(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                        } else {
                            response.statusCode = 200;
                            response.setHeader("Content-Type", "application/json");
                            response.write(JSON.stringify({ success: true, message: 'Cart item removed' }));
                        }
                        response.end();
                    }
                );
            }
        });
    }

    else if (request.method === "POST" && pathname === "/api/remove-cart-item") {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
    
        request.on('end', () => {
            const postData = JSON.parse(body);
            const { user_id, product_id } = postData;
    
            // Remove the item from the cart
            connection.query(
                'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
                [user_id, product_id],
                (err, results) => {
                    if (err) {
                        response.statusCode = 500;
                        response.setHeader("Content-Type", "application/json");
                        response.write(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                    } else {
                        response.statusCode = 200;
                        response.setHeader("Content-Type", "application/json");
                        response.write(JSON.stringify({ success: true, message: 'Cart item removed' }));
                    }
                    response.end();
                }
            );
        });
    }
    
    else if (request.method === "POST" && pathname === "/api/remove-selected-cart-items") {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
    
        request.on('end', () => {
            const postData = JSON.parse(body);
            const { user_id, product_ids } = postData;
    
            // Convert the array of product IDs into a string of comma-separated values
            const placeholders = product_ids.map(() => '?').join(',');
    
            // Construct the DELETE query
            const query = `DELETE FROM cart WHERE user_id = ? AND product_id IN (${placeholders})`;
    
            // Execute the DELETE query
            connection.query(query, [user_id, ...product_ids], (err, results) => {
                if (err) {
                    response.statusCode = 500;
                    response.setHeader("Content-Type", "application/json");
                    response.write(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                } else {
                    response.statusCode = 200;
                    response.setHeader("Content-Type", "application/json");
                    response.write(JSON.stringify({ success: true, message: 'Selected cart items removed' }));
                }
                response.end();
            });
        });
    }
    
    
    // Route - GET all categories or products in a specific category
    else if (pathname.startsWith("/api/categories")) {
        const pathElements = pathname.split("/");
        let categoryID = pathElements[3];
        categoryID = parseInt(categoryID);

        if (isNaN(categoryID)) {
            // Fetch all categories from the database
            connection.query('SELECT * FROM categories', (err, results) => {
                if (err) {
                    response.statusCode = 500;
                    response.setHeader("Content-Type", "application/json");
                    response.write(JSON.stringify({ error: 'Internal Server Error' }));
                } else {
                    response.setHeader("Content-Type", "application/json");
                    response.write(JSON.stringify(results));
                }
                response.end();
            });
        } else {
            // Fetch products by category ID from the database
            connection.query('SELECT * FROM products WHERE category_id = ?', [categoryID], (err, results) => {
                if (err) {
                    response.statusCode = 500;
                    response.setHeader("Content-Type", "application/json");
                    response.write(JSON.stringify({ error: 'Internal Server Error' }));
                } else {
                    response.setHeader("Content-Type", "application/json");
                    response.write(JSON.stringify(results));
                }
                response.end();
            });
        }
    }
    // Route - GET product details
    else if (pathname.startsWith("/api/products")) {
        const pathElements = pathname.split("/");
        let productID = pathElements[3];
        productID = parseInt(productID);

        // Fetch product details by product ID from the database
        connection.query('SELECT * FROM products WHERE id = ?', [productID], (err, results) => {
            if (err) {
                response.statusCode = 500;
                response.setHeader("Content-Type", "application/json");
                response.write(JSON.stringify({ error: 'Internal Server Error' }));
            } else {
                response.setHeader("Content-Type", "application/json");
                if (results.length > 0) {
                    response.write(JSON.stringify(results[0]));
                } else {
                    response.statusCode = 404;
                    response.write(JSON.stringify({ error: 'Product Not Found' }));
                }
            }
            response.end();
        });
    }

// Route - POST place order
else if (request.method === "POST" && pathname === "/api/place-order") {
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', () => {
        const postData = JSON.parse(body);
        const { user_id, product_ids } = postData;

        if (!product_ids || product_ids.length === 0) {
            response.statusCode = 400;
            response.setHeader("Content-Type", "application/json");
            response.write(JSON.stringify({ success: false, message: 'No products selected' }));
            response.end();
            return;
        }

        // Calculate the total amount for the selected products
        const placeholders = product_ids.map(() => '?').join(',');
        connection.query(
            `SELECT SUM(products.price * cart.quantity) AS total_amount 
             FROM cart 
             JOIN products ON cart.product_id = products.id 
             WHERE cart.user_id = ? AND cart.product_id IN (${placeholders})`,
            [user_id, ...product_ids],
            (err, results) => {
                if (err) {
                    response.statusCode = 500;
                    response.setHeader("Content-Type", "application/json");
                    response.write(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                    response.end();
                } else {
                    const total_amount = results[0].total_amount;

                    // Insert into orders table
                    connection.query(
                        'INSERT INTO orders (user_id, order_date, total_amount) VALUES (?, NOW(), ?)',
                        [user_id, total_amount],
                        (err, orderResult) => {
                            if (err) {
                                response.statusCode = 500;
                                response.setHeader("Content-Type", "application/json");
                                response.write(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                                response.end();
                            } else {
                                const orderId = orderResult.insertId;

                                // Insert into order_detail table for selected products only
                                connection.query(
                                    `INSERT INTO order_detail (order_id, product_id, quantity, price, total_price, created_at) 
                                     SELECT ?, cart.product_id, cart.quantity, products.price, 
                                            (cart.quantity * products.price), NOW() 
                                     FROM cart 
                                     JOIN products ON cart.product_id = products.id 
                                     WHERE cart.user_id = ? AND cart.product_id IN (${placeholders})`,
                                    [orderId, user_id, ...product_ids],
                                    (err, orderDetailResult) => {
                                        if (err) {
                                            response.statusCode = 500;
                                            response.setHeader("Content-Type", "application/json");
                                            response.write(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                                        } else {
                                            // Reduce the stock for each product in the order
                                            product_ids.forEach(product_id => {
                                                connection.query(
                                                    `UPDATE products 
                                                     JOIN cart ON products.id = cart.product_id 
                                                     SET products.stock = products.stock - cart.quantity 
                                                     WHERE products.id = ? AND cart.user_id = ?`,
                                                    [product_id, user_id],
                                                    (err, stockUpdateResult) => {
                                                        if (err) {
                                                            console.error(`Failed to update stock for product ID ${product_id}:`, err);
                                                        } else {
                                                            console.log(`Stock updated for product ID ${product_id}`);
                                                        }
                                                    }
                                                );
                                            });

                                            // Remove only the selected items from the cart
                                            connection.query(
                                                `DELETE FROM cart WHERE user_id = ? AND product_id IN (${placeholders})`,
                                                [user_id, ...product_ids],
                                                (err, clearCartResult) => {
                                                    if (err) {
                                                        response.statusCode = 500;
                                                        response.setHeader("Content-Type", "application/json");
                                                        response.write(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                                                    } else {
                                                        response.statusCode = 200;
                                                        response.setHeader("Content-Type", "application/json");
                                                        response.write(JSON.stringify({ success: true, message: 'Order placed successfully' }));
                                                    }
                                                    response.end();
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        );
    });
}


    // Route - GET cart items for the current user
    else if (request.method === "GET" && pathname === "/api/cart-items") {
        const urlParams = new URLSearchParams(url.search);
        const userId = urlParams.get('user_id'); // Get the user_id from the query string

        if (!userId) {
            response.statusCode = 400;
            response.setHeader("Content-Type", "application/json");
            response.write(JSON.stringify({ success: false, message: 'User ID is required' }));
            response.end();
            return;
        }

        // Query to fetch cart items for the user
        connection.query(
            'SELECT products.id, products.name, products.price, cart.quantity, cart.timestamp FROM cart JOIN products ON cart.product_id = products.id WHERE cart.user_id = ?',
            [userId],
            (err, results) => {
                if (err) {
                    response.statusCode = 500;
                    response.setHeader("Content-Type", "application/json");
                    response.write(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                } else {
                    response.statusCode = 200;
                    response.setHeader("Content-Type", "application/json");
                    response.write(JSON.stringify({ success: true, cartItems: results }));
                }
                response.end();
            }
        );
    }
    // Route - invalid or unknown routes
    else {
        response.statusCode = 404;
        response.write("Not Found");
        response.end();
    }
});



// Start the server and listen on port 3000
server.listen(3000, () => {
    console.log("Listening on port 3000...");
});
