const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const authConfig = {
	domain: `${process.env.AUTH_DOMAIN}`,
	audience: `https://fire-nation.herokuapp.com/api`
};


const checkJwt = jwt({
	secret: jwksRsa.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
	}),

	audience: authConfig.audience,
	issuer: `${process.env.AUTH_ISSUER}`,
	algorithms: ['RS256']
});

module.exports = checkJwt;