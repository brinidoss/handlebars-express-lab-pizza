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
            total += 700;
            if (chosenToppings) {
                total += chosenToppings.length * 50;
            }
        } else if (String(req.body.size) === "Medium") {
            total += 1000;
            if (chosenToppings) {
                total += chosenToppings.length * 100;
            }
        } else {
            total += 1200;
            if (chosenToppings) {
                total += chosenToppings.length * 125;
            }
        }

        if (glutenFree === 'Yes') {
            total += 200;
        }

        if (chosenToppings.includes("Truffle (Extra $1.00)")) {
            total += 100;
        }
        if (chosenToppings.includes("Steak (Extra $1.00)")) {
            total += 100;
        }
        if (chosenToppings.includes("Artichoke (Extra $0.50)")) {
            total += 50;
        }
        if (chosenToppings.includes("Gold Leaf (Extra $5.00)")) {
            total += 500;
        }
        return total/100;
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
        price: string;
        freeDelivery: string;
    }

    const newBuiltPizza: BuiltPizza = {
        size: size,
        toppings: chosenToppings,
        glutenFree: glutenFree,
        specialInstructions: specialInstructions,
        price: calcTotal().toFixed(2),
        freeDelivery: getFreeDelivery()
    }

    res.render('build-submission', {pizza: newBuiltPizza});
})

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
