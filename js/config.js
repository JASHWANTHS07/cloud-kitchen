/*
 * ─────────────────────────────────────────────────────────────
 *  EDIT THIS FILE to put in your real business details & menu.
 *  Everything marked  TODO  is a placeholder.
 * ─────────────────────────────────────────────────────────────
 */
window.KITCHEN = {
  // TODO: your kitchen's name (also replace "Saffron & Sage" in index.html)
  name: "Saffron & Sage",

  // TODO: WhatsApp number that receives orders. Country code + number, digits only.
  //       Example for India: "919876543210"
  whatsapp: "919000000000",

  // TODO: phone number shown on the site (as people should dial it)
  phone: "+91 90000 00000",

  // TODO: email (or set to "" to hide)
  email: "hello@example.com",

  // TODO: pickup address
  address: "12 Example Street, Your Area, Your City 560001",

  // TODO: Google Maps link for the pickup address (open Maps → Share → Copy link)
  mapsUrl: "https://maps.google.com/?q=Your+City",

  // TODO: your restaurant page links on delivery apps (set to "" to hide a button)
  swiggyUrl: "https://www.swiggy.com/",
  zomatoUrl: "https://www.zomato.com/",

  // TODO: your FSSAI licence number
  fssai: "00000000000000",

  // TODO: Instagram link (or "" to hide)
  instagram: "https://instagram.com/",

  currency: "₹",

  // Minutes of notice needed before a pickup order is ready
  prepMinutes: 30,

  // TODO: opening hours, 24h "HH:MM". Day 0 = Sunday. Use [] for closed days.
  // You can give two slots a day, e.g. lunch and dinner.
  hours: {
    0: [["12:00", "15:30"], ["19:00", "23:00"]],
    1: [], // Monday: closed
    2: [["12:00", "15:30"], ["19:00", "22:30"]],
    3: [["12:00", "15:30"], ["19:00", "22:30"]],
    4: [["12:00", "15:30"], ["19:00", "22:30"]],
    5: [["12:00", "15:30"], ["19:00", "23:00"]],
    6: [["12:00", "15:30"], ["19:00", "23:00"]],
  },

  /*
   * TODO: your real menu.
   *  veg:        true = green veg mark, false = red non-veg mark
   *  tag:        optional label, e.g. "Bestseller", "Chef's special", "New"
   *  spice:      0–3 chilli level
   *  image:      optional path to a photo, e.g. "images/menu/biryani.jpg".
   *              Leave "" to show a tasteful placeholder. Real photos of your
   *              own food build the most trust; square ~800×800 works best.
   */
  menu: [
    {
      category: "Biryani & Rice",
      items: [
        { id: "chk-biryani", name: "Hyderabadi Chicken Dum Biryani", desc: "Long-grain basmati and marinated chicken, slow-sealed and dum-cooked. Served with raita and salan.", price: 289, veg: false, tag: "Bestseller", spice: 2, image: "" },
        { id: "veg-biryani", name: "Subz Dum Biryani", desc: "Seasonal vegetables, saffron, fried onions and fresh mint, layered and dum-cooked.", price: 229, veg: true, spice: 1, image: "" },
        { id: "mutton-biryani", name: "Mutton Biryani", desc: "Tender bone-in mutton cooked low and slow with whole spices.", price: 379, veg: false, tag: "Chef's special", spice: 2, image: "" },
        { id: "jeera-rice", name: "Ghee Jeera Rice", desc: "Basmati tempered with cumin and pure ghee.", price: 139, veg: true, spice: 0, image: "" },
      ],
    },
    {
      category: "Curries",
      items: [
        { id: "butter-chicken", name: "Butter Chicken", desc: "Charred tandoori chicken in a silky tomato, butter and fenugreek gravy.", price: 299, veg: false, tag: "Bestseller", spice: 1, image: "" },
        { id: "paneer-makhani", name: "Paneer Makhani", desc: "Soft cottage cheese in a rich, mildly sweet makhani gravy.", price: 259, veg: true, spice: 1, image: "" },
        { id: "dal-makhani", name: "Dal Makhani", desc: "Black lentils simmered overnight, finished with cream and butter.", price: 199, veg: true, spice: 1, image: "" },
        { id: "chettinad", name: "Chicken Chettinad", desc: "Fiery South Indian curry with freshly roasted spices and coconut.", price: 289, veg: false, spice: 3, image: "" },
      ],
    },
    {
      category: "Breads",
      items: [
        { id: "butter-naan", name: "Butter Naan", desc: "Soft, tandoor-baked and brushed with butter.", price: 59, veg: true, spice: 0, image: "" },
        { id: "garlic-naan", name: "Garlic Naan", desc: "Topped with roasted garlic and coriander.", price: 69, veg: true, spice: 0, image: "" },
        { id: "laccha", name: "Laccha Paratha", desc: "Flaky, layered whole-wheat paratha.", price: 65, veg: true, spice: 0, image: "" },
      ],
    },
    {
      category: "Combos",
      items: [
        { id: "veg-thali", name: "Everyday Veg Thali", desc: "Dal, two sabzis, rice, 2 rotis, salad and a sweet. A complete home-style meal.", price: 199, veg: true, tag: "Value", spice: 1, image: "" },
        { id: "nonveg-thali", name: "Non-Veg Thali", desc: "Chicken curry, dal, sabzi, rice, 2 rotis, salad and a sweet.", price: 259, veg: false, spice: 2, image: "" },
      ],
    },
    {
      category: "Desserts & Drinks",
      items: [
        { id: "gulab-jamun", name: "Gulab Jamun (2 pcs)", desc: "Warm, soft and soaked in cardamom syrup.", price: 79, veg: true, spice: 0, image: "" },
        { id: "phirni", name: "Kesar Phirni", desc: "Chilled ground-rice pudding with saffron and pistachio.", price: 99, veg: true, tag: "New", spice: 0, image: "" },
        { id: "lassi", name: "Sweet Lassi", desc: "Thick, chilled, freshly churned.", price: 89, veg: true, spice: 0, image: "" },
      ],
    },
  ],
};
