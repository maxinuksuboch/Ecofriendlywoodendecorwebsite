// ─────────────────────────────────────────────────────────────────────────────
// Product data — EcoFriendlyWoodenDecor
// Transparent-background PNG placeholders, premium eco-chic product catalogue
// ─────────────────────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  priceValue: number;
  category: "Furniture" | "Lighting" | "Decor" | "Storage";
  material: "Oak" | "Walnut" | "Ash" | "Birch" | "Teak" | "Reclaimed";
  image: string;
  isNew?: boolean;
  isBestseller?: boolean;
  link?: string;
}

// Warm-cream transparent-look PNG placeholders (FFF8F1 bg → matches card bg seamlessly)
const PH = (label: string, w = 800, h = 640) =>
  `https://placehold.co/${w}x${h}/FFF8F1/C4A97D.png?text=${encodeURIComponent(label)}`;

export const PRODUCTS: Product[] = [
  // ─ Furniture ─────────────────────────────────────────────────────────────
  {
    id: 1,
    title: "Минималистичное кресло из дуба",
    subtitle: "Каркас из цельного дуба, льняная подушка",
    description:
      "Вырезанное из цельной плиты белого дуба, это низкое кресло сочетает в себе скандинавскую сдержанность и японское столярное мастерство — без крепежа и клея.",
    price: "$890",
    priceValue: 890,
    category: "Furniture",
    material: "Oak",
    image: PH("Oak Lounge Chair"),
    isNew: true,
    isBestseller: true,
  },
  {
    id: 2,
    title: "Журнальный стол из ореха с 'живым' краем",
    subtitle: "Столешница из натурального слэба на стальных ножках",
    description:
      "Каждый стол уникален. Слэб ореха сохраняет свой первоначальный лесной край, покрыт матовым маслом для выявления текстуры — спокойный пейзаж для вашей гостиной.",
    price: "$1,240",
    priceValue: 1240,
    category: "Furniture",
    material: "Walnut",
    image: PH("Walnut Coffee Table"),
    isBestseller: true,
    link: "/product/wooden-world-maps",
  },
  {
    id: 3,
    title: "Геометрический столик из березы",
    subtitle: "Гексагональная столешница, конусообразные ножки",
    description:
      "Береза высокоточной резки с фасками, обработанными вручную. Шестиугольная форма повторяет геометрию природных сот — тонкий намек на леса, из которых она родом.",
    price: "$295",
    priceValue: 295,
    category: "Furniture",
    material: "Birch",
    image: PH("Birch Side Table"),
    isNew: true,
  },
  {
    id: 4,
    title: "Изогнутое акцентное кресло из ясеня",
    subtitle: "Гнутый под паром ясень, органический силуэт",
    description:
      "Пропаривание позволяет создавать изгибы, невозможные при обычной распиловке. Каркас из ясеня слегка пружинит, придавая креслу 'живое', отзывчивое качество.",
    price: "$720",
    priceValue: 720,
    category: "Furniture",
    material: "Ash",
    image: PH("Ash Accent Chair"),
  },

  // ─ Lighting ──────────────────────────────────────────────────────────────
  {
    id: 5,
    title: "Дизайнерский торшер из дуба",
    subtitle: "Точеная колонна, льняной диффузор",
    description:
      "Выточен вручную на токарном станке из выдержанного белого дуба. Льняной абажур рассеивает теплый свет (2700K) — точный цвет предзакатного солнца в лесу.",
    price: "$445",
    priceValue: 445,
    category: "Lighting",
    material: "Oak",
    image: PH("Oak Floor Lamp"),
    isNew: true,
  },
  {
    id: 6,
    title: "Резной подвесной светильник из ореха",
    subtitle: "Параметрический решетчатый плафон",
    description:
      "Решетка из 72 деталей ореха, собранная без клея — блокирующиеся швы держатся только за счет натяжения. Ночью он отбрасывает причудливые тени на потолок.",
    price: "$380",
    priceValue: 380,
    category: "Lighting",
    material: "Walnut",
    image: PH("Walnut Pendant Light"),
  },
  {
    id: 7,
    title: "Настольный фонарь из тика",
    subtitle: "Переработанный тик, бумага васи",
    description:
      "Каркас фонаря выполнен из обрезков тика со списанной лодки. Панели из бумаги васи превращают мерцание свечи в медитативное зрелище.",
    price: "$175",
    priceValue: 175,
    category: "Lighting",
    material: "Teak",
    image: PH("Teak Table Lantern"),
    isBestseller: true,
  },

  // ─ Decor ─────────────────────────────────────────────────────────────────
  {
    id: 8,
    title: "Набор ваз из дуба ручной работы",
    subtitle: "Три высоты, одна семья",
    description:
      "Три сосуда, выточенные из одного бревна дуба, поэтому текстура и цвет идеально совпадают. Высокая ваза для сухоцветов, широкая — для одного живого цветка.",
    price: "$155",
    priceValue: 155,
    category: "Decor",
    material: "Oak",
    image: PH("Oak Vase Set"),
    isNew: true,
  },
  {
    id: 9,
    title: "Органическая чаша для сервировки из ясеня",
    subtitle: "Безопасна для еды, безотходное производство",
    description:
      "Вырезана из обрезка ясеня, который иначе стал бы дровами. Натуральная пустота в крае, заполненная эко-смолой, стала главной деталью объекта.",
    price: "$95",
    priceValue: 95,
    category: "Decor",
    material: "Ash",
    image: PH("Ash Serving Bowl"),
  },
  {
    id: 10,
    title: "Многослойная настенная скульптура из ореха",
    subtitle: "7-слойный рельеф, матовая отделка",
    description:
      "Семь индивидуально вырезанных слоев ореха составляют топографический рельеф. Издалека он смотрится как игра теней, вблизи — как ландшафт.",
    price: "$460",
    priceValue: 460,
    category: "Decor",
    material: "Walnut",
    image: PH("Walnut Wall Sculpture"),
    isBestseller: true,
  },

  // ─ Storage ───────────────────────────────────────────────────────────────
  {
    id: 11,
    title: "Книжный шкаф из старой сосны",
    subtitle: "Сосна из вековых амбаров, необработанная сталь",
    description:
      "Сосна, привезенная из амбара XIX века в Карпатах. Соединения шип-паз, отсутствие скрытого крепежа — шкаф полностью разборный для легкого переезда.",
    price: "$675",
    priceValue: 675,
    category: "Storage",
    material: "Reclaimed",
    image: PH("Reclaimed Bookshelf"),
    isNew: true,
  },
  {
    id: 12,
    title: "Подвесной настенный модуль из ореха",
    subtitle: "Модульная трехсекционная система",
    description:
      "Трехсекционный подвесной модуль из промасленного ореха. Каждый модуль крепится через скрытую алюминиевую направляющую — меняйте композицию по мере роста библиотеки.",
    price: "$1,080",
    priceValue: 1080,
    category: "Storage",
    material: "Walnut",
    image: PH("Walnut Wall Unit"),
  },
];

export const CATEGORIES = [
  "Все",
  "Мебель",
  "Освещение",
  "Декор",
  "Хранение",
  "Новинки",
] as const;

export const MATERIALS = [
  "Все материалы",
  "Дуб",
  "Орех",
  "Ясень",
  "Береза",
  "Тик",
  "Винтаж",
] as const;

export const SORT_OPTIONS = [
  "По умолчанию",
  "Цена: дешевле",
  "Цена: дороже",
  "Сначала новые",
  "По названию (А–Я)",
] as const;
