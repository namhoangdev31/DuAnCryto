import jwt from 'jsonwebtoken'; // Rename the import to avoid conflict

export async function signToken(user) {
    const JWT_SECRET = process.env.JWT_SECRET;
    return new Promise((resolve, reject) => {
        jwt.sign({
            username: user.username,
            email: user.email
        }, JWT_SECRET, (err, token) => {
            if (err) {
                return reject(err);
            }
            return resolve(token);
        });
    });
}

export async function decodeToken(token) {
    const JWT_SECRET = process.env.JWT_SECRET;
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            return resolve(decoded);
        });
    });
}