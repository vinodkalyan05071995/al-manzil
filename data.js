/* ============================================================
   MENU DATA — Al Manzil Hotel Bahrain
   ------------------------------------------------------------
   Two stores, two menus: In-Room Dining (ird) and Elixir Lounge
   (elixir). Each store is seeded from MENUS[<store id>] on first
   boot; the admin dashboard edits each one separately after that.
   `tags` are allergen codes from ALLERGENS (printed in the menu
   legend). Prices are BHD and already include service, levy, VAT.
   ------------------------------------------------------------
   Dual-context: works as a browser <script> AND as a Node module
   (require("./data")), so the server resolves prices from the
   same source.
   ============================================================ */

(function (root) {
  "use strict";

  const BRAND = {
    name: "Al Manzil Hotel",
    wordmark: "Al Manzil Hotel Bahrain",
    tagline: "In-room dining & Elixir Lounge.",
  };

  // order + wording follow the legend printed on the in-room dining menu
  const ALLERGENS = [
    { id: "v", label: "Vegetarian", ar: "نباتي" },
    { id: "g", label: "Gluten", ar: "جلوتين" },
    { id: "d", label: "Dairy", ar: "ألبان" },
    { id: "e", label: "Eggs", ar: "بيض" },
    { id: "s", label: "Shellfish", ar: "قشريات" },
    { id: "n", label: "Nuts", ar: "مكسرات" },
    { id: "h", label: "Spicy", ar: "حار" },
  ];

  /* ================= IN-ROOM DINING ================= */
  const IRD_CATEGORIES = [
    { id: "allday24", label: "24-Hour Menu", note: "Available around the clock" },
    { id: "breakfast", label: "Breakfast", note: "7:00 AM – 10:30 AM" },
    { id: "bsides", label: "Breakfast Sides", note: "7:00 AM – 10:30 AM" },
    { id: "soups", label: "Soups", note: "12:00 PM – 2:00 AM" },
    { id: "salads", label: "Salads", note: "12:00 PM – 2:00 AM" },
    { id: "appetizers", label: "Appetizers", note: "12:00 PM – 2:00 AM" },
    { id: "burgers", label: "Sandwiches & Burgers", note: "12:00 PM – 2:00 AM" },
    { id: "pizza", label: "Pizza", note: "12:00 PM – 2:00 AM" },
    { id: "pasta", label: "Pasta", note: "Served with freshly baked garlic bread" },
    { id: "mains", label: "Main Courses", note: "12:00 PM – 2:00 AM" },
    { id: "tandoor", label: "Indian & Asian", note: "From the clay tandoor" },
    { id: "curries", label: "Indian Curries", note: "12:00 PM – 2:00 AM" },
    { id: "bread", label: "Bread Corner", note: "12:00 PM – 2:00 AM" },
    { id: "biryani", label: "Biryani", note: "12:00 PM – 2:00 AM" },
    { id: "rice", label: "Rice & Noodles", note: "12:00 PM – 2:00 AM" },
    { id: "kids", label: "Kid's Corner", note: "12:00 PM – 2:00 AM" },
    { id: "desserts", label: "Desserts", note: "12:00 PM – 2:00 AM" },
  ];

  const IRD_MENU = [
    // ---- 24-HOUR MENU ----
    { id: "h24-hot-sour-veg", cat: "allday24", tone: "caramel", tags: ["g", "h"],
      name: "Hot & Sour Vegetarian Soup", price: 2.100,
      desc: "A Chinese favourite, available in vegetarian and chicken options." },
    { id: "h24-cream-soup", cat: "allday24", tone: "cream", tags: ["d", "g"],
      name: "Cream Soup", price: 1.900,
      desc: "Velvety cream soup, available in vegetarian and chicken options." },
    { id: "h24-caesar", cat: "allday24", tone: "green", tags: ["d", "g", "e"],
      name: "Classic Caesar Salad", price: 3.000,
      desc: "Crisp romaine topped with grilled chicken breast, parmesan, crunchy croutons and classic Caesar dressing." },
    { id: "h24-greek", cat: "allday24", tone: "green", tags: ["d"],
      name: "Greek Salad", price: 1.900,
      desc: "Tomatoes, cucumber, red onion, green pepper, feta and olives tossed with oregano olive-oil dressing." },
    { id: "h24-club", cat: "allday24", tone: "wheat", tags: ["d", "g", "e"],
      name: "Club Sandwich", price: 4.200,
      desc: "Grilled chicken breast, bacon, fried egg, lettuce, tomato and creamy mayo in toasted bread, with golden fries." },
    { id: "h24-cheeseburger", cat: "allday24", tone: "mocha", tags: ["d", "g"],
      name: "Al Manzil Signature Cheeseburger", price: 4.200, badge: "Signature",
      desc: "Homemade grilled beef patty, melted cheddar, lettuce, tomato, pickles and house sauce in a soft bun, with fries." },
    { id: "h24-pasta", cat: "allday24", tone: "caramel", tags: ["d", "g"],
      name: "Pasta", price: 3.200,
      desc: "Penne, spaghetti or fettuccine in your choice of Arrabbiata, Alfredo or Mamma Rosa sauce." },
    { id: "h24-biryani-veg", cat: "allday24", tone: "wheat", tags: ["d", "g", "n", "h"],
      name: "Biryani — Vegetable", price: 2.600,
      desc: "Indian rice flavoured with saffron and Indian spices." },
    { id: "h24-biryani-chicken", cat: "allday24", tone: "wheat", tags: ["d", "g", "n", "h"],
      name: "Biryani — Chicken", price: 3.500,
      desc: "Indian rice flavoured with saffron and Indian spices." },
    { id: "h24-biryani-mutton", cat: "allday24", tone: "wheat", tags: ["d", "g", "n", "h"],
      name: "Biryani — Mutton", price: 4.000,
      desc: "Indian rice flavoured with saffron and Indian spices." },
    { id: "h24-fruit", cat: "allday24", tone: "berry", tags: [],
      name: "Fresh Fruits Platter", price: 3.500,
      desc: "A selection of freshly cut seasonal fruits." },
    { id: "h24-choc-cake", cat: "allday24", tone: "espresso", tags: ["d", "g"],
      name: "Chocolate Cake", price: 3.000,
      desc: "Layered chocolate cake with velvety chocolate cream and glossy ganache." },

    // ---- BREAKFAST ----
    { id: "bf-american", cat: "breakfast", tone: "wheat", tags: ["d", "g", "e"],
      name: "American Breakfast", price: 4.500,
      desc: "Two eggs your way, beef bacon, chicken sausage, hash browns, pancakes with maple syrup, toast and butter. With orange juice and tea or coffee." },
    { id: "bf-continental", cat: "breakfast", tone: "cream", tags: ["d", "g"],
      name: "Continental Breakfast", price: 4.500,
      desc: "Bakery basket (croissant, Danish, toast) with jam, butter and honey, fresh fruit, orange juice and tea or coffee." },
    { id: "bf-arabic", cat: "breakfast", tone: "caramel", tags: ["d", "g", "e"], badge: "Signature",
      name: "Arabic Breakfast", price: 4.500,
      desc: "Foul medames, eggs with tomato or eggs any style, hummus, labneh, feta, fresh salad, olives and Arabic bread. With orange juice and tea or coffee." },
    { id: "bf-chole-bhatura", cat: "breakfast", tone: "wheat", tags: ["d", "g"],
      name: "Chole Bhatura", price: 2.500,
      desc: "Golden-fried bhatura with slow-cooked spiced chickpea curry, pickles and fresh onions." },
    { id: "bf-poori-bhaji", cat: "breakfast", tone: "wheat", tags: ["d", "g"],
      name: "Poori Bhaji", price: 2.500,
      desc: "Light, fluffy pooris with Indian-style potato bhaji and fresh coriander." },
    { id: "bf-pancakes", cat: "breakfast", tone: "cream", tags: ["g", "e"],
      name: "Pancakes", price: 2.400, desc: "Four fluffy pancakes." },
    { id: "bf-french-toast", cat: "breakfast", tone: "caramel", tags: ["g", "e"],
      name: "French Toast", price: 2.400, desc: "Cinnamon French toast." },

    // ---- BREAKFAST SIDES ----
    { id: "bs-eggs", cat: "bsides", tone: "cream", tags: ["g", "e"],
      name: "Eggs Any Style", price: 2.200,
      desc: "Omelette, scrambled, boiled or sunny side up, with grilled tomato, mushrooms and Arabic bread or toast." },
    { id: "bs-foul", cat: "bsides", tone: "coffee", tags: [],
      name: "Foul Medame", price: 1.900,
      desc: "Slow-cooked fava beans with olive oil, garlic, lemon and spices, with vegetables and warm Arabic bread." },
    { id: "bs-falafel", cat: "bsides", tone: "green", tags: ["g"],
      name: "Falafel (5 pcs)", price: 1.900,
      desc: "Golden crispy chickpea falafel with tahini sauce and bread." },
    { id: "bs-cheese-platter", cat: "bsides", tone: "cream", tags: ["d", "g"],
      name: "International Cheese Platter", price: 3.500,
      desc: "Assorted international cheeses with crackers, nuts and fresh grapes." },
    { id: "bs-cereals", cat: "bsides", tone: "wheat", tags: ["d"],
      name: "Cereals", price: 2.200,
      desc: "Cornflakes, Coco Pops, Rice Krispies or Frosted Flakes with hot or cold milk and fresh fruit." },

    // ---- SOUPS ----
    { id: "sp-lentil", cat: "soups", tone: "caramel", tags: ["g"],
      name: "Lentil Soup", price: 1.500,
      desc: "Slow-cooked lentils, fresh vegetables and herbs, served warm with a squeeze of lemon." },
    { id: "sp-mushroom", cat: "soups", tone: "cream", tags: ["d", "g"],
      name: "Cream of Mushroom Soup", price: 1.900,
      desc: "Rich and creamy, with fresh mushrooms and herbs, served with toasted bread." },
    { id: "sp-chicken-corn", cat: "soups", tone: "wheat", tags: ["g", "e"],
      name: "Chicken Corn Soup", price: 1.900,
      desc: "Chicken broth with tender chicken, sweet corn and silky egg ribbons, finished with spring onion." },
    { id: "sp-hot-sour-chicken", cat: "soups", tone: "caramel", tags: ["g", "h"],
      name: "Hot & Sour Chicken Soup", price: 2.100,
      desc: "Asian-style soup with chicken, vegetables and mushrooms in a hot and sour broth." },
    { id: "sp-tom-yum", cat: "soups", tone: "berry", tags: ["s", "h"],
      name: "Tom Yum Seafood Soup", price: 3.200,
      desc: "Thai-style mixed seafood with lemongrass, lime leaves and galangal in a spicy, sour broth." },

    // ---- SALADS ----
    { id: "sl-garden", cat: "salads", tone: "green", tags: [],
      name: "Garden Salad", price: 2.200,
      desc: "Mixed lettuce, cucumber, tomato and capsicum with house dressing." },
    { id: "sl-fattoush", cat: "salads", tone: "green", tags: ["g"],
      name: "Fattoush", price: 2.500,
      desc: "Crisp vegetables and toasted pita in lemon, olive oil and sumac dressing." },
    { id: "sl-chicken-caesar", cat: "salads", tone: "green", tags: ["d", "g", "e"],
      name: "Chicken Caesar Salad", price: 3.000,
      desc: "Romaine, grilled chicken breast, parmesan, croutons and classic Caesar dressing." },
    { id: "sl-cold-mezze", cat: "salads", tone: "cream", tags: ["d"], badge: "To share",
      name: "Cold Mezze", price: 4.500,
      desc: "Hummus, baba ghanoush, labneh, tabbouleh, olives and pickles with fresh Arabic bread." },

    // ---- APPETIZERS ----
    { id: "ap-spring-samosa", cat: "appetizers", tone: "wheat", tags: ["d", "g"],
      name: "Spring Rolls / Samosa", price: 1.900,
      desc: "6 crispy pastries with sweet chili sauce. Chicken, cheese or vegetable." },
    { id: "ap-kibbeh", cat: "appetizers", tone: "mocha", tags: ["g"],
      name: "Meat Kibbeh", price: 2.500,
      desc: "6 crispy bulgur croquettes filled with spiced meat, with tahina sauce." },
    { id: "ap-hot-mezze", cat: "appetizers", tone: "caramel", tags: ["d", "g"], badge: "To share",
      name: "Hot Mezze Platter", price: 6.000,
      desc: "Assorted hot mezze selection (16 pcs) for sharing." },
    { id: "ap-mozzarella", cat: "appetizers", tone: "cream", tags: ["d"],
      name: "Mozzarella Sticks", price: 2.300,
      desc: "Crispy fried mozzarella with marinara sauce." },
    { id: "ap-chicken-65", cat: "appetizers", tone: "berry", tags: ["g", "h"],
      name: "Chicken 65", price: 2.800,
      desc: "Spicy fried chicken with curry leaves and chili." },
    { id: "ap-buffalo-wings", cat: "appetizers", tone: "berry", tags: ["d", "g", "e", "h"],
      name: "Buffalo Chicken Wings", price: 2.800,
      desc: "Crispy wings tossed in buffalo sauce with blue cheese dip." },
    { id: "ap-lollipop", cat: "appetizers", tone: "caramel", tags: ["g", "e", "h"],
      name: "Chicken Lollipop", price: 2.200,
      desc: "Wings marinated in Chinese seasoning, battered and fried, with sweet chili dip." },
    { id: "ap-dynamite-shrimp", cat: "appetizers", tone: "caramel", tags: ["g", "e", "s"],
      name: "Dynamite Shrimp", price: 3.900,
      desc: "Crispy battered shrimp coated in dynamite mayo sauce." },
    { id: "ap-fries", cat: "appetizers", tone: "wheat", tags: [],
      name: "French Fries", price: 1.500,
      desc: "Golden crispy fries with house cocktail sauce." },

    // ---- SANDWICHES & BURGERS ----
    { id: "bg-club", cat: "burgers", tone: "wheat", tags: ["d", "g", "e"],
      name: "Club Sandwich", price: 4.200,
      desc: "Grilled chicken breast, bacon, fried egg, lettuce, tomato and creamy mayo in toasted bread, with golden fries." },
    { id: "bg-cheeseburger", cat: "burgers", tone: "mocha", tags: ["d", "g"], badge: "Signature",
      name: "Al Manzil Signature Cheeseburger", price: 4.200,
      desc: "Homemade grilled beef patty, melted cheddar, lettuce, tomato, pickles and house sauce in a soft bun, with fries." },
    { id: "bg-chicken-deluxe", cat: "burgers", tone: "caramel", tags: ["d", "g"],
      name: "Grilled Chicken Deluxe Burger", price: 3.500,
      desc: "Grilled chicken patty, melted cheddar, lettuce, tomato and homemade burger sauce in a soft bun." },

    // ---- PIZZA ----
    { id: "pz-margherita", cat: "pizza", tone: "berry", tags: ["d", "g"],
      name: "Classic Margherita", price: 3.900,
      desc: "Pomodoro sauce, fresh mozzarella, parmesan and fresh basil." },
    { id: "pz-garden", cat: "pizza", tone: "green", tags: ["d", "g", "h"],
      name: "Garden Harvest Pizza", price: 3.200,
      desc: "Crispy crust with fresh seasonal vegetables, melted cheeses and herbs." },
    { id: "pz-pepperoni", cat: "pizza", tone: "berry", tags: ["d", "g"],
      name: "Al Manzil Pepperoni", price: 4.300,
      desc: "Marinara sauce, mozzarella and pepperoni slices." },
    { id: "pz-bbq", cat: "pizza", tone: "mocha", tags: ["d", "g"],
      name: "BBQ Smoker Pizza", price: 4.000,
      desc: "BBQ beef, mozzarella, caramelized onion and barbecue sauce." },
    { id: "pz-cheese", cat: "pizza", tone: "cream", tags: ["d", "g"],
      name: "Buffalo Chicken Cheetos", price: 4.000,
      desc: "Mozzarella, cheddar, gorgonzola and feta with extra virgin olive oil." },

    // ---- PASTA ----
    { id: "pa-arrabbiata", cat: "pasta", tone: "berry", tags: ["d", "g", "h"],
      name: "Penne Arrabbiata", price: 2.500,
      desc: "Penne in spicy tomato sauce with garlic, chili flakes and parsley, finished with parmesan." },
    { id: "pa-bolognese", cat: "pasta", tone: "mocha", tags: ["d", "g"],
      name: "Spaghetti Bolognese", price: 3.500,
      desc: "Slow-cooked ground beef in rich tomato sauce with grated parmesan and parsley." },
    { id: "pa-alfredo", cat: "pasta", tone: "cream", tags: ["d", "g"],
      name: "Fettuccine Alfredo", price: 3.500,
      desc: "Creamy parmesan sauce with chicken, mushrooms and fresh parsley." },

    // ---- MAIN COURSES ----
    { id: "mn-ribeye", cat: "mains", tone: "espresso", tags: ["d"], badge: "Premium",
      name: "Angus Ribeye Steak", price: 17.000,
      desc: "Char-grilled ribeye with mashed potatoes and seasonal vegetables. Sauce: BBQ, green peppercorn or mushroom." },
    { id: "mn-filet", cat: "mains", tone: "espresso", tags: ["d"], badge: "Premium",
      name: "Angus Filet Mignon", price: 16.900,
      desc: "Angus tenderloin grilled to your liking, with roasted potatoes and seasonal vegetables. Sauce: BBQ, green peppercorn or mushroom." },
    { id: "mn-salmon", cat: "mains", tone: "caramel", tags: ["d"],
      name: "Roasted Salmon", price: 7.900,
      desc: "Oven-roasted salmon with lemon butter sauce, creamy mash and sautéed vegetables." },
    { id: "mn-prawns", cat: "mains", tone: "berry", tags: ["d", "s"],
      name: "Jumbo Prawns", price: 7.000,
      desc: "Char-grilled jumbo prawns with garlic butter and herbs, potato wedges and lemon butter sauce." },
    { id: "mn-lamb-chops", cat: "mains", tone: "mocha", tags: [],
      name: "Lamb Chops", price: 5.900,
      desc: "Herb- and spice-marinated lamb chops, flame-grilled, with potato wedges and sautéed vegetables." },
    { id: "mn-herb-chicken", cat: "mains", tone: "green", tags: [],
      name: "Herb Chicken Breast", price: 3.900,
      desc: "Pan-grilled marinated chicken breast with vegetables and roasted garlic & herb sauce." },
    { id: "mn-machboos", cat: "mains", tone: "wheat", tags: ["g"], badge: "Local favourite",
      name: "Chicken Machboos", price: 3.500,
      desc: "Gulf classic: slow-cooked chicken over spiced basmati rice with herbs and dried lime." },
    { id: "mn-mix-grill", cat: "mains", tone: "mocha", tags: [],
      name: "Al Manzil Mix Grill", price: 7.900,
      desc: "Shish tawook, chicken kebab, beef kebab, beef tikka and lamb chops with jarjeer, fries, Arabic bread and garlic sauce." },

    // ---- INDIAN & ASIAN (TANDOOR) ----
    { id: "td-tandoori-full", cat: "tandoor", tone: "berry", tags: ["d", "h"],
      name: "Tandoori Chicken — Full", price: 5.300,
      desc: "Marinated in hung curd, herbs and Indian spices, slow-roasted in the clay tandoor. With salad and mint chutney." },
    { id: "td-tandoori-half", cat: "tandoor", tone: "berry", tags: ["d", "h"],
      name: "Tandoori Chicken — Half", price: 2.900,
      desc: "Marinated in hung curd, herbs and Indian spices, slow-roasted in the clay tandoor. With salad and mint chutney." },
    { id: "td-chicken-tikka", cat: "tandoor", tone: "caramel", tags: ["d", "h"],
      name: "Chicken Tikka", price: 3.500,
      desc: "Boneless chicken in yogurt and Indian spices, roasted in the tandoor. With salad and mint chutney." },
    { id: "td-malai-kebab", cat: "tandoor", tone: "cream", tags: ["d"],
      name: "Murgh Malai Kebab", price: 3.500,
      desc: "Boneless chicken in fresh cream, mild spices and herbs, roasted in the tandoor. With salad and mint chutney." },
    { id: "td-jalpari", cat: "tandoor", tone: "caramel", tags: ["d", "h"],
      name: "Samundari Jalpari", price: 3.800,
      desc: "Fish fillet marinated with Indian spices and herbs, roasted in the tandoor. With salad and mint chutney." },
    { id: "td-prawns", cat: "tandoor", tone: "berry", tags: ["d", "s", "h"],
      name: "Tandoori Prawns", price: 5.900,
      desc: "King prawns in yogurt, herbs and Indian spices, roasted in the tandoor. With salad and mint chutney." },
    { id: "td-paneer-tikka", cat: "tandoor", tone: "wheat", tags: ["d"],
      name: "Rangeela Paneer Tikka", price: 3.900,
      desc: "Cottage cheese cubes in three styles — achari, haryali and red masala — cooked in the tandoor." },

    // ---- INDIAN CURRIES ----
    { id: "cu-butter-chicken", cat: "curries", tone: "caramel", tags: ["d", "n"], badge: "Signature",
      name: "Butter Chicken", price: 3.500,
      desc: "Tandoor-roasted chicken in a rich, creamy tomato makhani gravy." },
    { id: "cu-tikka-masala", cat: "curries", tone: "berry", tags: ["d", "h"],
      name: "Chicken Tikka Masala", price: 2.800,
      desc: "Grilled chicken tikka in tomato masala gravy, finished with fresh cream." },
    { id: "cu-rogan-josh", cat: "curries", tone: "mocha", tags: ["d", "h"],
      name: "Mutton Rogan Josh", price: 4.000,
      desc: "Slow-cooked mutton in a rich Kashmiri-style gravy with aromatic herbs." },
    { id: "cu-kadai", cat: "curries", tone: "caramel", tags: ["d", "h"],
      name: "Kadai Murgh", price: 3.500,
      desc: "Chicken with onions, bell peppers and freshly roasted spices in kadai gravy." },
    { id: "cu-goan-fish", cat: "curries", tone: "wheat", tags: ["h"],
      name: "Goan Fish Curry", price: 3.500,
      desc: "Fresh fish in coconut milk with red chili paste and Goan spices." },
    { id: "cu-szechuan", cat: "curries", tone: "berry", tags: ["g", "e", "h"],
      name: "Szechuan Chili Chicken", price: 3.500,
      desc: "Crispy chicken with bell peppers and onions in bold, spicy Szechuan sauce." },
    { id: "cu-dal", cat: "curries", tone: "wheat", tags: ["h"],
      name: "Dal Fry / Dal Tadka", price: 1.900,
      desc: "Yellow lentils tempered with cumin, roasted garlic and spices in ghee." },
    { id: "cu-paneer-butter", cat: "curries", tone: "caramel", tags: ["d", "h"],
      name: "Paneer Butter Masala", price: 2.900,
      desc: "Soft paneer cubes in a rich buttery tomato gravy." },

    // ---- BREAD CORNER ----
    { id: "br-roti", cat: "bread", tone: "wheat", tags: ["g"],
      name: "Tandoori Roti", price: 1.000, desc: "Whole wheat bread baked in the clay tandoor." },
    { id: "br-butter-naan", cat: "bread", tone: "cream", tags: ["d", "g"],
      name: "Butter Naan", price: 1.200, desc: "Soft naan brushed with melted butter." },
    { id: "br-lacha", cat: "bread", tone: "wheat", tags: ["g"],
      name: "Lacha Paratha", price: 1.000, desc: "Layered, flaky flatbread from the hot griddle." },
    { id: "br-aloo", cat: "bread", tone: "wheat", tags: ["g"],
      name: "Aloo Paratha", price: 1.500, desc: "Whole wheat flatbread stuffed with spiced potato." },
    { id: "br-keema-chicken", cat: "bread", tone: "caramel", tags: ["g"],
      name: "Keema Paratha — Chicken", price: 1.400, desc: "Layered paratha stuffed with spiced minced chicken." },
    { id: "br-keema-beef", cat: "bread", tone: "mocha", tags: ["g"],
      name: "Keema Paratha — Beef", price: 1.800, desc: "Layered paratha stuffed with spiced minced beef." },

    // ---- BIRYANI ----
    { id: "bi-chicken", cat: "biryani", tone: "wheat", tags: ["d", "g", "n", "h"],
      name: "Chicken Biryani", price: 3.500,
      desc: "Basmati rice with chicken and Indian spices in a sealed clay pot, with raita, pickle and papad." },
    { id: "bi-lamb", cat: "biryani", tone: "mocha", tags: ["d", "g", "n", "h"],
      name: "Lamb Biryani", price: 4.000,
      desc: "Long-grain basmati with tender lamb and Indian spices, with raita and papad." },
    { id: "bi-prawn", cat: "biryani", tone: "berry", tags: ["d", "g", "n", "h", "s"],
      name: "Prawn Biryani", price: 5.500,
      desc: "Basmati with king prawns and aromatic spices, with raita and papad." },
    { id: "bi-veg", cat: "biryani", tone: "green", tags: ["d", "g", "n", "h"],
      name: "Layered Vegetable Biryani", price: 2.800,
      desc: "Basmati layered with seasonal vegetables and Indian spices, with raita and papad." },

    // ---- RICE & NOODLES ----
    { id: "rc-steamed", cat: "rice", tone: "cream", tags: ["g"],
      name: "Steamed Rice", price: 1.000, desc: "Plain steamed basmati rice." },
    { id: "rc-jeera", cat: "rice", tone: "wheat", tags: ["g"],
      name: "Jeera Rice", price: 1.200, desc: "Basmati tossed with butter and roasted cumin." },
    { id: "rc-biryani-rice", cat: "rice", tone: "caramel", tags: ["g"],
      name: "Biryani Rice", price: 1.100, desc: "Basmati lightly flavoured with biryani spices." },
    { id: "rc-fried-chicken", cat: "rice", tone: "wheat", tags: ["g", "e"],
      name: "Egg Fried Rice — Chicken", price: 2.200, desc: "Wok-fried rice with chicken, egg, vegetables and soy sauce." },
    { id: "rc-fried-beef", cat: "rice", tone: "mocha", tags: ["g", "e"],
      name: "Egg Fried Rice — Beef", price: 2.500, desc: "Wok-fried rice with beef, egg, vegetables and soy sauce." },
    { id: "rc-noodles-chicken", cat: "rice", tone: "caramel", tags: ["g", "e"],
      name: "Egg Noodles — Chicken", price: 2.200, desc: "Stir-fried noodles with chicken, egg, vegetables and soy sauce." },
    { id: "rc-noodles-beef", cat: "rice", tone: "mocha", tags: ["g", "e"],
      name: "Egg Noodles — Beef", price: 2.500, desc: "Stir-fried noodles with beef, egg, vegetables and soy sauce." },

    // ---- KID'S CORNER ----
    { id: "kd-nuggets", cat: "kids", tone: "wheat", tags: [],
      name: "Chicken Nuggets", price: 2.000, desc: "Crispy nuggets with French fries and ketchup." },
    { id: "kd-mac", cat: "kids", tone: "cream", tags: ["d", "g"],
      name: "Mac & Cheese", price: 2.200, desc: "Macaroni in a rich, creamy cheese sauce." },
    { id: "kd-fries", cat: "kids", tone: "wheat", tags: [],
      name: "French Fries", price: 1.800, desc: "Golden crispy fries with ketchup." },
    { id: "kd-mash", cat: "kids", tone: "cream", tags: ["d"],
      name: "Mashed Potato", price: 2.200, desc: "Creamy mashed potatoes." },

    // ---- DESSERTS ----
    { id: "ds-fruit", cat: "desserts", tone: "berry", tags: [],
      name: "Fresh Fruits Platter", price: 3.500, desc: "A selection of freshly cut seasonal fruits." },
    { id: "ds-gulab", cat: "desserts", tone: "caramel", tags: ["d", "g", "n"],
      name: "Gulab Jamun", price: 1.500, desc: "Fried milk dumplings soaked in fragrant sugar syrup." },
    { id: "ds-um-ali", cat: "desserts", tone: "wheat", tags: ["d", "g", "n"],
      name: "Um Ali", price: 2.000, desc: "Baked puff pastry with milk, cream and mixed nuts." },
    { id: "ds-choc-cake", cat: "desserts", tone: "espresso", tags: ["d", "g"],
      name: "Chocolate Cake", price: 3.000, desc: "Layered chocolate cake with velvety chocolate cream and glossy ganache." },
    { id: "ds-ice-cream", cat: "desserts", tone: "cream", tags: ["d"],
      name: "Ice Cream (3 scoops)", price: 2.500,
      desc: "Vanilla, chocolate, strawberry or mango, with chocolate, strawberry or caramel syrup." },
  ];

  /* ================= ELIXIR LOUNGE (beverages) ================= */
  const ELIXIR_CATEGORIES = [
    { id: "signature", label: "Signature Cocktails", note: "Elixir originals" },
    { id: "classic", label: "Classic Cocktails", note: "The timeless pours" },
    { id: "beer", label: "Beer", note: "Bottles & draught" },
    { id: "liqueurs", label: "Liqueurs & Aperitifs", note: "30 ml" },
    { id: "whisky", label: "Whisky", note: "30 ml or by the bottle" },
    { id: "vodka", label: "Vodka", note: "30 ml or by the bottle" },
    { id: "rum", label: "Rum", note: "30 ml or by the bottle" },
    { id: "tequila", label: "Tequila", note: "30 ml or by the bottle" },
    { id: "gin", label: "Gin", note: "30 ml or by the bottle" },
    { id: "cognac", label: "Cognac", note: "30 ml or by the bottle" },
    { id: "wine", label: "Wine & Champagne", note: "Glass or bottle" },
    { id: "shooters", label: "Shooters", note: "شوتات" },
    { id: "soft", label: "Soft Drinks & Water", note: "Water, cans & energy" },
  ];

  // spirits come by the 30 ml pour and (mostly) by the bottle: one item each
  const SPIRITS = [
    // [cat, idBase, name, kind, shot, bottle, tone]
    ["whisky", "chivas-12", "Chivas 12 YO", "Blended Scotch", 5.000, 110.000, "caramel"],
    ["whisky", "chivas-18", "Chivas 18 YO", "Blended Scotch", 8.000, 180.000, "caramel"],
    ["whisky", "jw-red", "Johnnie Walker Red Label", "Blended Scotch", 4.000, 90.000, "caramel"],
    ["whisky", "jw-black", "Johnnie Walker Black Label", "Blended Scotch", 5.000, 110.000, "caramel"],
    ["whisky", "jw-blue", "Johnnie Walker Blue Label", "Blended Scotch", 18.000, null, "caramel"],
    ["whisky", "jameson", "Jameson", "Irish whiskey", 3.500, 75.000, "wheat"],
    ["whisky", "bushmills", "Bushmills", "Irish whiskey", 4.000, 90.000, "wheat"],
    ["whisky", "jack-daniels", "Jack Daniel's", "American whiskey", 4.000, 90.000, "mocha"],
    ["whisky", "glenlivet", "Glenlivet", "Single malt", 5.500, null, "caramel"],
    ["whisky", "glenfiddich-12", "Glenfiddich 12", "Single malt", 7.000, null, "caramel"],
    ["whisky", "glenmorangie-12", "Glenmorangie 12", "Single malt", 7.000, null, "caramel"],
    ["whisky", "monkey-shoulder", "Monkey Shoulder", "Blended malt", 6.000, null, "caramel"],
    ["whisky", "jim-beam", "Jim Beam", "Bourbon", 3.500, 80.000, "mocha"],
    ["whisky", "makers-mark", "Maker's Mark", "Bourbon", 4.000, 100.000, "mocha"],
    ["vodka", "grey-goose", "Grey Goose", "Vodka", 5.500, 135.000, "cold"],
    ["vodka", "absolut-blue", "Absolut Blue", "Vodka", 3.500, 75.000, "cold"],
    ["vodka", "smirnoff-red", "Smirnoff Red", "Vodka", 3.500, 75.000, "cold"],
    ["vodka", "roberto-cavalli", "Roberto Cavalli", "Vodka", 5.500, 135.000, "cold"],
    ["rum", "bacardi-white", "Bacardi White", "Rum", 3.500, 75.000, "coffee"],
    ["rum", "captain-morgan", "Captain Morgan Spiced", "Rum", 3.500, 75.000, "coffee"],
    ["rum", "havana-club", "Havana Club", "Rum", 3.500, 75.000, "coffee"],
    ["tequila", "cuervo-silver", "Jose Cuervo Silver", "Tequila", 3.500, 75.000, "wheat"],
    ["tequila", "cuervo-gold", "Jose Cuervo Gold", "Tequila", 3.500, 75.000, "wheat"],
    ["tequila", "patron-silver", "Patrón Silver", "Tequila", 5.500, 135.000, "wheat"],
    ["tequila", "don-julio-gold", "Don Julio Gold", "Tequila", 6.500, 165.000, "wheat"],
    ["gin", "hendricks", "Hendrick's", "Gin", 3.500, 85.000, "green"],
    ["gin", "bombay-sapphire", "Bombay Sapphire", "Gin", 3.500, 90.000, "green"],
    ["gin", "gordons", "Gordon's", "Gin", 3.500, 80.000, "green"],
    ["gin", "roku", "Roku", "Gin", 4.500, 110.000, "green"],
    ["gin", "tanqueray", "Tanqueray", "Gin", 4.000, 95.000, "green"],
    ["cognac", "hennessy-vs", "Hennessy VS", "Cognac", 4.500, 95.000, "mocha"],
    ["cognac", "hennessy-vsop", "Hennessy VSOP", "Cognac", 5.500, 120.000, "mocha"],
    ["cognac", "hennessy-xo", "Hennessy XO", "Cognac", 25.000, null, "mocha"],
    ["cognac", "remy-vsop", "Rémy Martin VSOP", "Cognac", 6.500, 165.000, "mocha"],
  ];
  const spiritItems = [];
  SPIRITS.forEach(([cat, id, name, kind, shot, bottle, tone]) => {
    spiritItems.push({ id: "sp-" + id, cat, tone, name, price: shot, desc: kind + " · 30 ml" });
    if (bottle != null) spiritItems.push({ id: "sp-" + id + "-btl", cat, tone, name: name + " — Bottle", price: bottle, desc: kind + " · full bottle" });
  });

  const ELIXIR_MENU = [
    // ---- SIGNATURE COCKTAILS ----
    { id: "sig-old-fashioned", cat: "signature", tone: "caramel", badge: "Signature",
      name: "Deconstructed Old Fashioned", price: 5.000, desc: "أولد فاشن مفكك" },
    { id: "sig-elixir-cloud", cat: "signature", tone: "cream", badge: "Signature",
      name: "Elixir Cloud", price: 5.000, desc: "سحابة اليكسير" },
    { id: "sig-twisted-martini", cat: "signature", tone: "green", badge: "Signature",
      name: "Twisted Martini", price: 5.000, desc: "مارتيني معدل" },
    { id: "sig-red-dragon", cat: "signature", tone: "berry", badge: "Signature",
      name: "Red Dragon", price: 5.000, desc: "التنين الاحمر" },
    { id: "sig-ginger-hibiscus", cat: "signature", tone: "berry", badge: "Signature",
      name: "Ginger Hibiscus Sparkler", price: 5.000, desc: "فوار الزنجبيل والكركديه" },

    // ---- CLASSIC COCKTAILS ----
    { id: "cl-martini", cat: "classic", tone: "green", name: "Martini", price: 5.000,
      desc: "Gin, Martini Bianco · مارتيني" },
    { id: "cl-margarita", cat: "classic", tone: "wheat", name: "Margarita", price: 5.500,
      desc: "Tequila, triple sec, simple syrup, lemon juice · مارغريتا" },
    { id: "cl-daiquiri", cat: "classic", tone: "cream", name: "Daiquiri", price: 4.500,
      desc: "Rum, triple sec, sweet & sour mix · دايكيوري" },
    { id: "cl-whiskey-sour", cat: "classic", tone: "caramel", name: "Whiskey Sour", price: 5.000,
      desc: "Whiskey, sweet & sour mix, egg white optional · ويسكي سور" },
    { id: "cl-cosmopolitan", cat: "classic", tone: "berry", name: "Cosmopolitan", price: 5.500,
      desc: "Vodka, triple sec, cranberry juice · كوزموبوليتان" },
    { id: "cl-mojito", cat: "classic", tone: "green", name: "Mojito", price: 4.000,
      desc: "Rum, mint leaves, lime wedge, soda · موهيتو" },
    { id: "cl-sex-on-the-beach", cat: "classic", tone: "caramel", name: "Sex on the Beach", price: 5.000,
      desc: "Vodka, peach schnapps, orange juice, cranberry juice" },
    { id: "cl-bull-frog", cat: "classic", tone: "cold", name: "Bull Frog", price: 7.000,
      desc: "4 spirits, blue curaçao, lime juice, Red Bull · بول فروج" },
    { id: "cl-long-island", cat: "classic", tone: "mocha", name: "Long Island Iced Tea", price: 6.000,
      desc: "5 spirits, lime juice, cola · شاي لونغ ايلاند مثلج" },

    // ---- BEER ----
    { id: "bb-heineken", cat: "beer", tone: "wheat", name: "Heineken", price: 3.500, desc: "Bottle · هاينكن" },
    { id: "bb-budweiser", cat: "beer", tone: "wheat", name: "Budweiser", price: 3.500, desc: "Bottle · بدوايزر" },
    { id: "bb-amstel", cat: "beer", tone: "wheat", name: "Amstel Light", price: 3.500, desc: "Bottle · أمستل لايت" },
    { id: "bb-corona", cat: "beer", tone: "wheat", name: "Corona Extra", price: 3.500, desc: "Bottle · كورونا إكسترا" },
    { id: "bb-dab", cat: "beer", tone: "wheat", name: "DAB", price: 3.500, desc: "Bottle · داب" },
    { id: "bb-smirnoff-ice", cat: "beer", tone: "cold", name: "Smirnoff Ice", price: 4.500, desc: "Bottle · سميرنوف أيس" },
    { id: "bb-savanna", cat: "beer", tone: "cream", name: "Savanna Cider", price: 3.500, desc: "Bottle · سافانا سيدر" },
    { id: "bb-soju", cat: "beer", tone: "cold", name: "Soju", price: 5.000, desc: "Bottle · سوجو" },
    { id: "dr-heineken", cat: "beer", tone: "wheat", name: "Heineken — Draught", price: 4.500, desc: "On tap · هاينكن" },
    { id: "dr-budweiser", cat: "beer", tone: "wheat", name: "Budweiser — Draught", price: 4.000, desc: "On tap · بدوايزر" },
    { id: "dr-amstel", cat: "beer", tone: "wheat", name: "Amstel Light — Draught", price: 4.500, desc: "On tap · أمستل لايت" },
    { id: "dr-guinness", cat: "beer", tone: "espresso", name: "Guinness — Draught", price: 5.000, desc: "On tap · غينيس" },

    // ---- LIQUEURS & APERITIFS (30 ml) ----
    { id: "lq-baileys", cat: "liqueurs", tone: "cream", name: "Baileys Irish Cream", price: 4.000, desc: "Liqueur · 30 ml" },
    { id: "lq-cointreau", cat: "liqueurs", tone: "wheat", name: "Cointreau", price: 4.000, desc: "Liqueur · 30 ml" },
    { id: "lq-sambuca", cat: "liqueurs", tone: "cold", name: "Sambuca", price: 3.500, desc: "Liqueur · 30 ml" },
    { id: "lq-amaretto", cat: "liqueurs", tone: "caramel", name: "Amaretto", price: 3.500, desc: "Liqueur · 30 ml" },
    { id: "lq-jagermeister", cat: "liqueurs", tone: "espresso", name: "Jägermeister", price: 4.000, desc: "Liqueur · 30 ml" },
    { id: "lq-kahlua", cat: "liqueurs", tone: "mocha", name: "Kahlúa", price: 3.500, desc: "Liqueur · 30 ml" },
    { id: "lq-malibu", cat: "liqueurs", tone: "cream", name: "Malibu", price: 3.500, desc: "Liqueur · 30 ml" },
    { id: "lq-apple-sour", cat: "liqueurs", tone: "green", name: "Apple Sour", price: 4.000, desc: "Liqueur · 30 ml" },
    { id: "lq-grand-marnier", cat: "liqueurs", tone: "caramel", name: "Grand Marnier", price: 4.000, desc: "Liqueur · 30 ml" },
    { id: "ap-martini-dry", cat: "liqueurs", tone: "green", name: "Martini Dry", price: 3.500, desc: "Aperitif · 30 ml" },
    { id: "ap-martini-bianco", cat: "liqueurs", tone: "cream", name: "Martini Bianco", price: 3.500, desc: "Aperitif · 30 ml" },
    { id: "ap-martini-rosso", cat: "liqueurs", tone: "berry", name: "Martini Rosso", price: 3.500, desc: "Aperitif · 30 ml" },
    { id: "ap-campari", cat: "liqueurs", tone: "berry", name: "Campari", price: 3.500, desc: "Aperitif · 30 ml" },
    { id: "ap-aperol", cat: "liqueurs", tone: "caramel", name: "Aperol", price: 4.000, desc: "Aperitif · 30 ml" },

    // ---- SPIRITS (whisky, vodka, rum, tequila, gin, cognac) ----
    ...spiritItems,

    // ---- WINE & CHAMPAGNE ----
    { id: "wn-white", cat: "wine", tone: "cream", name: "Sauvignon Blanc (France)", price: 4.000, desc: "White wine · glass · نبيذ أبيض" },
    { id: "wn-white-btl", cat: "wine", tone: "cream", name: "Sauvignon Blanc (France) — Bottle", price: 18.000, desc: "White wine · bottle · نبيذ أبيض" },
    { id: "wn-red", cat: "wine", tone: "berry", name: "Merlot (France)", price: 4.000, desc: "Red wine · glass · نبيذ أحمر" },
    { id: "wn-red-btl", cat: "wine", tone: "berry", name: "Merlot (France) — Bottle", price: 18.000, desc: "Red wine · bottle · نبيذ أحمر" },
    { id: "wn-rose", cat: "wine", tone: "berry", name: "Zinfandel Rosé (USA)", price: 4.000, desc: "Rosé · glass · نبيذ روزيه" },
    { id: "wn-rose-btl", cat: "wine", tone: "berry", name: "Zinfandel Rosé (USA) — Bottle", price: 18.000, desc: "Rosé · bottle · نبيذ روزيه" },
    { id: "ch-moet", cat: "wine", tone: "cream", badge: "Celebrate", name: "Moët & Chandon", price: 170.000, desc: "Champagne · bottle · مويت آند شاندون" },
    { id: "ch-dom", cat: "wine", tone: "cream", badge: "Celebrate", name: "Dom Pérignon", price: 330.000, desc: "Champagne · bottle · دوم بيرينيون" },
    { id: "sw-don-luciano", cat: "wine", tone: "cream", name: "Don Luciano (Italy)", price: 25.000, desc: "Sparkling wine · bottle · دون لوتشيانو" },
    { id: "sw-bottega", cat: "wine", tone: "cream", name: "Bottega (Italy)", price: 50.000, desc: "Sparkling wine · bottle · بوتيغا" },

    // ---- SHOOTERS ----
    { id: "sh-brazilian", cat: "shooters", tone: "caramel", name: "Brazilian Sex", price: 5.000, desc: "Shooter" },
    { id: "sh-b52", cat: "shooters", tone: "mocha", name: "B52", price: 4.500, desc: "Shooter" },
    { id: "sh-kamikaze", cat: "shooters", tone: "cold", name: "Kamikaze", price: 4.000, desc: "Shooter · كاميكازي" },
    { id: "sh-flaming", cat: "shooters", tone: "berry", name: "Flaming Lamborghini", price: 7.000, desc: "Shooter · فلامنج لامبورغيني" },
    { id: "sh-jager-bomb", cat: "shooters", tone: "espresso", name: "Jäger Bomb", price: 5.000, desc: "Shooter · ياغر بومب" },

    // ---- SOFT DRINKS & WATER ----
    { id: "wt-evian-s", cat: "soft", tone: "cold", name: "Evian (Small)", price: 1.900, desc: "Still water · إيفيان صغير" },
    { id: "wt-evian-l", cat: "soft", tone: "cold", name: "Evian (Large)", price: 2.900, desc: "Still water · إيفيان كبير" },
    { id: "wt-evian-sp-s", cat: "soft", tone: "cold", name: "Evian Sparkling (Small)", price: 2.000, desc: "Sparkling water · إيفيان غازية صغير" },
    { id: "wt-evian-sp-l", cat: "soft", tone: "cold", name: "Evian Sparkling (Large)", price: 3.000, desc: "Sparkling water · إيفيان غازية كبير" },
    { id: "wt-arwa", cat: "soft", tone: "cold", name: "Arwa", price: 1.000, desc: "Still water · أروى" },
    { id: "sd-coke", cat: "soft", tone: "espresso", name: "Coke", price: 1.500, desc: "Can · 330 ml" },
    { id: "sd-coke-zero", cat: "soft", tone: "espresso", name: "Coke Zero", price: 1.500, desc: "Can · 330 ml" },
    { id: "sd-sprite", cat: "soft", tone: "green", name: "Sprite", price: 1.500, desc: "Can · 330 ml" },
    { id: "sd-sprite-zero", cat: "soft", tone: "green", name: "Sprite Zero", price: 1.500, desc: "Can · 330 ml" },
    { id: "sd-soda", cat: "soft", tone: "cold", name: "Soda", price: 1.500, desc: "Can · 330 ml" },
    { id: "sd-tonic", cat: "soft", tone: "cold", name: "Tonic", price: 1.500, desc: "Can · 330 ml" },
    { id: "sd-ginger-ale", cat: "soft", tone: "wheat", name: "Ginger Ale", price: 1.500, desc: "Can · 330 ml" },
    { id: "en-red-bull", cat: "soft", tone: "cold", name: "Red Bull", price: 3.000, desc: "Energy drink · 250 ml" },
    { id: "en-red-bull-light", cat: "soft", tone: "cold", name: "Red Bull Light", price: 3.000, desc: "Energy drink · 250 ml" },
  ];

  const MENUS = {
    ird: { categories: IRD_CATEGORIES, menu: IRD_MENU },
    elixir: { categories: ELIXIR_CATEGORIES, menu: ELIXIR_MENU },
  };
  // a store created later from the dashboard starts from the in-room menu
  const CATEGORIES = IRD_CATEGORIES;
  const MENU = IRD_MENU;

  const api = { BRAND, ALLERGENS, MENUS, CATEGORIES, MENU };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.BRAND = BRAND;
    root.ALLERGENS = ALLERGENS;
    root.CATEGORIES = CATEGORIES;
    root.MENU = MENU;
  }
})(typeof self !== "undefined" ? self : globalThis);
