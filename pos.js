/* EderStone Restaurant POS — rebuilt for reliable browser execution */
(function(){
'use strict';

var KEY='ederstone-pos-v3';
var MENU=[
['Chicken Pilau','Mains',650],['Beef Pilau','Mains',650],['Chicken Biryani','Mains',750],['Beef Biryani','Mains',800],['Chicken Curry','Mains',700],['Beef Stew','Mains',650],['Fish & Chips','Mains',700],
['Chicken Burger','Burgers',550],['Beef Burger','Burgers',600],['Cheese Burger','Burgers',650],
['Club Sandwich','Fast Food',500],['Chicken Shawarma','Fast Food',450],['Beef Shawarma','Fast Food',500],
['Chips Plain','Sides',200],['Chips Masala','Sides',300],
['Ugali & Sukuma','Local',300],['Ugali & Beef','Local',550],['Githeri Special','Local',350],['Mukimo & Beef','Local',550],
['Beef Samosa','Starters',120],['Chicken Wings','Starters',450],['Beef Sausage','Starters',180],['Vegetable Spring Rolls','Starters',250],
['Fresh Passion Juice','Drinks',180],['Fresh Mango Juice','Drinks',180],['Fresh Sugarcane Juice','Drinks',200],['Soda 500ml','Drinks',100],['Bottled Water','Drinks',80],['Tea','Drinks',100],['Coffee','Drinks',150],['Chai Latte','Drinks',220],
['Fruit Salad','Desserts',250],['Ice Cream','Desserts',220],['Chocolate Cake','Desserts',300],
['Mandazi','Breakfast',80],['Spanish Omelette','Breakfast',350],['Pancakes','Breakfast',300],['Full Breakfast','Breakfast',500],
['Beef Curry','Mains',680],['Chicken Stew','Mains',680],['Fish Curry','Mains',750],['Vegetable Curry','Mains',550],['Coconut Fish','Mains',780],
['Chicken Kebab','Grill',600],['Beef Kebab','Grill',650],['Grilled Chicken','Grill',750],['Grilled Beef','Grill',800],['Grilled Fish','Grill',850],['Chicken Tikka','Grill',700],['Beef Tikka','Grill',750],
['Chapati Beef','Local',600],['Chapati Chicken','Local',600],['Beans Stew','Local',350],['Beef Beans','Local',550],['Chicken Beans','Local',580],['Rice & Beans','Local',400],['Pilau Plain','Local',450],
['Chicken Pasta','Pasta',650],['Beef Pasta','Pasta',700],['Vegetable Pasta','Pasta',550],['Chicken Spaghetti','Pasta',650],['Beef Spaghetti','Pasta',700],['Vegetable Spaghetti','Pasta',550],
['Fish Burger','Burgers',700],['Veggie Burger','Burgers',550],['Egg Sandwich','Fast Food',350],['Tuna Sandwich','Fast Food',500],['Beef Wrap','Fast Food',550],['Chicken Wrap','Fast Food',500],
['Garlic Bread','Sides',250],['Masala Fries','Sides',350],['Vegetable Samosa','Starters',100],['Chicken Samosa','Starters',120],['Beef Meatballs','Starters',450],['Chicken Nuggets','Starters',450],['Garlic Chicken','Starters',500],
['Hot Chocolate','Drinks',200],['Ginger Tea','Drinks',150],['Spiced Milk Tea','Drinks',180],['Lemonade','Drinks',150],['Banana Pancakes','Breakfast',350],['French Toast','Breakfast',320],['Eggs & Sausage','Breakfast',400],['Eggs & Toast','Breakfast',300],['Chapati','Breakfast',100],['Samosa Platter','Starters',350],['Mixed Grill','Grill',1200],['Fruit Smoothie','Drinks',300],['Banana Smoothie','Drinks',280],['Mango Smoothie','Drinks',280],['Avocado Smoothie','Drinks',300],['Carrot Juice','Drinks',180],['Ginger Lemon Tea','Drinks',180],['Rice Pudding','Desserts',280],['Banana Cake','Desserts',300],['Vanilla Cake','Desserts',300],['Carrot Cake','Desserts',320],['Banana Bread','Desserts',280],['Chicken Soup','Starters',400],['Beef Soup','Starters',450],['Vegetable Soup','Starters',350],['Tomato Soup','Starters',320],['Lentil Soup','Starters',350],['Coconut Rice','Local',500],['Egg Curry','Local',450],['Chicken Coconut Curry','Mains',750],['Beef Coconut Curry','Mains',780],['Spiced Rice','Local',450],['Vegetable Rice','Local',420],['Chicken Fried Rice','Mains',680],['Beef Fried Rice','Mains',720],['Vegetable Fried Rice','Mains',580]
];
var RECIPES={
 'Chicken Pilau':[['Rice','kg',0.20],['Chicken','kg',0.15],['Cooking Oil','L',0.03],['Onions','kg',0.05],['Tomatoes','kg',0.03],['Salt','kg',0.005]],
 'Beef Pilau':[['Rice','kg',0.20],['Beef','kg',0.15],['Cooking Oil','L',0.03],['Onions','kg',0.05],['Tomatoes','kg',0.03],['Salt','kg',0.005]],
 'Chicken Biryani':[['Rice','kg',0.22],['Chicken','kg',0.16],['Cooking Oil','L',0.04],['Onions','kg',0.06],['Tomatoes','kg',0.03],['Salt','kg',0.005]],
 'Beef Biryani':[['Rice','kg',0.22],['Beef','kg',0.16],['Cooking Oil','L',0.04],['Onions','kg',0.06],['Tomatoes','kg',0.03],['Salt','kg',0.005]],
 'Chicken Curry':[['Chicken','kg',0.18],['Cooking Oil','L',0.03],['Onions','kg',0.05],['Tomatoes','kg',0.05],['Salt','kg',0.005]],
 'Beef Stew':[['Beef','kg',0.18],['Cooking Oil','L',0.03],['Onions','kg',0.05],['Tomatoes','kg',0.05],['Salt','kg',0.005]],
 'Fish & Chips':[['Fish','kg',0.18],['Potatoes','kg',0.25],['Cooking Oil','L',0.05],['Salt','kg',0.005]],
 'Chicken Burger':[['Chicken','kg',0.12],['Flour','kg',0.06],['Cooking Oil','L',0.02],['Onions','kg',0.02]],
 'Beef Burger':[['Beef','kg',0.12],['Flour','kg',0.06],['Cooking Oil','L',0.02],['Onions','kg',0.02]],
 'Cheese Burger':[['Beef','kg',0.10],['Cheese','kg',0.03],['Flour','kg',0.06],['Cooking Oil','L',0.02]],
 'Club Sandwich':[['Bread','pieces',3],['Chicken','kg',0.08],['Eggs','pieces',1],['Tomatoes','kg',0.03]],
 'Chicken Shawarma':[['Chicken','kg',0.12],['Flour','kg',0.06],['Onions','kg',0.02],['Tomatoes','kg',0.03]],
 'Beef Shawarma':[['Beef','kg',0.12],['Flour','kg',0.06],['Onions','kg',0.02],['Tomatoes','kg',0.03]],
 'Chips Plain':[['Potatoes','kg',0.25],['Cooking Oil','L',0.04],['Salt','kg',0.003]],
 'Chips Masala':[['Potatoes','kg',0.25],['Cooking Oil','L',0.04],['Tomatoes','kg',0.03],['Salt','kg',0.003]],
 'Ugali & Sukuma':[['Flour','kg',0.20],['Sukuma','kg',0.15],['Cooking Oil','L',0.02],['Salt','kg',0.003]],
 'Ugali & Beef':[['Flour','kg',0.20],['Beef','kg',0.15],['Cooking Oil','L',0.02],['Onions','kg',0.04],['Salt','kg',0.003]],
 'Githeri Special':[['Maize','kg',0.12],['Beans','kg',0.10],['Cooking Oil','L',0.02],['Onions','kg',0.03],['Salt','kg',0.003]],
 'Mukimo & Beef':[['Potatoes','kg',0.18],['Maize','kg',0.06],['Beans','kg',0.05],['Beef','kg',0.15],['Cooking Oil','L',0.02],['Salt','kg',0.003]],
 'Beef Samosa':[['Beef','kg',0.04],['Flour','kg',0.025],['Cooking Oil','L',0.02],['Onions','kg',0.01]],
 'Chicken Wings':[['Chicken','kg',0.20],['Flour','kg',0.03],['Cooking Oil','L',0.03],['Salt','kg',0.003]],
 'Beef Sausage':[['Beef','kg',0.08],['Cooking Oil','L',0.01]],
 'Vegetable Spring Rolls':[['Flour','kg',0.025],['Carrots','kg',0.03],['Cabbage','kg',0.04],['Cooking Oil','L',0.02]],
 'Fresh Passion Juice':[['Passion','kg',0.10],['Sugar','kg',0.02],['Water','L',0.25]],
 'Fresh Mango Juice':[['Mango','kg',0.10],['Sugar','kg',0.02],['Water','L',0.25]],
 'Fresh Sugarcane Juice':[['Sugarcane','kg',0.25],['Water','L',0.05]],
 'Soda 500ml':[['Soda','bottles',1]],
 'Bottled Water':[['Water','L',0.5]],
 'Tea':[['Tea Leaves','kg',0.005],['Sugar','kg',0.02],['Milk','L',0.15],['Water','L',0.20]],
 'Coffee':[['Coffee','kg',0.008],['Sugar','kg',0.02],['Milk','L',0.15],['Water','L',0.15]],
 'Chai Latte':[['Tea Leaves','kg',0.005],['Sugar','kg',0.02],['Milk','L',0.20],['Water','L',0.10]],
 'Fruit Salad':[['Mixed Fruit','kg',0.20]],
 'Ice Cream':[['Ice Cream Mix','kg',0.12]],
 'Chocolate Cake':[['Flour','kg',0.06],['Sugar','kg',0.03],['Eggs','pieces',1],['Cooking Oil','L',0.02]],
 'Mandazi':[['Flour','kg',0.06],['Sugar','kg',0.015],['Cooking Oil','L',0.02]],
 'Spanish Omelette':[['Eggs','pieces',3],['Potatoes','kg',0.12],['Onions','kg',0.03],['Cooking Oil','L',0.02]],
 'Pancakes':[['Flour','kg',0.06],['Eggs','pieces',1],['Milk','L',0.10],['Sugar','kg',0.015],['Cooking Oil','L',0.01]],
 'Full Breakfast':[['Eggs','pieces',2],['Sausage','pieces',2],['Bread','pieces',2],['Potatoes','kg',0.12],['Cooking Oil','L',0.02]],
 'Beef Curry':[['Beef','kg',0.18],['Cooking Oil','L',0.03],['Onions','kg',0.05],['Tomatoes','kg',0.05],['Garlic','kg',0.008],['Ginger','kg',0.008],['Curry Powder','kg',0.006],['Salt','kg',0.003]],
 'Chicken Stew':[['Chicken','kg',0.18],['Cooking Oil','L',0.03],['Onions','kg',0.05],['Tomatoes','kg',0.05],['Garlic','kg',0.008],['Ginger','kg',0.008],['Black Pepper','kg',0.002],['Salt','kg',0.003]],
 'Fish Curry':[['Fish','kg',0.18],['Cooking Oil','L',0.03],['Onions','kg',0.05],['Tomatoes','kg',0.05],['Coconut Milk','L',0.05],['Turmeric','kg',0.003],['Cumin','kg',0.002],['Salt','kg',0.003]],
 'Vegetable Curry':[['Carrots','kg',0.05],['Cabbage','kg',0.06],['Green Pepper','kg',0.03],['Tomatoes','kg',0.05],['Onions','kg',0.04],['Cooking Oil','L',0.03],['Curry Powder','kg',0.005],['Salt','kg',0.003]],
 'Coconut Fish':[['Fish','kg',0.18],['Coconut Milk','L',0.10],['Onions','kg',0.04],['Tomatoes','kg',0.04],['Garlic','kg',0.006],['Ginger','kg',0.006],['Lemon','kg',0.01],['Salt','kg',0.003]],
 'Chicken Kebab':[['Chicken','kg',0.16],['Onions','kg',0.03],['Green Pepper','kg',0.03],['Cooking Oil','L',0.02],['Paprika','kg',0.003],['Salt','kg',0.003]],
 'Beef Kebab':[['Beef','kg',0.16],['Onions','kg',0.03],['Green Pepper','kg',0.03],['Cooking Oil','L',0.02],['Black Pepper','kg',0.003],['Salt','kg',0.003]],
 'Grilled Chicken':[['Chicken','kg',0.22],['Lemon','kg',0.01],['Garlic','kg',0.008],['Ginger','kg',0.006],['Paprika','kg',0.003],['Cooking Oil','L',0.02],['Salt','kg',0.003]],
 'Grilled Beef':[['Beef','kg',0.22],['Lemon','kg',0.01],['Garlic','kg',0.008],['Black Pepper','kg',0.003],['Cooking Oil','L',0.02],['Salt','kg',0.003]],
 'Grilled Fish':[['Fish','kg',0.22],['Lemon','kg',0.01],['Garlic','kg',0.006],['Black Pepper','kg',0.003],['Cooking Oil','L',0.02],['Salt','kg',0.003]],
 'Chicken Tikka':[['Chicken','kg',0.18],['Yoghurt','L',0.04],['Garlic','kg',0.006],['Ginger','kg',0.006],['Garam Masala','kg',0.004],['Paprika','kg',0.003],['Cooking Oil','L',0.02],['Salt','kg',0.003]],
 'Beef Tikka':[['Beef','kg',0.18],['Yoghurt','L',0.04],['Garlic','kg',0.006],['Ginger','kg',0.006],['Garam Masala','kg',0.004],['Paprika','kg',0.003],['Cooking Oil','L',0.02],['Salt','kg',0.003]],
 'Chapati Beef':[['Flour','kg',0.10],['Beef','kg',0.12],['Onions','kg',0.03],['Tomatoes','kg',0.03],['Cooking Oil','L',0.03],['Salt','kg',0.003]],
 'Chapati Chicken':[['Flour','kg',0.10],['Chicken','kg',0.12],['Onions','kg',0.03],['Tomatoes','kg',0.03],['Cooking Oil','L',0.03],['Salt','kg',0.003]],
 'Beans Stew':[['Beans','kg',0.18],['Tomatoes','kg',0.04],['Onions','kg',0.04],['Cooking Oil','L',0.02],['Garlic','kg',0.004],['Salt','kg',0.003]],
 'Beef Beans':[['Beans','kg',0.12],['Beef','kg',0.12],['Tomatoes','kg',0.04],['Onions','kg',0.04],['Cooking Oil','L',0.02],['Salt','kg',0.003]],
 'Chicken Beans':[['Beans','kg',0.12],['Chicken','kg',0.12],['Tomatoes','kg',0.04],['Onions','kg',0.04],['Cooking Oil','L',0.02],['Salt','kg',0.003]],
 'Rice & Beans':[['Rice','kg',0.18],['Beans','kg',0.10],['Onions','kg',0.03],['Cooking Oil','L',0.02],['Salt','kg',0.003]],
 'Pilau Plain':[['Rice','kg',0.22],['Onions','kg',0.06],['Cooking Oil','L',0.03],['Pilau Masala','kg',0.006],['Cinnamon','kg',0.002],['Cardamom','kg',0.001],['Cloves','kg',0.001],['Salt','kg',0.003]],
 'Chicken Pasta':[['Pasta','kg',0.16],['Chicken','kg',0.12],['Tomatoes','kg',0.04],['Onions','kg',0.03],['Garlic','kg',0.006],['Cooking Oil','L',0.02],['Salt','kg',0.003]],
 'Beef Pasta':[['Pasta','kg',0.16],['Beef','kg',0.12],['Tomatoes','kg',0.04],['Onions','kg',0.03],['Garlic','kg',0.006],['Cooking Oil','L',0.02],['Salt','kg',0.003]],
 'Vegetable Pasta':[['Pasta','kg',0.16],['Carrots','kg',0.04],['Cabbage','kg',0.04],['Green Pepper','kg',0.03],['Tomatoes','kg',0.04],['Cooking Oil','L',0.02],['Salt','kg',0.003]],
 'Chicken Spaghetti':[['Spaghetti','kg',0.16],['Chicken','kg',0.12],['Tomatoes','kg',0.04],['Onions','kg',0.03],['Garlic','kg',0.006],['Cooking Oil','L',0.02],['Salt','kg',0.003]],
 'Beef Spaghetti':[['Spaghetti','kg',0.16],['Beef','kg',0.12],['Tomatoes','kg',0.04],['Onions','kg',0.03],['Garlic','kg',0.006],['Cooking Oil','L',0.02],['Salt','kg',0.003]],
 'Vegetable Spaghetti':[['Spaghetti','kg',0.16],['Carrots','kg',0.04],['Green Pepper','kg',0.03],['Tomatoes','kg',0.04],['Onions','kg',0.03],['Cooking Oil','L',0.02],['Salt','kg',0.003]],
 'Fish Burger':[['Fish','kg',0.12],['Bread','pieces',1],['Eggs','pieces',1],['Breadcrumbs','kg',0.04],['Lettuce','kg',0.02],['Tomatoes','kg',0.02],['Cooking Oil','L',0.02]],
 'Veggie Burger':[['Flour','kg',0.04],['Carrots','kg',0.03],['Cabbage','kg',0.03],['Beans','kg',0.05],['Bread','pieces',1],['Cooking Oil','L',0.02],['Salt','kg',0.003]],
 'Egg Sandwich':[['Bread','pieces',2],['Eggs','pieces',2],['Tomatoes','kg',0.02],['Onions','kg',0.01],['Cooking Oil','L',0.01]],
 'Tuna Sandwich':[['Bread','pieces',2],['Tuna','kg',0.08],['Mayonnaise','L',0.02],['Lettuce','kg',0.02],['Tomatoes','kg',0.02]],
 'Beef Wrap':[['Flour','kg',0.06],['Beef','kg',0.10],['Lettuce','kg',0.02],['Tomatoes','kg',0.02],['Onions','kg',0.02],['Mayonnaise','L',0.01]],
 'Chicken Wrap':[['Flour','kg',0.06],['Chicken','kg',0.10],['Lettuce','kg',0.02],['Tomatoes','kg',0.02],['Onions','kg',0.02],['Mayonnaise','L',0.01]],
 'Garlic Bread':[['Bread','pieces',2],['Garlic','kg',0.006],['Butter','kg',0.02]],
 'Masala Fries':[['Potatoes','kg',0.25],['Cooking Oil','L',0.04],['Paprika','kg',0.003],['Curry Powder','kg',0.003],['Salt','kg',0.003]],
 'Vegetable Samosa':[['Flour','kg',0.025],['Carrots','kg',0.02],['Cabbage','kg',0.03],['Peas','kg',0.02],['Cooking Oil','L',0.02],['Salt','kg',0.002]],
 'Chicken Samosa':[['Chicken','kg',0.04],['Flour','kg',0.025],['Onions','kg',0.01],['Cooking Oil','L',0.02],['Cumin','kg',0.001],['Salt','kg',0.002]],
 'Beef Meatballs':[['Beef','kg',0.15],['Eggs','pieces',1],['Breadcrumbs','kg',0.03],['Onions','kg',0.02],['Garlic','kg',0.004],['Cooking Oil','L',0.02],['Salt','kg',0.003]],
 'Chicken Nuggets':[['Chicken','kg',0.14],['Flour','kg',0.04],['Eggs','pieces',1],['Breadcrumbs','kg',0.04],['Cooking Oil','L',0.03],['Salt','kg',0.003]],
 'Garlic Chicken':[['Chicken','kg',0.18],['Garlic','kg',0.012],['Ginger','kg',0.006],['Cooking Oil','L',0.03],['Soy Sauce','L',0.02],['Salt','kg',0.003]],
 'Hot Chocolate':[['Milk','L',0.20],['Cocoa','kg',0.015],['Sugar','kg',0.02],['Water','L',0.05]],
 'Ginger Tea':[['Tea Leaves','kg',0.005],['Ginger','kg',0.006],['Sugar','kg',0.02],['Water','L',0.20]],
 'Spiced Milk Tea':[['Tea Leaves','kg',0.005],['Milk','L',0.18],['Sugar','kg',0.02],['Ginger','kg',0.004],['Cinnamon','kg',0.001],['Cardamom','kg',0.001],['Water','L',0.12]],
 'Lemonade':[['Lemon Juice','L',0.04],['Sugar','kg',0.025],['Water','L',0.25]],
 'Banana Pancakes':[['Flour','kg',0.06],['Banana','kg',0.08],['Eggs','pieces',1],['Milk','L',0.08],['Sugar','kg',0.01],['Cooking Oil','L',0.01]],
 'French Toast':[['Bread','pieces',2],['Eggs','pieces',2],['Milk','L',0.08],['Sugar','kg',0.01],['Cooking Oil','L',0.01],['Cinnamon','kg',0.001]],
 'Eggs & Sausage':[['Eggs','pieces',2],['Sausage','pieces',2],['Cooking Oil','L',0.01],['Salt','kg',0.002]],
 'Eggs & Toast':[['Eggs','pieces',2],['Bread','pieces',2],['Cooking Oil','L',0.01],['Salt','kg',0.002]],
 'Chapati':[['Flour','kg',0.07],['Cooking Oil','L',0.02],['Salt','kg',0.002]],
 'Samosa Platter':[['Beef','kg',0.04],['Chicken','kg',0.04],['Flour','kg',0.05],['Onions','kg',0.02],['Cooking Oil','L',0.04],['Salt','kg',0.003]],
 'Mixed Grill':[['Chicken','kg',0.10],['Beef','kg',0.10],['Sausage','pieces',1],['Fish','kg',0.08],['Onions','kg',0.03],['Green Pepper','kg',0.03],['Cooking Oil','L',0.03],['Salt','kg',0.004]],
 'Fruit Smoothie':[['Mixed Fruit','kg',0.15],['Yoghurt','L',0.10],['Sugar','kg',0.015],['Water','L',0.10]],
 'Banana Smoothie':[['Banana','kg',0.15],['Milk','L',0.15],['Yoghurt','L',0.08],['Sugar','kg',0.015]],
 'Mango Smoothie':[['Mango','kg',0.15],['Milk','L',0.15],['Yoghurt','L',0.08],['Sugar','kg',0.015]],
 'Avocado Smoothie':[['Avocado','kg',0.15],['Milk','L',0.15],['Yoghurt','L',0.08],['Sugar','kg',0.015]],
 'Carrot Juice':[['Carrots','kg',0.12],['Lemon Juice','L',0.01],['Sugar','kg',0.015],['Water','L',0.15]],
 'Ginger Lemon Tea':[['Tea Leaves','kg',0.005],['Ginger','kg',0.006],['Lemon Juice','L',0.02],['Sugar','kg',0.015],['Water','L',0.20]],
 'Rice Pudding':[['Rice','kg',0.06],['Milk','L',0.15],['Sugar','kg',0.025],['Cinnamon','kg',0.001]],
 'Banana Cake':[['Flour','kg',0.06],['Banana','kg',0.08],['Eggs','pieces',1],['Sugar','kg',0.03],['Cooking Oil','L',0.02],['Baking Powder','kg',0.002]],
 'Vanilla Cake':[['Flour','kg',0.06],['Eggs','pieces',1],['Sugar','kg',0.03],['Milk','L',0.04],['Vanilla','L',0.002],['Baking Powder','kg',0.002]],
 'Carrot Cake':[['Flour','kg',0.06],['Carrots','kg',0.05],['Eggs','pieces',1],['Sugar','kg',0.03],['Cooking Oil','L',0.02],['Baking Powder','kg',0.002]],
 'Banana Bread':[['Flour','kg',0.06],['Banana','kg',0.08],['Eggs','pieces',1],['Sugar','kg',0.025],['Cooking Oil','L',0.02],['Baking Powder','kg',0.002]],
 'Chicken Soup':[['Chicken','kg',0.15],['Carrots','kg',0.03],['Onions','kg',0.03],['Garlic','kg',0.004],['Chicken Stock','L',0.20],['Ginger','kg',0.003],['Salt','kg',0.003]],
 'Beef Soup':[['Beef','kg',0.15],['Carrots','kg',0.03],['Onions','kg',0.03],['Garlic','kg',0.004],['Beef Stock','L',0.20],['Ginger','kg',0.003],['Salt','kg',0.003]],
 'Vegetable Soup':[['Carrots','kg',0.05],['Cabbage','kg',0.05],['Green Pepper','kg',0.03],['Onions','kg',0.03],['Vegetable Stock','L',0.20],['Salt','kg',0.003]],
 'Tomato Soup':[['Tomatoes','kg',0.12],['Onions','kg',0.03],['Garlic','kg',0.004],['Tomato Paste','kg',0.02],['Vegetable Stock','L',0.20],['Salt','kg',0.003]],
 'Lentil Soup':[['Lentils','kg',0.12],['Tomatoes','kg',0.04],['Onions','kg',0.03],['Garlic','kg',0.004],['Cumin','kg',0.002],['Vegetable Stock','L',0.20],['Salt','kg',0.003]],
 'Coconut Rice':[['Rice','kg',0.20],['Coconut Milk','L',0.10],['Onions','kg',0.03],['Salt','kg',0.003]],
 'Egg Curry':[['Eggs','pieces',2],['Tomatoes','kg',0.05],['Onions','kg',0.04],['Coconut Milk','L',0.05],['Curry Powder','kg',0.004],['Cooking Oil','L',0.02],['Salt','kg',0.003]],
 'Chicken Coconut Curry':[['Chicken','kg',0.18],['Coconut Milk','L',0.10],['Onions','kg',0.05],['Tomatoes','kg',0.04],['Garlic','kg',0.006],['Ginger','kg',0.006],['Curry Powder','kg',0.004],['Cooking Oil','L',0.03],['Salt','kg',0.003]],
 'Beef Coconut Curry':[['Beef','kg',0.18],['Coconut Milk','L',0.10],['Onions','kg',0.05],['Tomatoes','kg',0.04],['Garlic','kg',0.006],['Ginger','kg',0.006],['Curry Powder','kg',0.004],['Cooking Oil','L',0.03],['Salt','kg',0.003]],
 'Spiced Rice':[['Rice','kg',0.20],['Onions','kg',0.04],['Garlic','kg',0.004],['Cumin','kg',0.002],['Cinnamon','kg',0.001],['Cardamom','kg',0.001],['Cooking Oil','L',0.02],['Salt','kg',0.003]],
 'Vegetable Rice':[['Rice','kg',0.20],['Carrots','kg',0.04],['Peas','kg',0.03],['Green Pepper','kg',0.03],['Onions','kg',0.03],['Cooking Oil','L',0.02],['Salt','kg',0.003]],
 'Chicken Fried Rice':[['Rice','kg',0.20],['Chicken','kg',0.12],['Eggs','pieces',1],['Carrots','kg',0.03],['Peas','kg',0.02],['Soy Sauce','L',0.01],['Cooking Oil','L',0.03],['Onions','kg',0.03],['Salt','kg',0.003]],
 'Beef Fried Rice':[['Rice','kg',0.20],['Beef','kg',0.12],['Eggs','pieces',1],['Carrots','kg',0.03],['Peas','kg',0.02],['Soy Sauce','L',0.01],['Cooking Oil','L',0.03],['Onions','kg',0.03],['Salt','kg',0.003]],
 'Vegetable Fried Rice':[['Rice','kg',0.20],['Eggs','pieces',1],['Carrots','kg',0.03],['Peas','kg',0.03],['Green Pepper','kg',0.03],['Soy Sauce','L',0.01],['Cooking Oil','L',0.03],['Onions','kg',0.03],['Salt','kg',0.003]]
};
var SEED={
 settings:{name:'Ederstone Restaurant',tax:0,service:0},
 tables:Array.from({length:16},function(_,i){return {id:i+1,status:'Open',order:[],paid:false,ready:false};}),
 menu:MENU.map(function(x){return x.slice();}),
 inventory:[['Rice','kg',32,10],['Chicken','kg',18,6],['Beef','kg',22,7],['Fish','kg',10,3],['Cooking Oil','L',20,5],['Potatoes','kg',45,12],['Passion','kg',8,4],['Mango','kg',12,4],['Soda','bottles',48,12],['Flour','kg',30,8],['Sugar','kg',18,5],['Onions','kg',10,3],['Tomatoes','kg',10,3],['Sukuma','kg',8,2],['Maize','kg',15,4],['Beans','kg',15,4],['Cheese','kg',5,1],['Bread','pieces',60,12],['Eggs','pieces',120,20],['Carrots','kg',8,2],['Cabbage','kg',8,2],['Water','L',100,20],['Sugarcane','kg',20,5],['Tea Leaves','kg',3,1],['Milk','L',20,5],['Coffee','kg',3,1],['Mixed Fruit','kg',15,4],['Ice Cream Mix','kg',10,3],['Sausage','pieces',60,15],['Salt','kg',5,1],['Ginger','kg',3,0.8],['Garlic','kg',3,0.8],['Cinnamon','kg',1,0.25],['Cardamom','kg',1,0.25],['Cumin','kg',1,0.25],['Coriander','kg',1,0.25],['Turmeric','kg',1,0.25],['Black Pepper','kg',1,0.25],['Paprika','kg',1,0.25],['Curry Powder','kg',2,0.5],['Pilau Masala','kg',2,0.5],['Garam Masala','kg',1,0.25],['Chilli','kg',2,0.5],['Lemon','kg',5,1],['Coconut Milk','L',8,2],['Tomato Paste','kg',3,0.8],['Soy Sauce','L',3,0.8],['Vinegar','L',3,0.8],['Pasta','kg',10,2],['Spaghetti','kg',10,2],['Tuna','kg',5,1],['Avocado','kg',8,2],['Banana','kg',10,2],['Lentils','kg',8,2],['Coconut','kg',5,1],['Breadcrumbs','kg',5,1],['Yoghurt','L',5,1],['Vanilla','L',1,0.2],['Cocoa','kg',3,0.8],['Baking Powder','kg',2,0.5],['Lemon Juice','L',3,0.8],['Peas','kg',5,1],['Green Pepper','kg',5,1],['Coriander Leaves','kg',2,0.5],['Mint','kg',2,0.5],['Lettuce','kg',5,1],['Mayonnaise','L',4,1],['Ketchup','L',4,1],['Chicken Stock','L',5,1],['Beef Stock','L',5,1],['Vegetable Stock','L',5,1],['Cream','L',5,1],['Chocolate','kg',5,1],['Cloves','kg',1,0.25],['Butter','kg',3,0.8]],
 foodStock:MENU.map(function(x){return {name:x[0],qty:100,reorder:10,unit:'pieces'}; }),
 staff:[['Kitchen 01','Kitchen Staff','Kitchen Staff','seed'],['Delivery 01','Delivery Staff','Delivery Staff','seed'],['Waiter 01','Waiter','Waiter','seed']],
 orders:[],
 recipes:{},
 kitchenJobs:[],
 deliveryJobs:[],
 unfinishedTasks:[]
};
function copy(v){return JSON.parse(JSON.stringify(v));}
function freshDB(){return copy(SEED);}
function loadDB(){
 try{
   var shared=window.EderStoneData&&window.EderStoneData.pos?window.EderStoneData.pos.get():(window.EderStoneStore&&window.EderStoneStore.get('pos',null));
   var raw=localStorage.getItem(KEY);
   var d=shared&&typeof shared==='object'?shared:(raw?JSON.parse(raw):freshDB());
   if(!d||typeof d!=='object') d=freshDB();
   if(!d.settings||typeof d.settings!=='object') d.settings=copy(SEED.settings);
   if(!Array.isArray(d.tables)||d.tables.length!==16) d.tables=copy(SEED.tables);
   if(!Array.isArray(d.menu)||!d.menu.length) d.menu=copy(SEED.menu);
   d.menu=d.menu.filter(function(x){return Array.isArray(x)&&String(x[0]||'').trim();}).map(function(x){return [String(x[0]).trim(),String(x[1]||'Mains').trim(),Number(x[2])||0];});
   if(!d.menu.length)d.menu=copy(SEED.menu);
   if(!Array.isArray(d.inventory)) d.inventory=copy(SEED.inventory);
   var existingIngredients={};d.inventory.forEach(function(x){existingIngredients[x[0]]=true;});
   SEED.inventory.forEach(function(x){if(!existingIngredients[x[0]])d.inventory.push(copy(x));});
   if(!Array.isArray(d.foodStock)) d.foodStock=copy(SEED.foodStock);
   var stockNames={}; d.foodStock.forEach(function(s){stockNames[s.name]=true;});
   d.menu.forEach(function(m){if(!stockNames[m[0]])d.foodStock.push({name:m[0],qty:100,reorder:10,unit:'pieces'});});
   if(!Array.isArray(d.staff)) d.staff=copy(SEED.staff);
   d.staff=d.staff.map(function(s){
     if(!Array.isArray(s))return null;
     var name=String(s[0]||'Unnamed').trim();
     var rawRole=String(s[2]||s[1]||'').trim().toLowerCase();
     var role=rawRole.indexOf('kitchen')!==-1||rawRole.indexOf('chef')!==-1||rawRole.indexOf('cook')!==-1?'Kitchen Staff':
              rawRole.indexOf('delivery')!==-1?'Delivery Staff':
              rawRole.indexOf('waiter')!==-1?'Waiter':null;
     return role?[name,role,role,s[3]||'seed']:null;
   }).filter(function(s){return !!s;});
   if(!d.staff.length)d.staff=copy(SEED.staff);
   if(!Array.isArray(d.orders)) d.orders=[];
   if(!d.recipes||typeof d.recipes!=='object') d.recipes={};
   if(!Array.isArray(d.kitchenJobs)) d.kitchenJobs=[];
   if(!Array.isArray(d.deliveryJobs)) d.deliveryJobs=[];
   if(!Array.isArray(d.unfinishedTasks)) d.unfinishedTasks=[];
   return d;
 }catch(e){return freshDB();}
}
var db=loadDB();

function refreshFromSharedState(){
  if(!window.EderStoneStore)return;
  var latest=window.EderStoneStore.get('pos',null);
  if(!latest||typeof latest!=='object')return;
  db=latest;
  updateUnfinishedBadge();
  if(currentView&&VIEWS[currentView]) VIEWS[currentView]();
}

var cart=[];
var activeTable=null;
var orderType='Takeaway';
var payment='M-Pesa';
var category='All';
var currentView='';
var viewStack=[];
var app=null;
var modal=null;
var restockFilter=[];
var deliveryCustomer={name:'',phone:'',address:''};
var pendingCookOrder=null;

function save(){
 try{
   if(window.EderStoneData&&window.EderStoneData.pos) window.EderStoneData.pos.set(db); else if(window.EderStoneStore) window.EderStoneStore.set('pos',db);
   // Keep the legacy key during migration so older POS sessions can recover safely.
   localStorage.setItem(KEY,JSON.stringify(db));
 }catch(e){}
}
window.addEventListener('ederstone:state-change',function(event){
 if(event.detail&&event.detail.key==='pos'&&event.detail.source==='storage') refreshFromSharedState();
});
function recipeFor(name){return (db&&db.recipes&&db.recipes[name])||RECIPES[name]||[];}
function ingredientByName(name){return db.inventory.find(function(x){return x[0]===name;});}
function ensureRecipeIngredients(name,qty){var recipe=recipeFor(name),missing=[];recipe.forEach(function(r){var ing=ingredientByName(r[0]),need=Number(r[2])*qty,have=ing?Number(ing[2]):0;if(!ing||have+1e-9<need)missing.push({name:r[0],need:need,have:have,unit:r[1]});});return {ok:!missing.length,missing:missing};}
function consumeRecipe(name,qty){recipeFor(name).forEach(function(r){var ing=ingredientByName(r[0]);if(ing)ing[2]=Math.max(0,Number(ing[2])-Number(r[2])*qty);});}
function formatMissing(m){return m.map(function(x){return x.name+' ('+x.have.toFixed(3)+' '+x.unit+' left; need '+x.need.toFixed(3)+')';}).join(', ');}
function addUnfinishedTask(type,title,details,data){
 var key=type+'|'+title+'|'+JSON.stringify(data||{});
 var exists=db.unfinishedTasks.find(function(t){return t.key===key&&t.status==='open';});
 if(exists)return exists;
 var task={id:'UT-'+Date.now().toString().slice(-8)+'-'+Math.floor(Math.random()*100),key:key,type:type,title:title,details:details||'',data:data||{},status:'open',created:new Date().toLocaleString()};
 db.unfinishedTasks.push(task);
 save();
 updateUnfinishedBadge();
 return task;
}
function currentDeliveryCustomer(){
 var name=((document.getElementById('customerName')||{}).value||deliveryCustomer.name||'').trim();
 var phone=((document.getElementById('customerPhone')||{}).value||deliveryCustomer.phone||'').trim();
 var address=((document.getElementById('deliveryAddress')||{}).value||deliveryCustomer.address||'').trim();
 deliveryCustomer={name:name,phone:phone,address:address};
 return copy(deliveryCustomer);
}
function savePendingOrder(reason,clearAfter){
 if(!cart.length)return null;
 var customer=orderType==='Delivery'?currentDeliveryCustomer():null;
 var data={cart:copy(cart),activeTable:activeTable,orderType:orderType,payment:payment,customer:customer,reason:reason||'Order left unfinished'};
 var title=(activeTable?'Table '+activeTable+' ':'')+'Pending order';
 var details=cart.map(function(x){return x.name+' ×'+x.qty;}).join(', ');
 var task=addUnfinishedTask('order',title,'Order left unfinished: '+details,data);
 if(clearAfter){
   if(activeTable){
     var t=db.tables[activeTable-1];
     if(t){t.order=copy(cart);t.status='Busy';t.paid=false;t.ready=false;}
   }
   cart=[];activeTable=null;deliveryCustomer={name:'',phone:'',address:''};save();
 }
 return task;
}
function restorePendingOrder(task){
 if(!task||!task.data||!Array.isArray(task.data.cart))return false;
 cart=copy(task.data.cart);
 activeTable=task.data.activeTable||null;
 orderType=task.data.orderType||'Takeaway';
 payment=task.data.payment||'M-Pesa';
 category='All';
 deliveryCustomer=task.data.customer||{name:'',phone:'',address:''};
 return true;
}
function saveCurrentOrder(){
 if(!cart.length){toast('There is no unfinished order to save');return;}
 var task=savePendingOrder('Saved by operator',true);
 if(task){closeModal();view('unfinished');toast('Order saved under Unfinished Tasks');}
}
function closeUnfinishedTask(id){
 var t=db.unfinishedTasks.find(function(x){return x.id===id;});
 if(!t)return;
 t.status='resolved';t.resolved=new Date().toLocaleString();save();
}
function reviewUnfinishedTask(id){

 var pending=db.unfinishedTasks.find(function(x){return x.id===id&&x.status==='open';});
 if(pending){
   var required=pending.type==='delivery'?'delivery.update':(pending.type==='chef'?'kitchen.manage':'orders.create');
   if(!ederStoneCan(required)){toast('This task is restricted for your role');return;}
 }
 var t=db.unfinishedTasks.find(function(x){return x.id===id&&x.status==='open';});
 if(!t)return;
 if(t.type==='order'){
   restorePendingOrder(t);
   closeUnfinishedTask(t.id);
   view('orderEntry');
   toast('Pending order restored');
 }else if(t.type==='delivery'){
   closeUnfinishedTask(t.id);
   unfinishedTasks();
   toast('Delivery task cleared. No delivery assignment was made.');
 }else if(t.type==='chef'){
   restorePendingOrder(t);
   view('kitchen');
   setTimeout(function(){openChefAssignment(t.data.food,Number(t.data.qty)||1,t.id);},60);
 }else if(t.type==='restock'){
   var needed=t.data&&Array.isArray(t.data.missing)?t.data.missing:[];
   var stillMissing=needed.filter(function(m){
     var current=db.inventory.find(function(x){return x[0]===m.name;});
     return !current||Number(current[2])<Number(m.need);
   });
   if(!stillMissing.length){
     closeUnfinishedTask(t.id);
     toast('Restock task is already complete');
     return unfinishedTasks();
   }
   restockFilter=stillMissing.map(function(x){return x.name;});
   view('inventory');
 }
}
function staffRole(x){return String((x&&x[2])||((x&&x[1])||'')).trim();}
function kitchenChefs(){
 return db.staff.filter(function(x){return staffRole(x).toLowerCase()==='kitchen staff';});
}
function deliveryStaff(){
 return db.staff.filter(function(x){return staffRole(x).toLowerCase()==='delivery staff';});
}
function deliveryBusy(name){
 return db.deliveryJobs.some(function(j){
   return String(j.driver||'').trim()===String(name||'').trim()&&String(j.status||'').toLowerCase()==='assigned';
 });
}
function releaseDeliveryStaff(name){
 var jobs=db.deliveryJobs.filter(function(j){
   return String(j.driver||'').trim()===String(name||'').trim()&&String(j.status||'').toLowerCase()==='assigned';
 });
 if(!jobs.length){toast(name+' has no active delivery assignment');return;}
 db.deliveryJobs=db.deliveryJobs.filter(function(j){
   return !(String(j.driver||'').trim()===String(name||'').trim()&&String(j.status||'').toLowerCase()==='assigned');
 });
 save();updateUnfinishedBadge();staff();toast(name+' is available again');
}
function deliveryOrder(id){return db.orders.find(function(o){return o.id===id;});}
function openDeliveryAssignment(orderId,taskId){
 var o=deliveryOrder(orderId);
 if(!o){if(taskId)closeUnfinishedTask(taskId);return;}
 var available=deliveryStaff().filter(function(x){return !deliveryBusy(x[0]);});
 var busy=deliveryStaff().filter(function(x){return deliveryBusy(x[0]);});
 var busyCards=busy.map(function(x){
   var job=db.deliveryJobs.find(function(j){return j.driver===x[0]&&j.status==='assigned';});
   var ord=job&&deliveryOrder(job.orderId);
   return '<div class="item"><div class="item-line"><div><b>'+esc(x[0])+'</b><div class="muted">'+esc(ord?('Order '+ord.id+' · '+(ord.customer?ord.customer.address:'')):'Active delivery')+'</div></div><span class="badge warn">BUSY</span></div><button class="action" data-action="release-delivery" data-driver="'+esc(x[0])+'">Clear / release</button></div>';
 }).join('');
 var buttons=available.map(function(x){return '<button class="action primary" data-action="assign-delivery" data-order="'+esc(orderId)+'" data-task="'+esc(taskId||'')+'" data-driver="'+esc(x[0])+'">Assign '+esc(x[0])+'</button>';}).join('');
 if(!available.length){
   if(!taskId){var pending=addUnfinishedTask('delivery','Deliver order '+orderId,'All delivery staff are currently assigned. Waiting for a driver.',{orderId:orderId});taskId=pending.id;}
   setModal('<div class="problem-modal"><div class="problem-icon">🛵</div><div class="eyebrow">DELIVERY QUEUE</div><h2>No driver available</h2><p class="problem-reason">Order '+esc(orderId)+' is waiting for a delivery driver. Clear one of the currently assigned drivers below, then assign this order.</p><div class="panel"><h3>Currently assigned delivery staff</h3>'+busyCards+'</div><div class="problem-actions"><button class="action" data-action="go-staff">Open Staff</button><button class="action" data-action="close-modal">Close</button></div></div>');
   updateUnfinishedBadge();
   return;
 }
 setModal('<div class="problem-modal"><div class="problem-icon">🛵</div><div class="eyebrow">DELIVERY ASSIGNMENT</div><h2>Assign order '+esc(orderId)+'</h2><p class="problem-reason">'+(o.customer?esc(o.customer.name)+' · '+esc(o.customer.phone)+'<br>'+esc(o.customer.address):'Delivery details unavailable')+'</p><div class="problem-actions">'+buttons+'</div>'+(busyCards?'<div class="panel"><h3>Currently assigned drivers</h3>'+busyCards+'</div>':'')+'<button class="action problem-close" data-action="close-modal">Close</button></div>');
}
function assignDelivery(orderId,driver,taskId){
 if(!ederStoneCan('delivery.update')){toast('Delivery assignment is restricted');return;}
 if(!orderId||!driver)return;
 if(deliveryBusy(driver)){toast(driver+' is already on a delivery');return;}
 db.deliveryJobs.push({id:'DJ-'+Date.now().toString().slice(-8),orderId:orderId,driver:driver,status:'assigned',assigned:new Date().toLocaleString()});
 var t=taskId&&db.unfinishedTasks.find(function(x){return x.id===taskId;});
 if(t)t.status='resolved';
 save();closeModal();updateUnfinishedBadge();
 toast(driver+' assigned to deliver '+orderId);
}
function releaseDelivery(driver){
 if(!ederStoneCan('delivery.update')){toast('Delivery management is restricted');return;}
 var idx=db.deliveryJobs.findIndex(function(j){return j.driver===driver&&j.status==='assigned';});
 if(idx<0){toast(driver+' has no active delivery');return;}
 var j=db.deliveryJobs[idx];db.deliveryJobs.splice(idx,1);save();
 var t=db.unfinishedTasks.find(function(x){return x.status==='open'&&x.type==='delivery'&&x.data&&x.data.orderId===j.orderId;});
 if(t){closeModal();openDeliveryAssignment(j.orderId,t.id);}else{closeModal();toast(driver+' is available again');}
}
function chefBusy(name){
 return db.kitchenJobs.some(function(j){
   return String(j.chef||'').trim()===String(name||'').trim()&&String(j.status||'').toLowerCase()==='cooking';
 });
}
function releaseKitchenStaff(name){
 if(!ederStoneCan('kitchen.manage')){toast('Kitchen management is restricted');return;}
 var removed=0;
 db.kitchenJobs=db.kitchenJobs.filter(function(j){
   var match=String(j.chef||'').trim()===String(name||'').trim()&&String(j.status||'').toLowerCase()==='cooking';
   if(match)removed++;
   return !match;
 });
 if(removed){save();kitchen();staff();toast(name+' is available again');}
 else toast(name+' has no active cooking assignment');
}
function openCookQuantity(food,afterAction){
 var s=db.foodStock.find(function(x){return x.name===food;});
 if(!s){toast('Prepared food record not found');return;}
 var current=Math.max(0,Number(s.qty||0));
 var recipe=recipeFor(food);
 var rows=recipe.map(function(r){
   var ing=ingredientByName(r[0]),per=Number(r[2])||0,available=ing?Number(ing[2]):0;
   return '<div class="order-line"><span>'+esc(r[0])+' · '+esc(r[1])+'<small class="muted"> '+per+' '+esc(r[1])+' per food</small></span><b>'+available+' '+esc(r[1])+' left</b></div>';
 }).join('');
 setModal('<div class="section-head"><div><div class="eyebrow">KITCHEN / COOK FOOD</div><h2>'+esc(food)+'</h2></div><button class="action" data-action="close-modal">×</button></div>'+
 '<div class="panel"><div class="order-line"><span>Prepared stock now</span><b>'+current+' pieces</b></div></div>'+
 '<div class="field"><label>NUMBER OF UNITS TO COOK</label><input id="cookQuantity" type="number" min="1" step="1" value="1" inputmode="numeric" placeholder="Enter quantity"></div>'+
 (recipe.length?'<div class="panel"><h3>Inventory remaining</h3>'+rows+'</div>':'<div class="panel"><p class="muted">This food has no recipe yet. Set up its ingredients before cooking.</p></div>')+
 '<div class="problem-actions"><button class="action primary big" data-action="confirm-cook-quantity" data-food="'+esc(food)+'" data-after="'+esc(afterAction||'')+'">Continue to Kitchen</button><button class="action" data-action="close-modal">Cancel</button></div>');
 setTimeout(function(){var q=document.getElementById('cookQuantity');if(q){q.focus();q.select();}},40);
}
function confirmCookQuantity(food,afterAction){
 var qEl=document.getElementById('cookQuantity'),qty=Math.floor(Number(qEl&&qEl.value)||0);
 if(qty<=0){toast('Enter a valid whole number of units');return;}
 if(!recipeFor(food).length){openRecipeBuilder(food,qty,afterAction);return;}
 closeModal();
 view('kitchen');
 setTimeout(function(){openChefAssignment(food,qty,'');},60);
}
function openChefAssignment(food,qty,taskId){
 var available=kitchenChefs().filter(function(x){return !chefBusy(x[0]);});
 if(!available.length){
   addUnfinishedTask('chef','Cook '+food+' ×'+qty,'Waiting for a free chef.',{food:food,qty:qty});
   problemModal('No Kitchen Staff available','All kitchen staff currently have active cooking duties. The cooking task was saved under Unfinished Tasks.',[
     {label:'Open unfinished tasks',action:'go-unfinished',primary:true},
     {label:'Open Kitchen',action:'go-kitchen'}
   ]);
   return;
 }
 var buttons=available.map(function(x){
   return '<button class="action primary" data-action="assign-chef" data-food="'+esc(food)+'" data-qty="'+qty+'" data-task="'+esc(taskId||'')+'" data-chef="'+esc(x[0])+'">Assign '+esc(x[0])+'</button>';
 }).join('');
 setModal('<div class="problem-modal"><div class="problem-icon">♨</div><div class="eyebrow">KITCHEN ASSIGNMENT</div><h2>Assign Kitchen Staff</h2><p class="problem-reason">'+qty+' '+esc(food)+' will be prepared.</p><div class="problem-actions">'+buttons+'</div><button class="action" data-action="close-modal">Cancel</button></div>');
}
function assignChef(food,qty,chef,taskId){
 if(!food||qty<=0||!chef)return;
 if(chefBusy(chef)){toast(chef+' is already busy');return;}
 db.kitchenJobs.push({
   id:'KJ-'+Date.now().toString().slice(-8),
   food:food,qty:Number(qty),chef:chef,status:'cooking',
   started:new Date().toLocaleString(),finished:null
 });
 save();
 closeModal();kitchen();
 toast(chef+' assigned to cook '+qty+' '+food);
}
function finishKitchenJob(id){
 if(!ederStoneCan('kitchen.manage')){toast('Kitchen management is restricted');return;}
 var j=db.kitchenJobs.find(function(x){return x.id===id&&x.status==='cooking';});
 if(!j)return;
 var check=ensureRecipeIngredients(j.food,j.qty);
 if(!check.ok){openIngredientProblem(j.food,check.missing);return;}
 consumeRecipe(j.food,j.qty);
 var s=db.foodStock.find(function(x){return x.name===j.food;});
 if(!s){toast('Prepared food record not found');return;}
 s.qty=Number(s.qty||0)+Number(j.qty);
 j.status='finished';
 j.finished=new Date().toLocaleString();
 var chefTask=db.unfinishedTasks.find(function(t){return t.status==='open'&&t.type==='chef'&&t.data&&t.data.food===j.food&&Number(t.data.qty)===Number(j.qty);});
 if(chefTask){chefTask.status='resolved';chefTask.resolved=j.finished;}
 save();updateUnfinishedBadge();kitchen();
 toast(j.qty+' '+j.food+' added to prepared stock. '+j.chef+' finished.');
}
function clearFinishedJob(id){
 var idx=db.kitchenJobs.findIndex(function(x){return x.id===id&&x.status==='finished';});
 if(idx<0)return;
 var j=db.kitchenJobs[idx];
 db.kitchenJobs.splice(idx,1);
 save();kitchen();
 toast(j.chef+' is available again.');
}
function assignLowStock(name){
 var s=db.foodStock.find(function(x){return x.name===name;});
 var qty=Math.max(10,Number(s&&s.reorder||10));
 var task=addUnfinishedTask('chef','Cook '+name+' ×'+qty,'Prepared stock reached the low-stock threshold. The current order is saved and can be resumed after cooking.',{food:name,qty:qty,cart:copy(cart),activeTable:activeTable,orderType:orderType,payment:payment});
 closeModal();view('kitchen');
 setTimeout(function(){openChefAssignment(name,qty,task&&task.id);},60);
}
function lowStockReminder(name,remaining){
 if(Number(remaining)>10||Number(remaining)<0)return;
 setModal('<div class="problem-modal"><div class="problem-icon">⚠</div><div class="eyebrow">LOW STOCK REMINDER</div><h2>Stock is running low</h2><p class="problem-reason"><b>'+esc(name)+'</b> has only <b>'+Number(remaining)+'</b> prepared piece'+(Number(remaining)===1?'':'s')+' remaining.</p><div class="problem-actions"><button class="action primary" data-action="assign-low-stock" data-food="'+esc(name)+'">Assign Kitchen Staff now</button><button class="action" data-action="close-modal">Continue</button></div></div>');
}
function cookFood(i,qty){
 var s=db.foodStock[i];if(!s)return;
 if(!recipeFor(s.name).length){openCookQuantity(s.name,'');return;}
 openCookQuantity(s.name,'');
}
function cookFoodByName(name,qty){
 var s=db.foodStock.find(function(x){return x.name===name;});
 if(!s){toast('Prepared food record not found');return;}
 openCookQuantity(name,'order');
}
function receiveIngredient(i){
 var ing=db.inventory[i];if(!ing)return;
 var qty=Number(prompt('How much '+ing[0]+' received?','10'));
 if(!isFinite(qty)||qty<=0)return;
 ing[2]=Number(ing[2])+qty;
 var resolved=0;
 db.unfinishedTasks.forEach(function(t){
   if(t.status!=='open'||t.type!=='restock')return;
   var needed=t.data&&Array.isArray(t.data.missing)?t.data.missing:[];
   var stillMissing=needed.some(function(m){
     var current=db.inventory.find(function(x){return x[0]===m.name;});
     return !current||Number(current[2])<Number(m.need);
   });
   if(!stillMissing){t.status='resolved';t.resolved=new Date().toLocaleString();resolved++;}
 });
 save();inventory();updateUnfinishedBadge();
 toast(qty+' '+ing[0]+' added to kitchen inventory'+(resolved?' · '+resolved+' restock task completed':''));
}
function money(n){return 'KSh '+Math.round(Number(n)||0).toLocaleString('en-KE');}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function toast(msg){
 var t=document.getElementById('toast'); if(!t)return;
 t.textContent=msg; t.classList.add('show');
 clearTimeout(window.__ederToast);
 window.__ederToast=setTimeout(function(){t.classList.remove('show');},2400);
}
function problemModal(title,reason,actions){
 var buttons=actions||[];
 setModal('<div class="problem-modal"><div class="problem-icon">!</div><div class="eyebrow">POS ACTION DENIED</div><h2>'+esc(title)+'</h2><p class="problem-reason">'+esc(reason)+'</p><div class="problem-actions">'+buttons.map(function(a){
   var attrs=' data-action="'+esc(a.action)+'"';
   if(a.food!=null)attrs+=' data-food="'+esc(a.food)+'"';
   if(a.qty!=null)attrs+=' data-qty="'+esc(a.qty)+'"';
   if(a.task!=null)attrs+=' data-task="'+esc(a.task)+'"';
   return '<button class="action '+(a.primary?'primary':'')+'"'+attrs+'>'+esc(a.label)+'</button>';
 }).join('')+'</div><button class="action problem-close" data-action="close-modal">Close</button></div>');
}
function shortageText(missing){
 return missing.map(function(x){return x.name+': need '+x.need.toFixed(3)+' '+x.unit+', available '+x.have.toFixed(3)+' '+x.unit;}).join(' | ');
}
function openOrderStockProblem(name,available,pendingCart){
 pendingCookOrder={cart:copy(pendingCart||[]),food:name,activeTable:activeTable,orderType:orderType,payment:payment};
 problemModal('Food not prepared',name+' has no prepared stock. Choose Cook Food to prepare it before adding it to the order.',[
   {label:'Cook this food',action:'cook-food-from-order',primary:true,food:name,qty:(pendingCart&&pendingCart.find(function(x){return x.name===name;})||{qty:1}).qty}
 ]);
}
function openRecipeBuilder(food,qty,afterAction){
 var existing=recipeFor(food);
 var rows=(existing.length?existing:[['','', '']]).map(function(r,i){
   return recipeBuilderRow(i,r[0],r[2]);
 }).join('');
 setModal('<div class="section-head"><div><div class="eyebrow">FIRST-TIME COOKING SETUP</div><h2>'+esc(food)+'</h2></div><button class="action" data-action="close-modal">×</button></div>'+
 '<p class="muted">Select the ingredients used to make this food. Every ingredient comes directly from Kitchen Inventory. Set the quantity consumed for <b>1 prepared unit</b>. These quantities will be used automatically to reduce inventory whenever Kitchen Staff cooks this food.</p>'+
 '<div class="panel"><div class="order-line"><span>Food</span><b>'+esc(food)+'</b></div><div class="order-line"><span>Units to cook now</span><b>'+Number(qty||1)+'</b></div></div>'+
 '<div class="section-head"><h3>Ingredients used</h3><button class="action" data-action="add-recipe-ingredient">＋ Add ingredient</button></div>'+
 '<div id="recipeBuilderRows">'+rows+'</div>'+
 '<div class="problem-actions"><button class="action primary big" data-action="save-recipe-builder" data-food="'+esc(food)+'" data-qty="'+Number(qty||1)+'" data-after="'+esc(afterAction||'')+'">Save recipe & continue</button><button class="action" data-action="close-modal">Cancel</button></div>');
}
function recipeBuilderRow(index,ingredient,qty){
 return '<div class="panel recipe-builder-row" data-row="'+index+'"><div class="form-grid"><div class="field"><label>INGREDIENT FROM INVENTORY</label><select class="recipe-builder-ingredient">'+menuIngredientOptions(ingredient)+'</select></div><div class="field"><label>QUANTITY PER 1 FOOD UNIT</label><input class="recipe-builder-qty" type="number" min="0.0001" step="0.001" value="'+(Number(qty)||'')+'" placeholder="e.g. 0.150"></div><div class="field"><label>UNIT</label><input class="recipe-builder-unit" value="'+esc((ingredientByName(ingredient)||['',''])[1]||'')+'" readonly></div></div><div class="actions"><button class="action" data-action="remove-recipe-ingredient" data-row="'+index+'">Remove</button></div></div>';
}
function addRecipeBuilderRow(){
 var box=document.getElementById('recipeBuilderRows');if(!box)return;
 var count=box.querySelectorAll('.recipe-builder-row').length;
 box.insertAdjacentHTML('beforeend',recipeBuilderRow(count,'',''));
}
function removeRecipeBuilderRow(row){
 var box=document.getElementById('recipeBuilderRows');if(!box)return;
 var rows=box.querySelectorAll('.recipe-builder-row');
 if(rows.length<=1){toast('At least one ingredient is required');return;}
 var target=box.querySelector('.recipe-builder-row[data-row="'+row+'"]');if(target)target.remove();
}
function saveRecipeBuilder(food,qty,afterAction){
 var rows=document.querySelectorAll('#recipeBuilderRows .recipe-builder-row'),recipe=[],seen={};
 rows.forEach(function(row){
   var s=row.querySelector('.recipe-builder-ingredient'),q=row.querySelector('.recipe-builder-qty');
   var ingredient=s?s.value:'',amount=Number(q&&q.value);
   if(!ingredient||!isFinite(amount)||amount<=0)return;
   if(seen[ingredient]){recipe=null;return;}
   seen[ingredient]=true;
   var ing=ingredientByName(ingredient);
   if(ing)recipe.push([ingredient,ing[1],amount]);
 });
 if(!recipe||!recipe.length){toast('Select at least one inventory ingredient and enter its quantity');return;}
 if(recipe.length!==rows.length){toast('Complete every ingredient row and avoid duplicates');return;}
 var check=ensureRecipeIngredientsFromRecipe(recipe,Number(qty)||1);
 if(!check.ok){problemModal('Not enough inventory',shortageText(check.missing),[
   {label:'Go to inventory',action:'go-inventory',primary:true},
   {label:'Close',action:'close-modal'}
 ]);return;}
 if(!db.recipes)db.recipes={};
 db.recipes[food]=recipe;
 save();
 closeModal();
 if(afterAction==='order'&&pendingCookOrder){
   var pending=pendingCookOrder;pendingCookOrder=null;cart=copy(pending.cart);activeTable=pending.activeTable||null;orderType=pending.orderType||'Takeaway';payment=pending.payment||'M-Pesa';category='All';view('orderEntry');
   toast(food+' recipe saved. Choose the cooking quantity.');
   setTimeout(function(){openCookQuantity(food,'order');},60);
 }else{
   openCookQuantity(food,'');
 }
}
function ensureRecipeIngredientsFromRecipe(recipe,qty){
 var missing=[];
 (recipe||[]).forEach(function(r){
   var ing=ingredientByName(r[0]),need=Number(r[2])*qty,have=ing?Number(ing[2]):0;
   if(!ing||have+1e-9<need)missing.push({name:r[0],need:need,have:have,unit:r[1]});
 });
 return {ok:!missing.length,missing:missing};
}
function openIngredientProblem(name,missing){
 restockFilter=missing.map(function(x){return x.name;});
 addUnfinishedTask('restock','Restock ingredients for '+name,'Required ingredients: '+shortageText(missing),{food:name,ingredients:restockFilter.slice(),missing:missing});
 problemModal('Cooking denied','Not enough ingredients to prepare '+name+'. Missing: '+shortageText(missing),[
   {label:'View required restock',action:'go-restock',primary:true},
   {label:'Go to inventory',action:'go-inventory'}
 ]);
}
function collapsible(title,body,id,open){return '<div class="panel collapsible-panel"><button class="action collapse-toggle '+(open?'open':'')+'" data-action="toggle-collapse" data-target="'+id+'">'+esc(title)+' <span class="chevron">⌄</span></button><div id="'+id+'" class="collapsible-list '+(open?'open':'')+'">'+body+'</div></div>';}
function toggleCollapse(id){var x=document.getElementById(id);if(!x)return;x.classList.toggle('open');var b=document.querySelector('[data-target="'+id+'"]');if(b)b.classList.toggle('open',x.classList.contains('open'));}
function setModal(html){
 if(!modal)return;
 modal.querySelector('.modal-box').innerHTML=html;
 modal.classList.add('show');
}
function closeModal(){if(modal)modal.classList.remove('show');}

function shell(title,sub,body){
 if(!app)return;
 app.innerHTML='<section class="content">'+
 '<div class="title-row"><div><div class="eyebrow">EDERSTONE / RESTAURANT POS</div><h1 class="title">'+esc(title)+'</h1><p class="sub">'+esc(sub)+'</p></div>'+
 '<div class="page-actions"><button class="action" data-action="back">← Back</button><button class="action" data-action="dashboard">⌂ Home</button></div></div>'+
 body+
 '<footer class="pos-page-footer"><span>© 2026 EderStone Restaurant POS. All rights reserved.</span><span>ES • EderStone</span></footer>'+
 '</section>';
}

function dashboard(){
 var sales=db.orders.reduce(function(a,o){return a+Number(o.total||0);},0);
 var busy=db.tables.filter(function(t){return t.status==='Busy';}).length;
 shell('Command Center','Live restaurant overview.',
 '<div class="grid">'+
 '<div class="stat"><small>TODAY SALES</small><strong>'+money(sales)+'</strong><em>Live register</em></div>'+
 '<div class="stat"><small>ORDERS</small><strong>'+db.orders.length+'</strong><em>Completed</em></div>'+
 '<div class="stat"><small>BUSY TABLES</small><strong>'+busy+'/16</strong><em>Dining floor</em></div>'+
 '<div class="stat"><small>MENU ITEMS</small><strong>'+db.menu.length+'</strong><em>Ready to sell</em></div></div>'+
 '<div class="two"><div class="panel"><div class="section-head"><h3>Quick actions</h3></div><div class="actions">'+
 '<button class="action primary" data-action="new-order">＋ New order</button><button class="action" data-action="view" data-view="tables">▥ Tables</button><button class="action" data-action="view" data-view="kitchen">♨ Kitchen</button>'+
 '</div></div><div class="panel"><div class="section-head"><h3>Recent sales</h3></div><div class="list">'+
 (db.orders.slice(-5).reverse().map(function(o){return '<div class="order-card"><div class="order-line"><b>'+esc(o.id)+'</b><strong>'+money(o.total)+'</strong></div><span class="muted">'+esc(o.type)+' · '+esc(o.payment)+'</span></div>';}).join('')||'<p class="muted">No sales yet.</p>')+
 '</div></div></div>');
}

function tableCard(t){
 var total=t.order.reduce(function(a,x){return a+Number(x.price||0)*Number(x.qty||0);},0);
 var items=t.order.reduce(function(a,x){return a+Number(x.qty||0);},0);
 var busy=t.status==='Busy';
 return '<div class="table-card '+(busy?'busy':'open')+'">'+
 '<div class="table-open" data-action="open-table" data-id="'+t.id+'"><h4>Table '+t.id+'</h4><span class="badge '+(busy?'warn':'good')+'">'+(busy?(t.paid?'PAID · OCCUPIED':'BUSY'):'AVAILABLE')+'</span><p class="muted">'+(items?items+' items · '+money(total):'Ready for a new order')+'</p></div>'+
 (busy?'<button class="action danger-btn" data-action="clear-table" data-id="'+t.id+'">✓ Clear table</button>':'<button class="action primary" data-action="open-table" data-id="'+t.id+'">Start order</button>')+
 '</div>';
}
function tables(){
 var busy=db.tables.filter(function(t){return t.status==='Busy';});
 var open=db.tables.filter(function(t){return t.status!=='Busy';});
 shell('Tables','Busy tables stay occupied until explicitly cleared. Search by table number or food item.',
 '<div class="panel"><input class="search" id="tableSearch" placeholder="Search tables or food..."></div><div id="tableBoard"><div class="table-summary"><span>🟢 '+open.length+' available</span><span>🟠 '+busy.length+' occupied</span></div>'+
 '<h3 class="table-section-title">Occupied tables</h3><div class="table-grid">'+(busy.map(tableCard).join('')||'<p class="muted">No occupied tables.</p>')+'</div>'+
 '<h3 class="table-section-title">Available tables</h3><div class="table-grid">'+(open.map(tableCard).join('')||'<p class="muted">No available tables.</p>')+'</div></div>');
 var search=document.getElementById('tableSearch');
 if(search)search.addEventListener('input',function(){var q=search.value.toLowerCase().trim();document.querySelectorAll('#tableBoard .table-card').forEach(function(card){card.style.display=!q||String(card.textContent||'').toLowerCase().indexOf(q)!==-1?'':'none';});});
}

function newOrder(){
 if(!ederStoneCan('orders.create')){toast('Your role cannot create orders');return;}
 activeTable=null;
 cart=[];
 orderType='Takeaway';
 payment='M-Pesa';
 category='All';
 deliveryCustomer={name:'',phone:'',address:''};
 view('newOrder');
}
function openTable(id){
 if(!ederStoneCan('pos.read')){toast('Opening tables is restricted');return;}
 var t=db.tables[id-1];
 if(!t){toast('Table not found');return;}
 if(t.status==='Busy'&&t.paid){toast('Clear the paid table before starting another order');return;}
 activeTable=id;orderType='Dine-in';payment='M-Pesa';category='All';deliveryCustomer={name:'',phone:'',address:''};cart=copy(t.order||[]);view('orderEntry');
}
function subtotal(){return cart.reduce(function(a,x){return a+Number(x.price||0)*Number(x.qty||0);},0);}
function grand(){return subtotal()*(1+(Number(db.settings.tax)||0)/100+(Number(db.settings.service)||0)/100);}
function menuCards(items){
 var list=Array.isArray(items)?items:[];
 if(!list.length)return '<div class="menu-empty"><strong>No menu items available.</strong><small>The restaurant menu could not be loaded. Refreshing the menu data is available in Settings.</small></div>';
 return list.map(function(x){
   var i=db.menu.indexOf(x);
   return '<div class="item" data-action="add-item" data-index="'+i+'"><div class="category">'+esc(x[1])+'</div><div class="item-line"><b>'+esc(x[0])+'</b><span class="price">'+money(x[2])+'</span></div><small>Tap to add</small></div>';
 }).join('');
}
function orderView(){
 var cats=['All'].concat(Array.from(new Set(db.menu.filter(function(x){return Array.isArray(x);}).map(function(x){return x[1];}))));
 var filtered=category==='All'?db.menu:db.menu.filter(function(x){return x[1]===category;});
 var catButtons=cats.map(function(c){return '<button class="filter '+(category===c?'active':'')+'" data-action="category" data-category="'+esc(c)+'">'+esc(c)+'</button>';}).join('');
 var rows=cart.map(function(x,i){return '<div class="cart-row"><div><b>'+esc(x.name)+'</b><div class="muted">'+money(x.price)+' × '+x.qty+'</div></div><div class="qty"><button data-action="qty" data-index="'+i+'" data-delta="-1">−</button><b>'+x.qty+'</b><button data-action="qty" data-index="'+i+'" data-delta="1">+</button></div></div>';}).join('');
 var customer=deliveryCustomer||{name:'',phone:'',address:''};
 var delivery=orderType==='Delivery'?'<div class="delivery-box"><input id="customerName" placeholder="Customer name" value="'+esc(customer.name||'')+'"><input id="customerPhone" inputmode="tel" placeholder="07XXXXXXXX" value="'+esc(customer.phone||'')+'"><input id="deliveryAddress" placeholder="Delivery address" value="'+esc(customer.address||'')+'"></div>':'';
 shell(activeTable?'Table '+activeTable+' Order':'New Order',activeTable?'Add items, choose service type, then pay.':'Walk-in order for takeaway or delivery.',
 '<div class="order-layout"><div class="panel"><div class="order-tools"><input class="search" id="menuSearch" placeholder="Search '+db.menu.length+' menu items"><div class="chips">'+catButtons+'</div></div><div class="menu-grid" id="menuGrid">'+menuCards(filtered)+'</div></div>'+
 '<div class="panel cart"><div class="section-head"><h3>Current Ticket</h3><div class="actions"><button class="action" data-action="save-unfinished">Save unfinished</button><button class="action" data-action="clear-cart">Clear order</button></div></div>'+
 '<div class="chips type-switch">'+
 '<button class="filter '+(orderType==='Dine-in'?'active':'')+'" data-action="type" data-type="Dine-in">🍽 Dine-in</button>'+
 '<button class="filter '+(orderType==='Takeaway'?'active':'')+'" data-action="type" data-type="Takeaway">🥡 Takeaway</button>'+
 '<button class="filter '+(orderType==='Delivery'?'active':'')+'" data-action="type" data-type="Delivery">🛵 Delivery</button></div>'+delivery+
 (rows||'<p class="muted">Your ticket is empty. Tap food items.</p>')+
 '<div class="totals"><div>Subtotal <b>'+money(subtotal())+'</b></div><div>Tax <b>'+money(subtotal()*Number(db.settings.tax||0)/100)+'</b></div><div>Service <b>'+money(subtotal()*Number(db.settings.service||0)/100)+'</b></div><strong>Total <b>'+money(grand())+'</b></strong></div>'+
 '<div class="pay-grid">'+['M-Pesa','Cash','Card','Split'].map(function(p){return '<button class="pay-btn '+(payment===p?'selected':'')+'" data-action="payment" data-payment="'+p+'">'+p+'</button>';}).join('')+'</div>'+
 '<button class="action primary big" data-action="checkout">'+(payment==='M-Pesa'?'📱 Request M-Pesa payment · ':'Complete & Pay ')+money(grand())+'</button></div></div>');
 var search=document.getElementById('menuSearch');
 if(search)search.addEventListener('input',function(){
   var q=search.value.toLowerCase();
   var box=document.getElementById('menuGrid');
   if(box)box.innerHTML=menuCards(filtered.filter(function(x){return x[0].toLowerCase().indexOf(q)!==-1;}));
 });
}
function addItem(i){
 var x=db.menu[i];if(!x)return;
 var stock=db.foodStock.find(function(s){return s.name===x[0];});
 if(!stock){
   stock={name:x[0],qty:0,reorder:10,unit:'pieces'};
   db.foodStock.push(stock);
   save();
 }
 var found=cart.find(function(c){return c.name===x[0];});
 var requested=(found?found.qty:0)+1;
 if(requested>Number(stock.qty||0)){
   var pendingCart=copy(cart);
   var pendingLine=pendingCart.find(function(q){return q.name===x[0];});
   if(pendingLine)pendingLine.qty=requested;else pendingCart.push({name:x[0],price:Number(x[2]),qty:1});
   openOrderStockProblem(x[0],Number(stock.qty||0),pendingCart);return;
}
 if(found)found.qty++;else cart.push({name:x[0],price:Number(x[2]),qty:1});
 syncTable();orderView();toast(x[0]+' added');if(stock)lowStockReminder(x[0],Number(stock.qty||0)-requested);
}
function changeQty(i,d){
 if(!cart[i])return;
 if(d>0){var stock=db.foodStock.find(function(s){return s.name===cart[i].name;});if(stock&&cart[i].qty+d>Number(stock.qty||0)){
   var pendingCart=copy(cart);
   pendingCart[i].qty=Number(pendingCart[i].qty||0)+d;
   openOrderStockProblem(cart[i].name,Number(stock.qty||0),pendingCart);return;
 }}
 cart[i].qty+=d;if(cart[i].qty<=0){cart.splice(i,1);} 
 syncTable();orderView();
 if(d>0){var remaining=stock?Number(stock.qty||0)-Number(cart[i]&&cart[i].qty||0):null;if(stock&&remaining>=0&&remaining<=10)lowStockReminder(cart[i].name,remaining);}
}
function syncTable(){
 if(!ederStoneCan('pos.write')){toast('Table changes are restricted');return;}
 if(activeTable){
   var t=db.tables[activeTable-1];
   t.order=copy(cart);t.status=cart.length?'Busy':'Open';t.paid=false;t.ready=false;save();
 }
}
function clearCart(){cart=[];syncTable();orderView();}
function setCategory(c){category=c;orderView();}
function setType(t){if(orderType==='Delivery')currentDeliveryCustomer();orderType=t;orderView();}
function setPay(p){if(orderType==='Delivery')currentDeliveryCustomer();payment=p;orderView();}

function checkout(){
 if(!cart.length){toast('Add food before payment');return;}
 openOrderConfirmation();
}
function openOrderConfirmation(){
 var rows=cart.map(function(x){
   return '<div class="order-line"><span>'+esc(x.name)+' ×'+x.qty+'</span><b>'+money(x.price*x.qty)+'</b></div>';
 }).join('');
 setModal('<div class="section-head"><div><div class="eyebrow">ORDER CONFIRMATION</div><h2>Confirm selected food</h2></div><button class="action" data-action="close-modal">×</button></div>'+
 '<p class="muted">Please confirm that the selected food and quantities are correct before proceeding to payment.</p>'+
 '<div class="receipt">'+rows+'<hr><div class="order-line"><strong>Total</strong><strong>'+money(grand())+'</strong></div></div>'+
 '<div class="actions"><button class="action" data-action="close-modal">Review order</button><button class="action primary big" data-action="proceed-payment">Proceed to payment</button></div>');
}
function proceedPayment(){
 closeModal();
 if(payment==='M-Pesa'){openMpesa();return;}
 if(payment==='Split'){openSplit();return;}
 openCashCardPayment(payment);
}
function openCashCardPayment(method){
 setModal('<div class="section-head"><div><div class="eyebrow">'+esc(method.toUpperCase())+' PAYMENT</div><h2>Complete payment</h2></div><button class="action" data-action="close-modal">×</button></div>'+
 '<div class="mpesa-amount">'+money(grand())+'</div>'+
 '<p class="muted">Confirm that you have received the full payment before completing this order.</p>'+
 '<div class="actions"><button class="action" data-action="close-modal">Cancel</button><button class="action primary big" data-action="confirm-sale">✓ Payment received</button></div>');
}
function validateDelivery(){
 if(orderType!=='Delivery')return true;
 var name=(document.getElementById('customerName')||{}).value||'';
 var phone=((document.getElementById('customerPhone')||{}).value||'').replace(/\s+/g,'');
 var address=(document.getElementById('deliveryAddress')||{}).value||'';
 if(!name.trim()||!/^0[17]\d{8}$/.test(phone)||!address.trim()){toast('Enter delivery name, valid phone and address');return false;}
 return true;
}
function completeSale(method,extra){
 if(!ederStoneCan('pos.write')){toast('Your role cannot complete sales');return;}
 if(!cart.length){toast('No items to complete');return;}
 if(extra&&extra.orderId){
   var existingOrder=db.orders.find(function(x){return x.id===String(extra.orderId);});
   if(existingOrder){cart=[];activeTable=null;save();orderView();showReceipt(existingOrder);toast('Sale already recorded. Receipt restored.');return;}
 }
 if(orderType==='Delivery')currentDeliveryCustomer();
 if(!validateDelivery())return;
 for(var si=0;si<cart.length;si++){
   var fs=db.foodStock.find(function(s){return s.name===cart[si].name;});
   if(!fs){fs={name:cart[si].name,qty:0,reorder:10,unit:'pieces'};db.foodStock.push(fs);save();}
   if(cart[si].qty>Number(fs.qty||0)){openOrderStockProblem(cart[si].name,Number(fs.qty||0),copy(cart));return;}
 }
 var saleId=(extra&&extra.orderId)?String(extra.orderId):'ORD-'+Date.now().toString().slice(-6);
 var o={id:saleId,table:activeTable,type:orderType,payment:method,total:grand(),subtotal:subtotal(),items:copy(cart),status:'Paid',time:new Date().toLocaleString(),customer:null,mpesa:extra||{}};
 if(orderType==='Delivery')o.customer={name:document.getElementById('customerName').value.trim(),phone:document.getElementById('customerPhone').value.trim(),address:document.getElementById('deliveryAddress').value.trim()};
 var committed=window.EderStonePOSData&&window.EderStonePOSData.recordSale
   ?window.EderStonePOSData.recordSale(o,cart,activeTable)
   :null;
 if(!committed||!committed.ok){
   var missing=committed&&committed.missing?committed.missing:[];
   openOrderStockProblem(missing.length?missing[0].name:'selected item',missing.length?missing[0].available:0,copy(cart));
   return;
 }
 db=window.EderStonePOSData.getDB()||db;
 if(orderType==='Delivery')addUnfinishedTask('delivery','Deliver order '+o.id,'Delivery order for '+(o.customer?o.customer.name:'customer')+'.',{orderId:o.id});
 cart=[];activeTable=null;save();orderView();showReceipt(o);
 if(o.type==='Delivery')setTimeout(function(){openDeliveryAssignment(o.id,null);},500);
}
function openSplit(){
 setModal('<div class="section-head"><div><div class="eyebrow">SPLIT PAYMENT</div><h2>Complete split ticket</h2></div><button class="action" data-action="close-modal">Close</button></div>'+
 '<div class="mpesa-amount">'+money(grand())+'</div><p class="muted">Enter the amount paid by M-Pesa and cash/card. The amounts must equal the ticket total.</p>'+
 '<div class="form-grid"><div class="field"><label>M-PESA</label><input id="splitMpesa" type="number" min="0" value="0"></div><div class="field"><label>CASH / CARD</label><input id="splitOther" type="number" min="0" value="'+Math.round(grand())+'"></div></div>'+
 '<button class="action primary big" data-action="split-complete">Complete split payment</button><div id="splitStatus" class="payment-status"></div>');
}
function completeSplit(){
 var a=Math.max(0,Number(document.getElementById('splitMpesa').value)||0),b=Math.max(0,Number(document.getElementById('splitOther').value)||0),total=Math.round(grand());
 if(Math.round(a+b)!==total){toast('Split amounts must equal '+money(total));return;}
 completeSale('Split',{mpesa:Math.round(a),other:Math.round(b)});
 closeModal();
}

function openMpesa(){
 setModal('<div class="mpesa-modal"><div class="section-head"><div><div class="eyebrow">LIPA NA M-PESA</div><h2>Send payment prompt</h2></div><button class="action" data-action="close-modal">Close</button></div>'+
 '<div class="mpesa-amount">'+money(grand())+'</div><p class="muted">Enter the customer phone number. They will receive an M-Pesa STK Push prompt.</p>'+
 '<div class="field"><label>PHONE NUMBER</label><input id="mpesaPhone" inputmode="tel" placeholder="07XXXXXXXX" maxlength="13"></div>'+
 '<button class="action primary big" id="mpesaSend" data-action="mpesa-send">📲 Send prompt</button><div id="mpesaStatus" class="payment-status"></div></div>');
 setTimeout(function(){var p=document.getElementById('mpesaPhone');if(p)p.focus();},50);
}
async function requestMpesa(){
 var input=document.getElementById('mpesaPhone');if(!input)return;
 var posOrderId='ORD-'+Date.now().toString().slice(-6);
 var phone=(input.value||'').replace(/\s+/g,'');
 if(/^0[17]\d{8}$/.test(phone))phone='254'+phone.slice(1);
 if(!/^254[17]\d{8}$/.test(phone)){toast('Enter a valid Kenyan M-Pesa number');return;}
 var status=document.getElementById('mpesaStatus'),btn=document.getElementById('mpesaSend');
 btn.disabled=true;btn.textContent='Sending prompt…';status.textContent='Connecting to Safaricom…';
 try{
  var r=await fetch('/api/mpesa/stkpush',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:phone,amount:Math.max(1,Math.round(grand())),accountReference:posOrderId.slice(0,12),transactionDesc:'Restaurant food payment',posOrderId:posOrderId})});
  var data=await r.json();
  if(!r.ok||data.error)throw new Error(data.error||'M-Pesa request failed');
  status.innerHTML='<span class="success">✓ Prompt sent. Waiting for confirmation…</span>';
  pollMpesa(data.checkoutRequestID,phone,posOrderId);
 }catch(e){status.innerHTML='<span class="danger">✕ '+esc(e.message||'Could not send prompt')+'</span><small>Configure Daraja environment variables on Vercel for live M-Pesa.</small>';btn.disabled=false;btn.textContent='📲 Retry prompt';}
}
async function pollMpesa(id,phone,posOrderId){
 var status=document.getElementById('mpesaStatus'),started=Date.now();
 while(Date.now()-started<120000){
  await new Promise(function(r){setTimeout(r,3000);});
  try{
   var r=await fetch('/api/mpesa/query',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({checkoutRequestID:id})});
   var d=await r.json();
   if(d.status==='success'){
    status.textContent='Payment confirmed. Finalizing the sale securely…';
    try{
     var settle=await fetch('/api/mpesa/settle',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({checkoutRequestID:id,posOrderId:posOrderId,amount:Math.max(1,Math.round(grand()))})});
     var settled=await settle.json();
     if(!settle.ok||settled.error)throw new Error(settled.error||'Payment settlement failed');
     status.innerHTML='<span class="success">✓ Payment confirmed and linked to sale '+esc(posOrderId)+'.</span>';
     setTimeout(function(){completeSale('M-Pesa',{phone:phone,checkoutRequestID:id,orderId:posOrderId,mpesaReceipt:settled.mpesaReceipt||null});},350);
    }catch(e){status.innerHTML='<span class="danger">Payment received, but sale finalization is waiting for reconciliation.</span><small>'+esc(e.message||'Settlement failed')+'</small>';return;}
    return;
   }
   if(d.status==='failed'){status.innerHTML='<span class="danger">✕ Payment cancelled or failed.</span>';var b=document.getElementById('mpesaSend');if(b){b.disabled=false;b.textContent='📲 Retry prompt';}return;}
   status.textContent='Waiting for the customer to complete the M-Pesa prompt…';
  }catch(e){status.innerHTML='<span class="danger">Payment status check failed. Do not assume payment was received.</span>';return;}
 }
 status.innerHTML='<span class="danger">Payment timed out. No sale was recorded.</span>';
 var btn=document.getElementById('mpesaSend');if(btn){btn.disabled=false;btn.textContent='📲 Retry prompt';}
}

function receiptQrData(o,compact){
 var items=(o.items||[]).map(function(x){
   return compact
     ? [String(x.name||''),Number(x.qty)||0]
     : [String(x.name||''),Number(x.qty)||0,Number(x.price)||0];
 });
 var data={
   brand:'EDERSTONE',
   receipt:String(o.id||''),
   date:String(o.time||''),
   type:String(o.type||'')+(o.table?' / Table '+o.table:''),
   items:items,
   total:Number(o.total)||0,
   payment:String(o.payment||'')
 };
 if(!compact){
   data.subtotal=Number(o.subtotal)||0;
   if(o.customer)data.customer={name:String(o.customer.name||''),phone:String(o.customer.phone||''),address:String(o.customer.address||'')};
   if(o.mpesa&&o.mpesa.phone)data.mpesa=String(o.mpesa.phone);
 }
 return JSON.stringify(data);
}
function receiptQrMarkup(o){
 try{
   if(typeof qrcode!=='function')throw new Error('QR library is not loaded');
   var payload=receiptQrData(o,false);
   var qr=qrcode(0,'L');
   try{
     qr.addData(payload,'Byte');
     qr.make();
   }catch(e){
     qr=qrcode(0,'L');
     qr.addData(receiptQrData(o,true),'Byte');
     qr.make();
   }
   var svg=qr.createSvgTag({cellSize:3,margin:4,scalable:true,alt:{text:'EDERSTONE receipt '+String(o.id||'')+' QR code'}});
   if(!svg||svg.indexOf('<svg')===-1)throw new Error('QR SVG was not created');
   return '<div class="receipt-qr">'+svg+'<small>Scan to view the receipt details.</small></div>';
 }catch(e){
   return '<div class="receipt-qr receipt-qr-error"><strong>QR generation failed</strong><small>The receipt is still valid and printable. '+esc(String(e&&e.message||'QR error'))+'</small></div>';
 }
}
function showReceipt(o){
 setModal('<div class="section-head"><h3>Receipt '+esc(o.id)+'</h3><button class="action" data-action="close-modal">Close</button></div>'+
 '<div class="receipt">'+
 '<div class="receipt-brand"><span class="receipt-logo"><img src="assets/icons/web-app-manifest-512x512.png" alt="EderStone logo"></span><div><strong>EDERSTONE</strong><small>RESTAURANT POS</small></div></div>'+
 '<div class="receipt-watermark" aria-hidden="true">ES</div>'+
 '<div class="receipt-head"><h2>'+esc(db.settings.name)+'</h2><p>'+esc(o.time)+'<br>'+esc(o.type)+(o.table?' · Table '+o.table:'')+'</p></div>'+
 receiptQrMarkup(o)+'<hr>'+
 o.items.map(function(x){return '<div class="order-line"><span>'+esc(x.name)+' ×'+x.qty+'</span><b>'+money(x.price*x.qty)+'</b></div>';}).join('')+
 '<hr><div class="order-line"><b>SUBTOTAL</b><b>'+money(o.subtotal)+'</b></div><div class="order-line"><b>TOTAL</b><b>'+money(o.total)+'</b></div><p>Payment: '+esc(o.payment)+'</p>'+
 (o.mpesa&&o.mpesa.phone?'<p>M-Pesa: '+esc(o.mpesa.phone)+'</p>':'')+
 '<div class="receipt-thanks">Thank you. Come again.</div><div class="receipt-copyright">© 2026 EderStone Restaurant POS. All rights reserved.</div></div>'+
 '<div class="actions"><button class="action primary big" data-action="print">Print receipt</button><button class="action big" data-action="close-modal">Close</button></div>');
}
function clearTable(id){
 if(!ederStoneCan('pos.write')){toast('Table changes are restricted');return;}
 var t=db.tables[id-1];if(!t||t.status!=='Busy')return;
 t.status='Open';t.order=[];t.paid=false;t.ready=false;delete t.lastPayment;save();tables();toast('Table '+id+' cleared and available');
}
function orders(){
 var cards=db.orders.slice().reverse().map(function(o){
   var itemText=(o.items||[]).map(function(x){return x.name+' ×'+x.qty;}).join(' ');
   var customer=o.customer?(' '+o.customer.name+' '+o.customer.phone+' '+o.customer.address):'';
   return '<div class="order-card" data-order-search="'+esc((o.id+' '+o.time+' '+o.type+' '+o.payment+' '+itemText+customer).toLowerCase())+'"><div class="order-line"><b>'+esc(o.id)+'</b><strong>'+money(o.total)+'</strong></div><div class="muted">'+esc(o.time)+' · '+esc(o.type)+' · '+esc(o.payment)+(o.table?' · Table '+o.table:'')+'</div><button class="action" data-action="receipt" data-id="'+esc(o.id)+'">View receipt</button></div>';
 }).join('');
 shell('Orders','Every completed transaction is recorded locally. Search by order ID, food, customer, type or payment.','<div class="panel"><input class="search" id="ordersSearch" placeholder="Search orders..."></div><div class="list" id="ordersList">'+(cards||'<p class="muted">No completed orders.</p>')+'</div>');
 var search=document.getElementById('ordersSearch');
 if(search)search.addEventListener('input',function(){
   var q=search.value.toLowerCase().trim();
   document.querySelectorAll('#ordersList .order-card').forEach(function(card){card.style.display=!q||String(card.getAttribute('data-order-search')||'').indexOf(q)!==-1?'':'none';});
 });
}
function showReceiptById(id){var o=db.orders.find(function(x){return x.id===id;});if(o)showReceipt(o);}
function unfinishedTasks(){
 var tasks=db.unfinishedTasks.filter(function(t){return t.status==='open';});
 var body=tasks.map(function(t){
   var icon=t.type==='chef'?'♨':t.type==='delivery'?'🛵':t.type==='order'?'🧾':'▤';
   var primary=t.type==='delivery'
     ?'<button class="action primary" data-action="clear-delivery-task" data-id="'+esc(t.id)+'">Clear</button>'
     :'<button class="action primary" data-action="review-task" data-id="'+esc(t.id)+'">Review</button>';
   return '<div class="panel unfinished-card" data-task-search="'+esc((t.id+' '+t.title+' '+t.details+' '+t.created).toLowerCase())+'"><div class="section-head"><h3>'+icon+' '+esc(t.title)+'</h3><span class="badge warn">UNFINISHED</span></div><p class="muted">'+esc(t.details)+'<br>Created: '+esc(t.created)+'</p><div class="actions">'+primary+(t.type==='delivery'?'':'<button class="action" data-action="resolve-task" data-id="'+esc(t.id)+'">Dismiss</button>')+'</div></div>';
 }).join('')||'<div class="panel"><p class="muted">No unfinished tasks. Everything is up to date.</p></div>';
 shell('Unfinished Tasks','Tasks that could not be completed immediately and require operator review. Search the queue by order, food, staff or task ID.','<div class="panel"><input class="search" id="unfinishedSearch" placeholder="Search unfinished tasks..."></div>'+collapsible('Pending task queue',body,'unfinishedList',true));
 var search=document.getElementById('unfinishedSearch');
 if(search)search.addEventListener('input',function(){var q=search.value.toLowerCase().trim();document.querySelectorAll('#unfinishedList .unfinished-card').forEach(function(card){card.style.display=!q||String(card.getAttribute('data-task-search')||'').indexOf(q)!==-1?'':'none';});});
}
function kitchen(){var jobs=db.kitchenJobs.filter(function(j){return j.status==='cooking'||j.status==='finished';});var jobCards=jobs.map(function(j){return '<div class="panel"><div class="section-head"><h3>'+esc(j.food)+' ×'+j.qty+'</h3><span class="badge '+(j.status==='finished'?'good':'warn')+'">'+(j.status==='finished'?'COOKED':'COOKING')+'</span></div><p class="muted">Kitchen Staff: '+esc(j.chef)+'<br>'+esc(j.started)+'</p>'+(j.status==='cooking'?'<button class="action primary" data-action="finish-job" data-id="'+j.id+'">✓ Kitchen Staff confirms finished</button>':'<button class="action primary" data-action="clear-job" data-id="'+j.id+'">Clear Kitchen Staff / release</button>')+'</div>';}).join('')||'<p class="muted">No Kitchen Staff tasks.</p>';var tickets=db.tables.filter(function(t){return t.status==='Busy'&&!t.paid;});var ticketCards=tickets.map(function(t){return '<div class="panel"><div class="section-head"><h3>Table '+t.id+'</h3><span class="badge '+(t.ready?'good':'warn')+'">'+(t.ready?'READY':'COOKING')+'</span></div>'+t.order.map(function(x){return '<div class="cart-row"><span>'+esc(x.name)+'</span><b>×'+x.qty+'</b></div>';}).join('')+(t.ready?'<button class="action" data-action="unready" data-id="'+t.id+'">Return to cooking</button>':'<button class="action primary" data-action="ready" data-id="'+t.id+'">Mark ready</button>')+'</div>';}).join('')||'<p class="muted">Kitchen clear.</p>';shell('Kitchen','Kitchen Staff assignments and dine-in food tickets.',collapsible('Kitchen Staff task board',jobCards,'chefJobs',true)+collapsible('Dine-in tickets',ticketCards,'dineTickets',false));}
function markReady(id){var t=db.tables[id-1];if(t&&t.status==='Busy'&&!t.paid){t.ready=true;save();kitchen();toast('Table '+id+' marked ready');}}
function unready(id){var t=db.tables[id-1];if(t){t.ready=false;save();kitchen();}}
function menu(){
 var rows='<div class="menu-grid" id="managementMenuGrid">'+db.menu.map(function(x,i){return '<div class="item menu-manage-card" data-menu-search="'+esc((x[0]+' '+x[1]).toLowerCase())+'"><div class="category">'+esc(x[1])+'</div><div class="item-line"><b>'+esc(x[0])+'</b><strong>'+money(x[2])+'</strong></div><button class="action" data-action="edit-menu" data-index="'+i+'">Edit</button></div>';}).join('')+'</div>';
 shell('Menu Manager','Your live catalogue contains '+db.menu.length+' food and drink items. Search before selecting an item.','<div class="panel"><input class="search" id="managementMenuSearch" placeholder="Search food or category..."></div>'+collapsible('Menu catalogue',rows,'menuList',true)+'<div class="actions"><button class="action primary" data-action="add-menu">＋ Add item</button></div>');
 var search=document.getElementById('managementMenuSearch');
 if(search)search.addEventListener('input',function(){var q=search.value.toLowerCase().trim();document.querySelectorAll('#managementMenuGrid .menu-manage-card').forEach(function(card){card.style.display=!q||String(card.getAttribute('data-menu-search')||'').indexOf(q)!==-1?'':'none';});});
}
function menuIngredientOptions(selected){
 return db.inventory.map(function(x){return '<option value="'+esc(x[0])+'"'+(x[0]===selected?' selected':'')+'>'+esc(x[0])+' · '+esc(x[1])+'</option>';}).join('');
}
function menuIngredientRow(index,ingredient,qty){
 var ing=ingredientByName(ingredient)||db.inventory[0]||['','pieces',0,0];
 return '<div class="panel menu-ingredient-row" data-row="'+index+'"><div class="form-grid"><div class="field"><label>INGREDIENT</label><select class="new-menu-ingredient">'+menuIngredientOptions(ingredient)+'</select></div><div class="field"><label>QTY PER 1 UNIT</label><input class="new-menu-qty" type="number" min="0.0001" step="0.001" value="'+(Number(qty)||'')+'" placeholder="e.g. 0.150"></div><div class="field"><label>UNIT</label><input class="new-menu-unit" value="'+esc(ing[1])+'" readonly></div></div><div class="actions"><button class="action" data-action="remove-menu-ingredient" data-row="'+index+'">Remove ingredient</button></div></div>';
}
function refreshMenuIngredientUnits(){
 document.querySelectorAll('#newMenuIngredients .menu-ingredient-row').forEach(function(row){
   var select=row.querySelector('.new-menu-ingredient'),unit=row.querySelector('.new-menu-unit');
   var ing=ingredientByName(select&&select.value);
   if(unit&&ing)unit.value=ing[1];
 });
}
function openAddMenuModal(){
 var cats=Array.from(new Set(db.menu.map(function(x){return x[1];})));
 var catOpts=cats.map(function(x){return '<option value="'+esc(x)+'">'+esc(x)+'</option>';}).join('');
 setModal('<div class="section-head"><div><div class="eyebrow">MENU MANAGEMENT</div><h2>Add food / drink</h2></div><button class="action" data-action="close-modal">×</button></div>'+
 '<p class="muted">Food name is free text, but category must be selected from the existing menu. Every ingredient must also come from Inventory and must have a quantity per one unit.</p>'+
 '<div class="form-grid"><div class="field"><label>FOOD NAME</label><input id="newMenuName" autocomplete="off" placeholder="e.g. Beef Special"></div><div class="field"><label>PRICE (KSh)</label><input id="newMenuPrice" type="number" min="0.01" step="1" placeholder="e.g. 650"></div><div class="field"><label>FOOD CATEGORY</label><select id="newMenuCategory">'+catOpts+'</select></div></div>'+
 '<div class="section-head"><h3>Ingredients per unit</h3><button class="action" data-action="add-menu-ingredient">＋ Add ingredient</button></div>'+
 '<div id="newMenuIngredients">'+menuIngredientRow(0,'', '')+'</div>'+
 '<div class="problem-actions"><button class="action primary big" data-action="save-menu-draft">Save food</button><button class="action" data-action="close-modal">Cancel</button></div>');
 setTimeout(function(){var n=document.getElementById('newMenuName');if(n)n.focus();},40);
}
function addMenuIngredientRow(){
 var box=document.getElementById('newMenuIngredients');if(!box)return;
 var count=box.querySelectorAll('.menu-ingredient-row').length;
 box.insertAdjacentHTML('beforeend',menuIngredientRow(count,'',''));
}
function removeMenuIngredientRow(row){
 var box=document.getElementById('newMenuIngredients');if(!box)return;
 var rows=box.querySelectorAll('.menu-ingredient-row');
 if(rows.length<=1){toast('A food must have at least one ingredient');return;}
 var target=box.querySelector('.menu-ingredient-row[data-row="'+row+'"]');if(target)target.remove();
}
function saveMenuDraft(){
 var name=((document.getElementById('newMenuName')||{}).value||'').trim();
 var price=Number((document.getElementById('newMenuPrice')||{}).value);
 var categorySelect=document.getElementById('newMenuCategory');
 var cat=categorySelect?categorySelect.value:'';
 if(!name){toast('Enter the food name');return;}
 if(!isFinite(price)||price<=0){toast('Enter a valid price');return;}
 if(!cat){toast('Select an existing food category');return;}
 if(db.menu.some(function(x){return String(x[0]).trim().toLowerCase()===name.toLowerCase();})){toast('That food already exists');return;}
 var recipe=[],seen={};
 document.querySelectorAll('#newMenuIngredients .menu-ingredient-row').forEach(function(row){
   var sel=row.querySelector('.new-menu-ingredient'),qtyEl=row.querySelector('.new-menu-qty');
   var ingredient=sel?sel.value:'',qty=Number(qtyEl&&qtyEl.value);
   if(!ingredient||!isFinite(qty)||qty<=0)return;
   if(seen[ingredient]){toast('Each ingredient can only be added once');recipe=[];return;}
   seen[ingredient]=true;
   var ing=ingredientByName(ingredient);
   if(ing)recipe.push([ingredient,ing[1],qty]);
 });
 if(!recipe.length){toast('Add at least one valid inventory ingredient with a quantity per unit');return;}
 if(recipe.length!==document.querySelectorAll('#newMenuIngredients .menu-ingredient-row').length){toast('Complete every ingredient row before saving');return;}
 setModal('<div class="problem-modal"><div class="problem-icon">✓</div><div class="eyebrow">CONFIRM FOOD</div><h2>'+esc(name)+'</h2><div class="panel"><div class="order-line"><span>Category</span><b>'+esc(cat)+'</b></div><div class="order-line"><span>Price</span><b>'+money(price)+'</b></div><div class="order-line"><span>Ingredients</span><b>'+recipe.length+' per unit</b></div>'+recipe.map(function(r){return '<div class="order-line"><span>'+esc(r[0])+'</span><b>'+r[2]+' '+esc(r[1])+'</b></div>';}).join('')+'</div><p class="problem-reason">Save this food and link its recipe to Inventory?</p><div class="problem-actions"><button class="action primary" data-action="confirm-add-menu" data-name="'+esc(name)+'" data-price="'+price+'" data-category="'+esc(cat)+'" data-recipe="'+esc(JSON.stringify(recipe))+'">Yes, save food</button><button class="action" data-action="edit-add-menu" data-name="'+esc(name)+'" data-price="'+price+'" data-category="'+esc(cat)+'" data-recipe="'+esc(JSON.stringify(recipe))+'">Edit</button></div></div>');
}
function commitMenu(name,price,cat,recipeJson){
 if(!ederStoneCan('menu.manage')){toast('Menu management is restricted');return;}
 var clean=String(name||'').trim(),p=Number(price),recipe=[];
 try{recipe=JSON.parse(recipeJson||'[]');}catch(e){recipe=[];}
 if(!clean||!isFinite(p)||p<=0||!recipe.length){toast('Food details are incomplete');return;}
 if(db.menu.some(function(x){return String(x[0]).trim().toLowerCase()===clean.toLowerCase();})){toast('That food already exists');return;}
 db.menu.push([clean,cat,p]);
 if(!db.recipes)db.recipes={};
 db.recipes[clean]=recipe;
 db.foodStock.push({name:clean,qty:0,reorder:10,unit:'pieces'});
 save();closeModal();menu();toast(clean+' added with '+recipe.length+' inventory ingredients per unit');
}
function editMenu(i){
 if(!db.menu[i])return;
 var p=Number(prompt('New price for '+db.menu[i][0],db.menu[i][2]));if(!isFinite(p)||p<0)return;
 db.menu[i][2]=p;save();menu();toast('Price updated');
}
function inventory(){
 var filtered=restockFilter.length?db.inventory.filter(function(x){return restockFilter.indexOf(x[0])!==-1;}):db.inventory;
 var ingredients='<div class="list">'+filtered.map(function(x){
   var low=Number(x[2])<=Number(x[3]);
   var idx=db.inventory.indexOf(x);
   return '<div class="item '+(low?'low-stock':'')+'"><div class="item-line"><b>'+esc(x[0])+'</b><strong>'+x[2]+' '+esc(x[1])+'</strong></div><div class="muted">'+(low?'⚠ Reorder now · ':'Reorder at ')+x[3]+' '+esc(x[1])+'</div><div class="actions"><button class="action" data-action="stock" data-index="'+idx+'" data-delta="-1">− 1</button><button class="action" data-action="stock" data-index="'+idx+'" data-delta="1">＋ 1</button><button class="action primary" data-action="receive-ingredient" data-index="'+idx+'">＋ Receive stock</button></div></div>';
 }).join('')||'<p class="muted">No ingredients currently require restocking.</p>';
 var foods='<div class="list">'+db.foodStock.map(function(s,i){return '<div class="item"><div class="item-line"><b>'+esc(s.name)+'</b><strong>'+s.qty+' pieces</strong></div><button class="action primary" data-action="cook-food" data-index="'+i+'">＋ Cook Food</button></div>';}).join('')+'</div>';
 var filterNotice=restockFilter.length?'<div class="panel"><div class="section-head"><h3>Required restock only</h3><button class="action" data-action="clear-restock-filter">Show all</button></div><p class="muted">Only ingredients required for the blocked cooking task are shown below.</p></div>':'';
 shell('Kitchen Inventory','Track raw ingredients and prepared food stock.',filterNotice+collapsible('Raw ingredients',ingredients,'ingredientsList',true)+collapsible('Prepared food stock',foods,'preparedFoodList',true));
}
function showRestockList(){view('inventory');}
function stock(i,d){
 if(!ederStoneCan('inventory.manage')){toast('Inventory management is restricted');return;}if(db.inventory[i]){db.inventory[i][2]=Math.max(0,Number(db.inventory[i][2])+Number(d));save();inventory();}}
function foodStock(i,d){if(db.foodStock[i]){db.foodStock[i].qty=Math.max(0,Number(db.foodStock[i].qty)+Number(d));save();inventory();}}
function staff(){
 var roles=['Kitchen Staff','Delivery Staff','Waiter'];
 var grouped={};
 roles.forEach(function(r){grouped[r]=[];});
 db.staff.forEach(function(x,i){
   var r=staffRole(x);
   if(roles.indexOf(r)!==-1)grouped[r].push({s:x,i:i});
 });
 var groups=roles.map(function(r){
   var cards=grouped[r].map(function(v){
     var busy=r==='Delivery Staff'?deliveryBusy(v.s[0]):r==='Kitchen Staff'?chefBusy(v.s[0]):false;
     var release=(busy&&r==='Delivery Staff')?'<button class="action" data-action="release-staff-delivery" data-staff="'+esc(v.s[0])+'">Release</button>':
                 (busy&&r==='Kitchen Staff')?'<button class="action" data-action="release-staff-kitchen" data-staff="'+esc(v.s[0])+'">Release</button>':'';
     return '<div class="staff-person"><div><b>'+esc(v.s[0])+'</b><small>'+esc(r)+'</small></div><div class="actions">'+
       '<span class="badge '+(busy?'warn':'good')+'">'+(busy?'BUSY':'AVAILABLE')+'</span>'+release+'</div></div>';
   }).join('');
   return '<div class="staff-category"><div class="staff-category-head"><h3>'+esc(r)+'</h3><span>'+grouped[r].length+'</span></div><div class="staff-category-list">'+(cards||'<small class="muted">No staff added yet.</small>')+'</div></div>';
 }).join('');
 shell('Staff','Only Kitchen Staff, Delivery Staff and Waiter roles can be added. Staff availability is calculated from active assignments.',
 '<div class="panel"><div class="section-head"><h3>Staff management</h3><span class="badge good">'+db.staff.length+' staff</span></div><div class="actions"><button class="action primary big" data-action="add-staff">＋ Add staff</button></div></div><div class="staff-category-grid">'+groups+'</div>');
}
function openAddStaffModal(name,role){
 var roles=['Kitchen Staff','Delivery Staff','Waiter'];
 var opts=roles.map(function(r){return '<option value="'+esc(r)+'"'+(r===role?' selected':'')+'>'+esc(r)+'</option>';}).join('');
 setModal('<div class="problem-modal"><div class="problem-icon">♙</div><div class="eyebrow">STAFF MANAGEMENT</div><h2>Add staff</h2><p class="problem-reason">Enter the staff member details, then save to review them before adding them to the system.</p><div class="form-grid" style="text-align:left"><div class="field"><label>STAFF NAME</label><input id="newStaffName" autocomplete="off" placeholder="e.g. Brian" value="'+esc(name||'')+'"></div><div class="field"><label>STAFF CATEGORY</label><select id="newStaffRole">'+opts+'</select></div></div><div class="problem-actions"><button class="action primary" data-action="save-staff-draft">Save</button><button class="action" data-action="close-modal">Cancel</button></div></div>');
 setTimeout(function(){var input=document.getElementById('newStaffName');if(input)input.focus();},40);
}
function confirmAddStaff(name,role){
 var clean=String(name||'').trim();
 var cleanRole=['Kitchen Staff','Delivery Staff','Waiter'].indexOf(role)!==-1?role:'Waiter';
 if(!clean){toast('Enter a staff name');openAddStaffModal(name,cleanRole);return;}
 var duplicate=db.staff.some(function(s){return String(s[0]||'').trim().toLowerCase()===clean.toLowerCase();});
 if(duplicate){toast('A staff member with that name already exists');openAddStaffModal(clean,cleanRole);return;}
 setModal('<div class="problem-modal"><div class="problem-icon">✓</div><div class="eyebrow">CONFIRM DETAILS</div><h2>Confirm staff details</h2><div class="panel"><div class="order-line"><span>Name</span><b>'+esc(clean)+'</b></div><div class="order-line"><span>Category</span><b>'+esc(cleanRole)+'</b></div></div><p class="problem-reason">Save this staff member to the system?</p><div class="problem-actions"><button class="action primary" data-action="confirm-add-staff" data-name="'+esc(clean)+'" data-role="'+esc(cleanRole)+'">Yes, save</button><button class="action" data-action="edit-add-staff" data-name="'+esc(clean)+'" data-role="'+esc(cleanRole)+'">No, edit</button></div></div>');
}
function addStaff(){
 openAddStaffModal('','Waiter');
}
function saveStaffDraft(){
 var name=((document.getElementById('newStaffName')||{}).value||'').trim();
 var role=(document.getElementById('newStaffRole')||{}).value||'Waiter';
 confirmAddStaff(name,role);
}
function commitStaff(name,role){
 if(!ederStoneCan('staff.read')){toast('Staff management is restricted');return;}
 var clean=String(name||'').trim();
 var cleanRole=['Kitchen Staff','Delivery Staff','Waiter'].indexOf(role)!==-1?role:'Waiter';
 if(!clean)return;
 if(db.staff.some(function(s){return String(s[0]||'').trim().toLowerCase()===clean.toLowerCase();})){
   toast('A staff member with that name already exists');
   openAddStaffModal(clean,cleanRole);
   return;
 }
 db.staff.push([clean,cleanRole,cleanRole,'added']);
 save();
 updateUnfinishedBadge();
 closeModal();
 staff();
 toast(clean+' added as '+cleanRole);
}
function editStaff(i){toast('Staff editing is restricted to Admin access');}
function saveStaff(i){toast('Staff editing is restricted to Admin access');}
 if(!ederStoneCan('staff.read')){toast('Staff management is restricted');return;}
function deleteStaff(i){toast('Staff removal is restricted to Admin access');}
 if(!ederStoneCan('staff.read')){toast('Staff management is restricted');return;}
async function syncConflictPanel(){
 var conflicts=window.EderStonePOSSync?.conflicts?.()||[];
 var host=document.getElementById('posSyncConflicts');
 if(!host){var shellHost=document.querySelector('.pos-shell,.page-shell,main');if(shellHost){host=document.createElement('div');host.id='posSyncConflicts';shellHost.prepend(host);}}
 if(!host)return;
 if(!conflicts.length){host.innerHTML='';return;}
 host.innerHTML='<div class="panel"><div class="section-head"><h3>Offline sync conflicts</h3><span class="badge warn">'+conflicts.length+' NEED ATTENTION</span></div><p class="muted">A newer server version exists and local POS changes were preserved. Choose whether to restore a preserved local snapshot or discard it.</p>'+conflicts.map(function(item,i){return '<div class="order-line"><span><b>Conflict '+(i+1)+'</b><small class="muted"> '+new Date(item.createdAt||Date.now()).toLocaleString()+' · server v'+Number(item.serverVersion||0)+'</small></span><span><button class="btn small" data-sync-restore="'+esc(item.id)+'">Restore</button> <button class="btn small danger" data-sync-discard="'+esc(item.id)+'">Discard</button></span></div>';}).join('')+'</div>';
 host.querySelectorAll('[data-sync-restore]').forEach(function(b){b.onclick=function(){window.EderStonePOSSync?.resolveConflict?.(b.dataset.syncRestore,'restore');syncConflictPanel();}});
 host.querySelectorAll('[data-sync-discard]').forEach(function(b){b.onclick=function(){window.EderStonePOSSync?.resolveConflict?.(b.dataset.syncDiscard,'discard');syncConflictPanel();}});
}
window.addEventListener('ederstone:sync-status',function(){syncConflictPanel();});

function reports(){
 var s=db.orders.reduce(function(a,o){return a+Number(o.total||0);},0);
 shell('Reports','Sales performance, payment reconciliation and audit activity.','<div class="grid"><div class="stat"><small>GROSS SALES</small><strong>'+money(s)+'</strong></div><div class="stat"><small>AVERAGE TICKET</small><strong>'+money(db.orders.length?s/db.orders.length:0)+'</strong></div><div class="stat"><small>M-PESA SALES</small><strong>'+money(db.orders.filter(function(o){return o.payment==='M-Pesa';}).reduce(function(a,o){return a+o.total;},0))+'</strong></div><div class="stat"><small>CASH</small><strong>'+money(db.orders.filter(function(o){return o.payment==='Cash';}).reduce(function(a,o){return a+o.total;},0))+'</strong></div></div><div id="paymentReconciliation" class="panel"><div class="section-head"><h3>Payment reconciliation</h3><span class="badge warn">Loading…</span></div><p class="muted">Checking server-confirmed M-Pesa payments and settlement records.</p></div>');
 var box=document.getElementById('paymentReconciliation');
 try{
   var r=await fetch('/api/reports?limit=50',{credentials:'include',cache:'no-store'});
   var d=await r.json();
   if(!r.ok||!d.ok)throw new Error(d.error||'Could not load payment report');
   var sm=d.paymentSummary||{};
   var unmatched=Array.isArray(d.unmatched)?d.unmatched:[];
   var payments=Array.isArray(d.payments)?d.payments:[];
   var recent=payments.slice(0,10).map(function(p){
     return '<div class="order-line"><span><b>'+esc(p.pos_order_id||'Unlinked payment')+'</b><small class="muted"> '+esc(p.checkout_request_id)+' · '+esc(p.status)+'</small></span><b>'+money(p.amount)+'</b></div>';
   }).join('');
   box.innerHTML='<div class="section-head"><h3>Payment reconciliation</h3><span class="badge '+(unmatched.length?'warn':'good')+'">'+(unmatched.length?unmatched.length+' UNMATCHED':'ALL RECENT PAYMENTS MATCHED')+'</span></div><div class="grid"><div class="stat"><small>TRANSACTIONS</small><strong>'+Number(sm.total||0)+'</strong></div><div class="stat"><small>SUCCESSFUL</small><strong>'+Number(sm.success||0)+'</strong></div><div class="stat"><small>PENDING</small><strong>'+Number(sm.pending||0)+'</strong></div><div class="stat"><small>FAILED</small><strong>'+Number(sm.failed||0)+'</strong></div></div>'+(unmatched.length?'<div class="panel"><b>Action required</b><p class="muted">'+unmatched.length+' successful M-Pesa payment(s) have no settlement record. Do not manually mark them paid without checking the transaction.</p></div>':'')+'<div class="panel"><h4>Recent M-Pesa activity</h4>'+(recent||'<p class="muted">No server-side M-Pesa transactions yet.</p>')+'</div>';
 }catch(e){
   box.innerHTML='<div class="section-head"><h3>Payment reconciliation</h3><span class="badge warn">SERVER UNAVAILABLE</span></div><p class="muted">Local sales remain available. Server payment reconciliation could not be loaded right now.</p>';
 }
}
function settings(){
 shell('Settings','Configure the register.','<div class="panel"><div class="form-grid"><div class="field"><label>RESTAURANT NAME</label><input id="rn" value="'+esc(db.settings.name)+'"></div><div class="field"><label>TAX %</label><input id="tx" type="number" min="0" value="'+Number(db.settings.tax||0)+'"></div><div class="field"><label>SERVICE %</label><input id="sv" type="number" min="0" value="'+Number(db.settings.service||0)+'"></div></div><div class="actions"><button class="action primary" data-action="save-settings">Save settings</button><button class="action" data-action="reset">Reset POS data</button></div></div>');
}
function saveSettings(){
 if(!ederStoneCan('pos.write')){toast('Settings changes are restricted');return;}
 db.settings.name=(document.getElementById('rn')||{}).value||'Ederstone Restaurant';
 db.settings.tax=Math.max(0,Number((document.getElementById('tx')||{}).value)||0);
 db.settings.service=Math.max(0,Number((document.getElementById('sv')||{}).value)||0);
 save();settings();toast('Settings saved');
}
function resetPOS(){
 if(!window.confirm('Reset all POS data?'))return;
 db=freshDB();cart=[];activeTable=null;orderType='Takeaway';payment='M-Pesa';category='All';viewStack=[];currentView='';save();view('dashboard');toast('POS data reset');
}
function goBack(){view(viewStack.pop()||'dashboard',true);}
var VIEWS={dashboard:dashboard,tables:tables,orders:orders,menu:menu,kitchen:kitchen,unfinished:unfinishedTasks,inventory:inventory,staff:staff,reports:reports,settings:settings,newOrder:orderView,orderEntry:orderView};
function updateUnfinishedBadge(){
 var b=document.getElementById('unfinishedCount');
 if(!b)return;
 var n=Array.isArray(db.unfinishedTasks)?db.unfinishedTasks.filter(function(t){return t.status==='open';}).length:0;
 b.textContent=n;
 b.hidden=n===0;
}
function view(v,fromBack){
 if(!VIEWS[v])v='dashboard';
 if(!fromBack&&(currentView==='orderEntry'||currentView==='newOrder')&&cart.length&&v!=='orderEntry'&&v!=='newOrder')savePendingOrder('Order screen left before payment',false);
 if(!fromBack&&currentView&&currentView!==v)viewStack.push(currentView);
 currentView=v;
 document.querySelectorAll('.nav').forEach(function(n){n.classList.toggle('active',n.getAttribute('data-view')===v);});
 updateUnfinishedBadge();
 VIEWS[v]();
}
function handleAction(el){
 var a=el.getAttribute('data-action');
 if(!a)return;
 if(a==='view')return view(el.getAttribute('data-view'));
 if(a==='dashboard')return view('dashboard');
 if(a==='back')return goBack();
 if(a==='toggle-sidebar')return toggleSidebar();
 if(a==='new-order'||a==='add-order')return newOrder();
 if(a==='open-table')return openTable(Number(el.getAttribute('data-id')));
 if(a==='clear-table')return clearTable(Number(el.getAttribute('data-id')));
 if(a==='add-item')return addItem(Number(el.getAttribute('data-index')));
 if(a==='qty')return changeQty(Number(el.getAttribute('data-index')),Number(el.getAttribute('data-delta')));
 if(a==='clear-cart')return clearCart();
 if(a==='category')return setCategory(el.getAttribute('data-category'));
 if(a==='type')return setType(el.getAttribute('data-type'));
 if(a==='payment')return setPay(el.getAttribute('data-payment'));
 if(a==='checkout')return checkout();
 if(a==='proceed-payment')return proceedPayment();
 if(a==='confirm-sale')return completeSale(payment);
 if(a==='close-modal')return closeModal();
 if(a==='go-kitchen'){closeModal();return view('kitchen');}
 if(a==='go-unfinished'){closeModal();return view('unfinished');}
 if(a==='review-task')return reviewUnfinishedTask(el.getAttribute('data-id')||'');
 if(a==='save-unfinished')return saveCurrentOrder();
 if(a==='add-menu-ingredient')return addMenuIngredientRow();
 if(a==='remove-menu-ingredient')return removeMenuIngredientRow(Number(el.getAttribute('data-row')));
 if(a==='save-menu-draft')return saveMenuDraft();
 if(a==='add-recipe-ingredient')return addRecipeBuilderRow();
 if(a==='remove-recipe-ingredient')return removeRecipeBuilderRow(Number(el.getAttribute('data-row')));
 if(a==='save-recipe-builder')return saveRecipeBuilder(el.getAttribute('data-food')||'',Number(el.getAttribute('data-qty'))||1,el.getAttribute('data-after')||'');
 if(a==='cook-food-from-order')return cookFoodByName(el.getAttribute('data-food')||'',Number(el.getAttribute('data-qty'))||1);
 if(a==='confirm-add-menu')return commitMenu(el.getAttribute('data-name')||'',el.getAttribute('data-price')||'',el.getAttribute('data-category')||'',el.getAttribute('data-recipe')||'');
 if(a==='edit-add-menu')return openAddMenuModal();
 if(a==='add-staff')return addStaff();
 if(a==='save-staff-draft')return saveStaffDraft();
 if(a==='confirm-add-staff')return commitStaff(el.getAttribute('data-name')||'',el.getAttribute('data-role')||'Waiter');
 if(a==='edit-add-staff')return openAddStaffModal(el.getAttribute('data-name')||'',el.getAttribute('data-role')||'Waiter');
 if(a==='edit-staff')return editStaff(Number(el.getAttribute('data-index')));
 if(a==='save-staff')return saveStaff(Number(el.getAttribute('data-index')));
 if(a==='delete-staff')return deleteStaff(Number(el.getAttribute('data-index')));
 if(a==='resolve-task'){closeUnfinishedTask(el.getAttribute('data-id')||'');return unfinishedTasks();}
 if(a==='clear-delivery-task'){closeUnfinishedTask(el.getAttribute('data-id')||'');return unfinishedTasks();}
 if(a==='toggle-collapse')return toggleCollapse(el.getAttribute('data-target'));
 if(a==='assign-chef')return assignChef(el.getAttribute('data-food')||'',Number(el.getAttribute('data-qty'))||0,el.getAttribute('data-chef')||'',el.getAttribute('data-task')||'');
 if(a==='assign-low-stock')return assignLowStock(el.getAttribute('data-food')||'');
 if(a==='finish-job')return finishKitchenJob(el.getAttribute('data-id')||'');
 if(a==='clear-job')return clearFinishedJob(el.getAttribute('data-id')||'');
 if(a==='go-inventory'){closeModal();restockFilter=[];return view('inventory');}
 if(a==='go-staff'){closeModal();return view('staff');}
 if(a==='assign-delivery')return assignDelivery(el.getAttribute('data-order')||'',el.getAttribute('data-driver')||'',el.getAttribute('data-task')||'');
 if(a==='release-delivery')return releaseDelivery(el.getAttribute('data-driver')||'');
 if(a==='release-staff-delivery')return releaseDeliveryStaff(el.getAttribute('data-staff')||'');
 if(a==='release-staff-kitchen')return releaseKitchenStaff(el.getAttribute('data-staff')||'');
 if(a==='go-restock'){closeModal();return showRestockList();}
 if(a==='mpesa-send')return requestMpesa();
 if(a==='split-complete')return completeSplit();
 if(a==='print')return window.print();
 if(a==='receipt')return showReceiptById(el.getAttribute('data-id'));
 if(a==='ready')return markReady(Number(el.getAttribute('data-id')));
 if(a==='unready')return unready(Number(el.getAttribute('data-id')));
 if(a==='add-menu')return openAddMenuModal();
 if(a==='edit-menu')return editMenu(Number(el.getAttribute('data-index')));
 if(a==='stock')return stock(Number(el.getAttribute('data-index')),Number(el.getAttribute('data-delta')));
 if(a==='food-stock')return foodStock(Number(el.getAttribute('data-index')),Number(el.getAttribute('data-delta')));
 if(a==='cook-food'){return cookFood(Number(el.getAttribute('data-index')));}
 if(a==='confirm-cook-quantity')return confirmCookQuantity(el.getAttribute('data-food')||'',el.getAttribute('data-after')||'');
 if(a==='receive-ingredient')return receiveIngredient(Number(el.getAttribute('data-index')));
 if(a==='clear-restock-filter'){restockFilter=[];return inventory();}
 if(a==='save-settings')return saveSettings();
 if(a==='reset')return resetPOS();
}
function setSidebarCollapsed(collapsed){
 document.body.classList.toggle('sidebar-collapsed',!!collapsed);
 var b=document.getElementById('sidebarToggle');
 if(b){b.setAttribute('aria-expanded',String(!collapsed));b.setAttribute('aria-label',collapsed?'Expand sidebar':'Collapse sidebar');b.title=collapsed?'Expand sidebar':'Collapse sidebar';b.innerHTML=collapsed?'›':'‹';b.innerHTML+='<span>'+(collapsed?'Expand':'Collapse')+'</span>';}
 try{localStorage.setItem(KEY+'-sidebar-collapsed',collapsed?'1':'0');}catch(e){}
}
function toggleSidebar(){setSidebarCollapsed(!document.body.classList.contains('sidebar-collapsed'));}
function bind(){
 app=document.getElementById('app');
 modal=document.getElementById('modal');
 if(!app){console.error('EderStone POS: #app was not found');return;}
 var sidebarCollapsed=false;try{sidebarCollapsed=localStorage.getItem(KEY+'-sidebar-collapsed')==='1';}catch(e){} setSidebarCollapsed(sidebarCollapsed);
 document.querySelectorAll('.nav').forEach(function(n){n.addEventListener('click',function(){view(n.getAttribute('data-view'));});});
 var logout=document.getElementById('logoutPos');if(logout)logout.addEventListener('click',function(){location.href='/projects';});
 var full=document.getElementById('fullscreenPos');if(full)full.addEventListener('click',async function(){try{if(!document.fullscreenElement&&document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else if(document.exitFullscreen)await document.exitFullscreen();}catch(e){toast('Full screen is unavailable on this device');}});
 app.addEventListener('click',function(e){var el=e.target.closest('[data-action]');if(el)handleAction(el);});
 if(modal){
   modal.addEventListener('click',function(e){
     var el=e.target.closest('[data-action]');
     if(el)handleAction(el);
     else if(e.target===modal)closeModal();
   });
 }
 var clock=document.getElementById('clock');
 setInterval(function(){if(clock)clock.textContent=new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});},1000);
 window.addEventListener('beforeunload',function(){if(cart.length)savePendingOrder('POS page closed with an unfinished order',false);});
 setTimeout(function(){
   document.body.classList.remove('pos-loading');
   var opening=document.getElementById('posOpening');
   if(opening){opening.classList.add('is-done');setTimeout(function(){opening.remove();},450);}
 },5000);
 view('dashboard');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();

// Phase 4 role-aware UI helpers
function currentEderStoneRole(){
  return window.EderStoneAuth?.user?.role || null;
}
function ederStoneCan(permission){ const role=currentEderStoneRole(); return role==='owner' || !!(window.EderStonePermissions?.can?.(role,permission)); }
function applyEderStoneRoleUI(){
  const role=currentEderStoneRole(); if(!role) return;
  document.documentElement.dataset.ederstoneRole=role;
  document.querySelectorAll('[data-permission]').forEach(el=>{
    const allowed=ederStoneCan(el.dataset.permission);
    el.hidden=!allowed; el.setAttribute('aria-hidden',String(!allowed));
  });
}
window.EderStonePOSPermissions=Object.freeze({role:currentEderStoneRole,can:ederStoneCan,refresh:applyEderStoneRoleUI});
document.addEventListener('DOMContentLoaded',()=>setTimeout(applyEderStoneRoleUI,0));