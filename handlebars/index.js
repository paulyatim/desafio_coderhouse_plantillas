const express = require('express');
const handlebars = require('express-handlebars')
const app = express();
const router = express.Router();
const Productos = require("./Productos.js");
app.use(express.urlencoded({extended: true}));
app.use('/productos', router);
app.use(express.static("./public"));

const productos = new Productos();



app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}));

app.set('views', './views');
app.set('view engine', 'hbs');

router.post("/", (req, res) => {
    try {
        if (req.body.nombre && req.body.precio && req.body.imagen) {
            productos.save(req.body)
            res.status(201).redirect("/productos")
        } else {
            res.status(400).render("Complete los datos obligatorios")
        }
    } catch(error) {
        res.status(500).render(error.message)
    }
})

router.get("/", (req, res) => {
    try {
        const prods = { productos: productos.getAll}
        res.render('main', prods)
        res.status(200)
    } catch(error) {
        res.status(500).render(error.message)
    }
});


const server = app.listen(8080, () => console.log('ready'));
server.on("error", (error) => console.log(error.message));