var express = require('express'); //Fast, unopinionated, minimalist web framework for node.
var session = require('express-session');
var passport = require('passport'); //It provides Passport with an authentication request and 
                                    //Passport provides links to control what happens when authentication 
                                    //succeeds or fails.
                                    
var cookieParser = require('cookie-parser'); 
var path = require("path");
var fs = require('fs'); 

// read settings.js
var settings = require('./settings.js');

//create express server
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({ resave: 'true', saveUninitialized: 'true', secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user,done){
  done(null,user);
});

passport.deserializeUser(function(obj, done) {
  done(null,obj);
});

// openid-client is an implementation of the OpenID Relying Party (RP, Client) server
// for the runtime of Node.js, support passport

//OAuth 2.0 protocol
//middleware Passport-OpenID Connect

var OpenIDConnectStrategy = require('passport-ci-oidc').IDaaSOIDCStrategy;
var Strategy = new OpenIDConnectStrategy({
        discoveryURL: settings.discovery_url,
        clientID: settings.client_id,
        scope: 'openid',
        response_type: 'code',
        clientSecret: settings.client_secret,
        callbackURL: settings.callback_url,
        skipUserProfile: true,
        CACertPathList: [
                `/certs/DigiCertGlobalRootCA.crt`,
                `/certs/DigiCertSHA2SecureServerCA.crt`,
        ]},
        function (iss, sub, profile, accessToken, refreshToken, params, done) {
                process.nextTick(function () {
                        profile.accessToken = accessToken;
                        profile.refreshToken = refreshToken;
                        done(null, profile);
                })
        }
)

passport.use(Strategy);

app.get('/', function(req, res){
        res.cookie("foo", "bar", { sameSite: "none", secure: true });
        res.send('<h1> Log in example using Node.js</h1> <br /> <a href="/hello">Login</a><br/>'+'<br />');
});


app.get('/login', passport.authenticate('openidconnect', { state: Math.random().toString(36).substr(2,10)}));

app.get('/oidc_callback', function (req, res, next ){
        var redirect_url = req.session.originalUrl;
        passport.authenticate('openidconnect', {
                successRedirect: redirect_url,
                failureRedirect: '/failure'
        })(req, res, next);
});

app.get('/failure', function(req, res){
        res.send('login failed');
});

function ensureAuthenticated(req, res, next) {
        if (!req.isAuthenticated()) {
                req.session.originalUrl = req.originalUrl;
                res.redirect('/login');
        } else {
                return next();
        }
}

app.get('/hello', ensureAuthenticated, function (req, res) {
        var claimsB = req.user['_json'];
        var infoB = JSON.stringify(req.user, null, 4);
        res.render('index.ejs',{
                claims: claimsB,
                info: infoB
        });     
 });

var https = require('https');
var https_port = settings.local_port;

var http = require ('http');
var http_port = 3001;

if (settings.local) {
        https.createServer({
                key: fs.readFileSync('key.pem'),
                cert: fs.readFileSync('certificate.pem')

        }, app).listen(https_port);
        console.log("server starting on https://localhost:" + https_port);
}
else{
        app.listen(https_port, function(){
                console.log("server starting on http://localhost:" + http_port)
        })
}