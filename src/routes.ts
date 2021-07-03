import express from 'express';
import pizzas from './pizza';
import toppings from './toppings';
//import { Ingredient } from './toppings';

//our routes instance of the Express Router class
const routes = express.Router();

// GET homepage
routes.get('/', (req, res) => {
    res.render('homepage', {pizzas});
});

//SPECIALTY PIZZAS
//get special pizzas by id
routes.get("/specialty-pizzas", (req, res) => {
    
    let chosenPizza = pizzas.find((pizza) => {
            return pizza.id === Number(req.query.id);
        })

        res.render('specialty-pizzas', {
            pizza: chosenPizza
        });
})   
    
//REVIEW
//review form
routes.get("/review", (req, res) => {
    res.render('review');
})

routes.post("/review/confirmation", (req, res) => {
    const name: string = req.body.name ? String(req.body.name) : '';
    const comment: string = req.body.comment ? String(req.body.comment) : '';
    const rating: number = req.body.rating ? Number(req.body.rating) : 0;

    interface Review {
        name: string;
        comment: string;
        rating: number
    }

    const newReview: Review = {
        name: name,
        comment: comment,
        rating: rating
    }

    res.render("review-confirmation", {review: newReview});
})

//BUILD YOUR OWN
//Build your own form
routes.get("/build-your-own", (req, res) => {
    res.render('build-your-own', {toppings});
})

routes.post('/build-your-own/confirmation', (req, res) => {
    const size: string = req.body.size ? String(req.body.size) : '';
    //let toppings = req.body.toppings === 'true' ? 
    let glutenFree: boolean | string = req.body['gluten-free'] === 'true' ? true : false;
    const specialInstructions: string = req.body['special-instructions'] ? String(req.body['special-instructions']) : '';
    const total: number = 10;
    
    if (glutenFree) {
        glutenFree = "Yes";
    } else {
        glutenFree = "No";
    }

    // for ( const topping of toppings ) {
        //req.body.toppings ? String(req.body.size) : '';
        if (req.body.toppings === 'true') {

        toppings.push(req.body.toppings);
        return toppings;
        }

   // }


    interface BuiltPizza {
        size: string;
        toppings: any[];
        glutenFree: boolean | string;
        specialInstructions: string;
        price: number,
    }

    const newBuiltPizza: BuiltPizza = {
        size: size,
        toppings: toppings,
        glutenFree: glutenFree,
        specialInstructions: specialInstructions,
        price: total
    }

    res.render('build-submission', {pizza: newBuiltPizza});
})

export default routes;

