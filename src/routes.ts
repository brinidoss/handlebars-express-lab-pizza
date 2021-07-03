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
    let chosenToppings: string[] | string = req.body.toppings;
    let glutenFree: boolean | string = req.body['gluten-free'] === 'true' ? true : false;
    const specialInstructions: string = req.body['special-instructions'] ? String(req.body['special-instructions']) : '';
    
    //this is when you choose just one ingredient - it takes the string and puts it into an array
    if (typeof chosenToppings === 'string') {
        chosenToppings = [chosenToppings];
    }

    //changes true and false to yes and no
    if (glutenFree) {
        glutenFree = "Yes";
    } else {
        glutenFree = "No";
    }

    function calcTotal(): number {
        let total: number = 0;

        if (String(req.body.size) === "Small") {
            total += 7;
            if (chosenToppings) {
                total += chosenToppings.length * .5;
            }
        } else if (String(req.body.size) === "Medium") {
            total += 10;
            if (chosenToppings) {
                total += chosenToppings.length;
            }
        } else {
            total += 12;
            if (chosenToppings) {
                total += chosenToppings.length * 1.25;
            }
        }

        if (glutenFree === 'Yes') {
            total += 2;
        }
        return total;
    }
   
    function getFreeDelivery(): string {
        if (calcTotal() >= 15) {
            return "Because your order meets the $15.00 minimum, you get FREE DELIVERY!";
        } else {
            return "";
        }
    }

    interface BuiltPizza {
        size: string;
        toppings: string[];
        glutenFree: string;
        specialInstructions: string;
        price: number;
        freeDelivery: string;
    }

    const newBuiltPizza: BuiltPizza = {
        size: size,
        toppings: chosenToppings,
        glutenFree: glutenFree,
        specialInstructions: specialInstructions,
        price: calcTotal(),
        freeDelivery: getFreeDelivery()
    }

    res.render('build-submission', {pizza: newBuiltPizza});
})

console.log(123/100);

export default routes;





// Can't believe I had all this when all I needed to do was set toppings equal to req.body.toppings...
//     for ( const topping of toppings ) {
//         //req.body.toppings ? String(req.body.size) : '';
//         if (String(req.body.toppings).includes(topping)) {

//         chosenToppings.push(String(req.body.toppings));
//         console.log(chosenToppings);
        
//         }
//         //return toppings;
//    }
