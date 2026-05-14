--
-- PostgreSQL database dump
--

\restrict F9pTd7sX2vtELilhtUBOaBhnShzte8zgr87ze2qR8hjNbfHH1tLvQS8kTWDh4eA

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: InteractionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InteractionType" AS ENUM (
    'EMAIL',
    'CALL',
    'NOTE'
);


ALTER TYPE public."InteractionType" OWNER TO postgres;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'DELIVERED',
    'CANCELLED'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'CASH_ON_DELIVERY'
);


ALTER TYPE public."PaymentMethod" OWNER TO postgres;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'PAID',
    'FAILED',
    'CANCELLED'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- Name: TicketStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TicketStatus" AS ENUM (
    'OPEN',
    'IN_PROGRESS',
    'CLOSED'
);


ALTER TYPE public."TicketStatus" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'CUSTOMER',
    'ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Category_id_seq" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: Customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Customer" (
    id integer NOT NULL,
    phone text,
    address text,
    "userId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Customer" OWNER TO postgres;

--
-- Name: Customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Customer_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Customer_id_seq" OWNER TO postgres;

--
-- Name: Customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Customer_id_seq" OWNED BY public."Customer".id;


--
-- Name: Interaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Interaction" (
    id integer NOT NULL,
    type public."InteractionType" NOT NULL,
    message text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "customerId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Interaction" OWNER TO postgres;

--
-- Name: Interaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Interaction_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Interaction_id_seq" OWNER TO postgres;

--
-- Name: Interaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Interaction_id_seq" OWNED BY public."Interaction".id;


--
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    id integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "customerId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "totalAmount" double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItem" (
    id integer NOT NULL,
    price numeric(10,2) NOT NULL,
    quantity integer NOT NULL,
    "orderId" integer NOT NULL,
    "productId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO postgres;

--
-- Name: OrderItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."OrderItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."OrderItem_id_seq" OWNER TO postgres;

--
-- Name: OrderItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."OrderItem_id_seq" OWNED BY public."OrderItem".id;


--
-- Name: Order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Order_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Order_id_seq" OWNER TO postgres;

--
-- Name: Order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Order_id_seq" OWNED BY public."Order".id;


--
-- Name: Payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Payment" (
    id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    method public."PaymentMethod" DEFAULT 'CASH_ON_DELIVERY'::public."PaymentMethod" NOT NULL,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    "paidAt" timestamp(3) without time zone,
    "orderId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Payment" OWNER TO postgres;

--
-- Name: Payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Payment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Payment_id_seq" OWNER TO postgres;

--
-- Name: Payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Payment_id_seq" OWNED BY public."Payment".id;


--
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Product" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    "categoryId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "imageUrl" text
);


ALTER TABLE public."Product" OWNER TO postgres;

--
-- Name: Product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Product_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Product_id_seq" OWNER TO postgres;

--
-- Name: Product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Product_id_seq" OWNED BY public."Product".id;


--
-- Name: Recommendation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Recommendation" (
    id integer NOT NULL,
    content text NOT NULL,
    "customerId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Recommendation" OWNER TO postgres;

--
-- Name: Recommendation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Recommendation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Recommendation_id_seq" OWNER TO postgres;

--
-- Name: Recommendation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Recommendation_id_seq" OWNED BY public."Recommendation".id;


--
-- Name: SupportTicket; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SupportTicket" (
    id integer NOT NULL,
    subject text NOT NULL,
    status public."TicketStatus" DEFAULT 'OPEN'::public."TicketStatus" NOT NULL,
    "customerId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SupportTicket" OWNER TO postgres;

--
-- Name: SupportTicket_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SupportTicket_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SupportTicket_id_seq" OWNER TO postgres;

--
-- Name: SupportTicket_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SupportTicket_id_seq" OWNED BY public."SupportTicket".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role public."UserRole" DEFAULT 'CUSTOMER'::public."UserRole" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: Customer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer" ALTER COLUMN id SET DEFAULT nextval('public."Customer_id_seq"'::regclass);


--
-- Name: Interaction id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Interaction" ALTER COLUMN id SET DEFAULT nextval('public."Interaction_id_seq"'::regclass);


--
-- Name: Order id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order" ALTER COLUMN id SET DEFAULT nextval('public."Order_id_seq"'::regclass);


--
-- Name: OrderItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem" ALTER COLUMN id SET DEFAULT nextval('public."OrderItem_id_seq"'::regclass);


--
-- Name: Payment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment" ALTER COLUMN id SET DEFAULT nextval('public."Payment_id_seq"'::regclass);


--
-- Name: Product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product" ALTER COLUMN id SET DEFAULT nextval('public."Product_id_seq"'::regclass);


--
-- Name: Recommendation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Recommendation" ALTER COLUMN id SET DEFAULT nextval('public."Recommendation_id_seq"'::regclass);


--
-- Name: SupportTicket id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SupportTicket" ALTER COLUMN id SET DEFAULT nextval('public."SupportTicket_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name, description, "createdAt", "updatedAt") FROM stdin;
1	Poterie & céramique	Objets artisanaux en poterie et céramique.	2026-05-13 13:12:30.876	2026-05-13 13:12:30.876
2	Cuir	Articles en cuir fabriqués de manière artisanale.	2026-05-13 13:12:30.891	2026-05-13 13:12:30.891
3	Textile	Produits textiles traditionnels et modernes.	2026-05-13 13:12:30.897	2026-05-13 13:12:30.897
4	Luminaires	Lampes et luminaires décoratifs.	2026-05-13 13:12:30.903	2026-05-13 13:12:30.903
5	Verrerie & théières	Verrerie artisanale et théières.	2026-05-13 13:12:30.908	2026-05-13 13:12:30.908
\.


--
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Customer" (id, phone, address, "userId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Interaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Interaction" (id, type, message, date, "customerId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" (id, date, status, "customerId", "createdAt", "updatedAt", "totalAmount") FROM stdin;
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItem" (id, price, quantity, "orderId", "productId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Payment" (id, amount, method, status, "paidAt", "orderId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (id, name, description, price, stock, "categoryId", "createdAt", "updatedAt", "imageUrl") FROM stdin;
4	Bracelet de Montre Artisanal en Perles - Motifs Géométriques Bohème	Sublimez votre montre connectée avec ce bracelet unique fait main. Tissage de perles de haute précision avec des motifs géométriques vibrants. Fermoir robuste et adaptateurs compatibles avec les montres standards (type Apple Watch). Allie artisanat traditionnel et modernité. Confortable et durable pour un usage quotidien.	350.00	10	2	2026-05-12 14:32:03.921	2026-05-12 14:32:03.921	/uploads/products/1778596323865-article1cuir.jfif
5	Set Maroquinerie Trio en Cuir - Marron Terre avec Broderies Artisanales	Un ensemble élégant et complet comprenant un portefeuille à rabat, un porte-cartes compact et un porte-clés assorti. Confectionné en cuir de vachette de première qualité, chaque pièce arbore une bande brodée aux motifs géométriques traditionnels. Finitions soignées avec coutures apparentes pour un look authentique et durable. Un coffret idéal pour offrir.	650.00	5	2	2026-05-12 14:36:33.181	2026-05-12 14:36:33.181	/uploads/products/1778596593052-pack2cuir.jfif
6	Sac à Main Mixte Cuir et Osier Tressé - Élégance Artisanale	L'alliance parfaite de la tradition et du style moderne. Ce sac à main rigide est conçu avec une structure en osier finement tressé à la main, rehaussée par un rabat et des poignées en cuir lisse de couleur acajou. Doté d'un fermoir métallique doré pivotant pour une sécurité optimale. Sa forme arrondie et son look bohème-chic en font l'accessoire idéal pour vos sorties estivales.	580.00	8	2	2026-05-12 14:38:25.235	2026-05-12 14:38:25.235	/uploads/products/1778596705209-sac1.jfif
7	Sac à Main Prestige - Cuir et Tapisserie Brodée Florale	Une œuvre d'art à porter au bras. Ce sac structuré marie un cuir de vachette finement surpiqué à un panneau central en tapisserie richement brodée. Les motifs floraux baroques en rouge cerise et bleu nuit apportent une élégance intemporelle. Équipé de poignées robustes en cuir et de boucles en laiton vieilli. L'intérieur est spacieux et entièrement doublé pour un confort optimal.	850.00	3	2	2026-05-12 14:39:35.875	2026-05-12 14:39:35.875	/uploads/products/1778596775850-sac2cuir.jfif
8	Sac à Main Prestige - Cuir et Tapisserie Brodée Florale	Une œuvre d'art à porter au bras. Ce sac structuré marie un cuir de vachette finement surpiqué à un panneau central en tapisserie richement brodée. Les motifs floraux baroques en rouge cerise et bleu nuit apportent une élégance intemporelle. Équipé de poignées robustes en cuir et de boucles en laiton vieilli. L'intérieur est spacieux et entièrement doublé pour un confort optimal.	850.00	4	2	2026-05-12 14:42:00.017	2026-05-12 14:42:00.017	/uploads/products/1778596919888-sac3cuir.jfif
9	Minaudière de Luxe - Blanc Ivoire avec Broderie Géométrique Rose	L'accessoire de cérémonie par excellence. Cette minaudière rigide, de couleur blanc ivoire, arbore une broderie centrale délicate aux tons rose poudré et noir. Son format rectangulaire compact est idéal pour transporter l'essentiel avec élégance. Elle dispose d'une poignée chaîne délicate pour un porté main sophistiqué. Finitions haute couture pour un look chic et épuré.	950.00	4	2	2026-05-12 14:43:13.124	2026-05-12 14:43:13.124	/uploads/products/1778596993106-sac4cuir.jfif
10	Sac à Dos "Nomade" en Cuir Naturel - Surpiqûres Noires	Un compagnon de route robuste et stylé. Ce sac à dos est fabriqué en cuir de chèvre au tannage naturel, offrant une patine qui s'embellit avec le temps. Il se distingue par ses surpiqûres décoratives noires faites à la main et ses fermetures à boucles métalliques. Comprend une grande poche principale avec cordon de serrage et une poche frontale pratique pour vos petits objets. Bretelles réglables pour un confort sur mesure.	720.00	12	2	2026-05-12 14:45:01.923	2026-05-12 14:45:01.923	/uploads/products/1778597101904-sac5cuir.jfif
11	Ceinture Ethnique en Cuir et Kilim Tissé Main	Accessoirisez vos tenues avec cette ceinture unique fusionnant cuir de vachette et textile kilim. La sangle est ornée de motifs géométriques berbères tissés à la main dans des tons rouge brique, jaune et vert. Dotée d'une boucle métallique brossée et d'un passant en cuir surpiqué. Sa doublure intérieure en cuir lisse assure une excellente durabilité et un confort optimal au porté.	290.00	20	2	2026-05-12 14:46:40.888	2026-05-12 14:46:40.888	/uploads/products/1778597200870-semta1cuir.jfif
12	Lanterne Royale en Laiton Ciselé - Suspension Orientale	Transformez votre intérieur en palais des mille et une nuits. Cette suspension en laiton massif est entièrement ciselée à la main par des maîtres artisans. Ses perforations géométriques complexes créent une ambiance chaleureuse en projetant des motifs envoûtants sur vos murs. Finition bronze antique pour un aspect authentique. Idéale pour un salon, une entrée ou une chambre.	1200.00	6	4	2026-05-12 14:49:06.597	2026-05-12 14:49:06.597	/uploads/products/1778597346475-AMIRA-Hand-Sawn-Brass-Pendant-Light-_-Moroccan-Baz.jfif
13	Lustre Impérial à Étages - Laiton Doré Ciselé Main	Un lustre d'exception au design pyramidal composé de plusieurs niveaux finement travaillés. Ce luminaire en laiton doré est orné de motifs de dentelle métallique, offrant une diffusion de lumière féerique et un éclat incomparable. Son architecture imposante en fait le centre d'attention idéal pour les grands salons, les réceptions ou les halls d'entrée élégants. Un chef-d'œuvre de l'artisanat de Fès.	2800.00	2	4	2026-05-12 14:51:05.477	2026-05-12 14:51:05.477	/uploads/products/1778597465454-DJAMEL-Turkish-Lamp-Vintage-Chandelier-Moroccan-La.jfif
14	Applique Murale Carrée "Moucharabieh" - Laiton Ciselé Moderne	Apportez une touche de design oriental moderne à vos murs. Cette applique carrée en laiton de haute qualité présente un travail de ciselure ultra-précis rappelant les motifs moucharabieh. Sa structure plate permet une diffusion de lumière douce et tamisée, idéale pour créer une ambiance feutrée dans un couloir, un salon ou une tête de lit. Un mélange parfait entre géométrie contemporaine et savoir-faire ancestral.	950.00	10	4	2026-05-12 14:52:58.81	2026-05-12 14:52:58.81	/uploads/products/1778597578797-MIDAN-Flush-Wall-_-Ceiling-Light-from-Moroccan-Baz.jfif
15	Applique Tube Murale en Laiton - Duo de Ciselures Artisanales	Élégante et élancée, cette applique murale en forme de demi-cylindre est réalisée en laiton massif. Elle présente deux zones de ciselures délicates aux extrémités, laissant filtrer une lumière douce et projeter des rayons étoilés sur vos murs. La partie centrale pleine met en valeur la texture brossée du métal. Parfaite pour créer un éclairage indirect chaleureux et une décoration orientale épurée.	550.00	15	4	2026-05-12 14:54:10.009	2026-05-12 14:54:10.009	/uploads/products/1778597649902-Set-of-2-Moroccan-Wall-Lamp-Brass-Wall-Mount-Light.jfif
16	Lanterne Cylindrique "Dôme" en Laiton - Éclat Ciselé	Une pièce maîtresse qui allie géométrie et tradition. Cette lanterne cylindrique en laiton brossé est surmontée d'un chapeau conique élégant. Sa surface est entièrement perforée de motifs stellaires qui diffusent une lumière scintillante à 360 degrés. Parfaite pour créer une oasis de lumière sur une table d'appoint ou pour illuminer un coin de lecture. Finition artisanale de haute précision.	680.00	12	4	2026-05-12 14:56:41.878	2026-05-12 14:56:41.878	/uploads/products/1778597801856-SHOROK-Floor-Lamp-from-Moroccan-Bazaar.jfif
17	Lanterne Cylindrique "Dôme" en Laiton - Éclat Ciselé	Une pièce maîtresse qui allie géométrie et tradition. Cette lanterne cylindrique en laiton brossé est surmontée d'un chapeau conique élégant. Sa surface est entièrement perforée de motifs stellaires qui diffusent une lumière scintillante à 360 degrés. Parfaite pour créer une oasis de lumière sur une table d'appoint ou pour illuminer un coin de lecture. Finition artisanale de haute précision.	680.00	12	4	2026-05-12 14:57:49.317	2026-05-12 14:57:49.317	/uploads/products/1778597869291-t-l-chargement.jfif
18	Applique Murale Orientale en Mosaïque de Verre Multicolore	Apportez une explosion de couleurs à votre intérieur avec cette applique murale artisanale. Le globe est composé de centaines de fragments de verre coloré et de perles, assemblés à la main pour créer une mosaïque éblouissante. Le support en métal travaillé avec des volutes traditionnelles complète parfaitement ce luminaire. Une fois allumée, elle diffuse une lumière chaleureuse et crée une ambiance magique et bohème.	480.00	10	4	2026-05-12 15:02:44.101	2026-05-12 15:02:44.101	/uploads/products/1778598164081-Turkish-Moroccan-Mosaic-Bohemian-Boho-Tiffany-Styl.jfif
19	Pack Poterie Marocaine Fès — Set 4 pièces	Pack artisanal de 4 pièces en poterie marocaine de Fès, peintes à la main avec des motifs géométriques traditionnels en bleu et or. Comprend : 1 tajine décoratif, 2 vases à col étroit et 1 petit bol. Idéal comme décoration ou cadeau authentique. Chaque pièce est unique.	350.00	10	1	2026-05-12 15:13:58.917	2026-05-12 15:13:58.917	/uploads/products/1778598838801-pack1.jpeg
20	Vase Berbère Artisanal — Motifs Géométriques	Vase artisanal berbère en terre cuite, peint à la main avec des motifs géométriques traditionnels en rouge, vert et ocre. Forme ronde et col étroit typique du savoir-faire marocain. Parfait comme pièce décorative pour intérieur ou extérieur. Pièce unique faite main.	180.00	15	1	2026-05-12 15:15:34.04	2026-05-12 15:15:34.04	/uploads/products/1778598934018-vazz.jpeg
21	Set Carafe & Tasse Berbère — Terre Cuite Gravée	Set artisanal composé d'une carafe à anse et d'une tasse assortie en terre cuite, ornées de motifs géométriques gravés et peints en noir sur fond brun naturel. Fabrication traditionnelle marocaine, idéal pour servir l'eau ou le thé. Pièces faites main, légères variations possibles selon l'artisan.	220.00	12	1	2026-05-12 15:16:50.432	2026-05-12 15:16:50.432	/uploads/products/1778599010411-lkhabya.jfif
22	Fontaine Filtrante Terre Cuite — Set 3 pièces	Fontaine à eau traditionnelle marocaine en terre cuite naturelle non traitée, composée de 3 pièces : grand récipient supérieur, socle surélevé et petit bol. Robinet en laiton doré intégré. La terre cuite filtre et refroidit naturellement l'eau. Design épuré et minimaliste, couleur terracotta chaude. Fabrication artisanale 100% naturelle.	480.00	8	1	2026-05-12 15:18:03.565	2026-05-12 15:18:03.565	/uploads/products/1778599083547-fekhara.jfif
23	Service à Thé Céramique Émaillée — Théière + 4 Tasses	Service à thé artisanal marocain composé d'une théière et 4 tasses assorties en céramique émaillée. Glaçure naturelle aux reflets bleu-vert et doré, aspect rustique et authentique. Idéal pour un usage quotidien ou comme cadeau. Chaque pièce est façonnée et émaillée à la main, rendant chaque set unique.	320.00	10	1	2026-05-12 15:25:49.276	2026-05-12 15:25:49.276	/uploads/products/1778599549124-pack3.jpg
24	Tajine Décoratif Marocain — Motifs Traditionnels Peints	Tajine artisanal marocain en terre cuite peint à la main, orné de motifs géométriques et floraux traditionnels en noir et ocre sur fond terracotta chaud. Peut être utilisé comme pièce décorative ou pour la cuisson. Couvercle conique emblématique du tajine marocain. Fabrication artisanale authentique.	250.00	12	1	2026-05-12 15:27:13.407	2026-05-12 15:27:13.407	/uploads/products/1778599633385-tajine.jfif
25	Vase Céramique Artisanal — Décor Éclaboussures Multicolores	Grand vase en céramique artisanale à fond ivoire clair, décoré à la main par projection de couleurs vives — rouge, vert, bleu et ocre — pour un effet éclaboussures unique. Forme élancée avec col étroit et base large. Style contemporain alliant savoir-faire traditionnel marocain et touche artistique moderne. Pièce unique.	195.00	10	1	2026-05-12 15:29:38.766	2026-05-12 15:29:38.766	/uploads/products/1778599778750-vaz.jfif
26	Gsaa — Plat Creux Traditionnel en Terre Cuite	Gsaa traditionnel marocain en terre cuite naturelle non vernie, grand plat creux rond utilisé pour pétrir la pâte, préparer le couscous ou servir les plats familiaux. Surface lisse intérieure, bords évasés. Matière 100% naturelle, respire et conserve la fraîcheur des aliments. Ustensile authentique du foyer marocain.	120.00	20	1	2026-05-12 15:32:42.502	2026-05-12 15:32:42.502	/uploads/products/1778599962482-gasaa.jfif
31	Sac Berbère Tissé Rouge & Noir à Franges	Sac artisanal marocain inspiré du tissage berbère traditionnel, réalisé à la main avec des motifs géométriques en rouge, noir et blanc. Doté d’une longue bandoulière tissée et de finitions à franges élégantes. Léger, pratique et authentique, idéal pour compléter un look bohème chic au quotidien.	120.00	10	3	2026-05-13 15:54:37.582	2026-05-13 15:55:13.88	/uploads/products/1778687677253-t-l-chargement.jfif
32	Tapis Berbère Traditionnel Rouge & Noir	Tapis marocain tissé à la main aux motifs berbères authentiques en rouge, noir et blanc. Confectionné avec un savoir-faire artisanal traditionnel, il présente des détails géométriques élégants et des finitions à franges raffinées. Idéal pour apporter une touche chaleureuse, ethnique et contemporaine à un salon, une chambre ou un espace de détente.	340.00	10	3	2026-05-13 15:56:04.315	2026-05-13 15:56:04.315	/uploads/products/1778687764299-t-l-chargement-1-.jfif
33	Salon Marocain Berbère Beige & Rouge		890.00	8	3	2026-05-13 15:56:45.986	2026-05-13 15:56:45.986	/uploads/products/1778687805973--Google-Search.jfif
34	Chemise Traditionnelle Brodée Rouge Artisanale	Chemise artisanale inspirée des broderies traditionnelles berbères, confectionnée dans un tissu naturel léger au ton beige écru. Ornée de motifs géométriques rouges minutieusement brodés sur le col, le buste et les manches, elle allie élégance authentique et confort moderne. Une pièce raffinée idéale pour un style bohème chic et intemporel.	210.00	10	3	2026-05-13 15:58:55.28	2026-05-13 15:58:55.28	/uploads/products/1778687935213-t-l-chargement-2-.jfif
35	apis Berbère Impérial Rouge & Bleu	Tapis marocain artisanal richement décoré de motifs berbères traditionnels aux nuances profondes de rouge, bleu et beige. Tissé avec un savoir-faire authentique, il présente des détails géométriques et floraux inspirés du patrimoine amazigh. Élégant et chaleureux, ce tapis apporte une touche raffinée et culturelle à tout espace de vie contemporain ou traditionnel.	520.00	5	3	2026-05-13 16:00:47.554	2026-05-13 16:00:47.554	/uploads/products/1778688047422-Oberon-Turkish-Rug-Square-_-180-x-180.jfif
36	Service à Thé Marocain Cuivré Traditionnel	Ensemble artisanal marocain composé d’une théière traditionnelle cuivrée, d’un plateau gravé à motifs orientaux et de verres décoratifs assortis. Réalisé avec des finitions élégantes et un design authentique inspiré du patrimoine marocain, ce service apporte une touche chaleureuse et raffinée aux moments de partage autour du thé. Idéal pour une décoration orientale chic et des réceptions conviviales.	210.00	10	5	2026-05-13 16:03:33.97	2026-05-13 16:03:33.97	/uploads/products/1778688213933-Service-6-Po-lons-ZWAK-.jfif
37	Plateau à Thé Marocain Doré Prestige	Service à thé marocain artisanal en finition dorée, composé d’un plateau gravé, d’une théière traditionnelle et d’accessoires décoratifs raffinés. Les motifs orientaux finement travaillés reflètent l’élégance du savoir-faire marocain authentique. Parfait pour servir le thé avec style ou sublimer une décoration intérieure luxueuse et traditionnelle.	260.00	10	5	2026-05-13 16:05:57.222	2026-05-13 16:05:57.222	/uploads/products/1778688357135-Algerian-copper-1-.jfif
38	Service à Thé Marocain Royal Doré	Magnifique service à thé marocain en métal doré, composé d’une théière traditionnelle, d’un grand plateau gravé et d’accessoires artisanaux élégants. Les détails finement ciselés et les motifs orientaux raffinés mettent en valeur le savoir-faire marocain authentique. Un ensemble luxueux idéal pour les cérémonies du thé, les réceptions ou une décoration orientale prestigieuse.	520.00	8	5	2026-05-13 16:06:55.613	2026-05-13 16:06:55.613	/uploads/products/1778688415600--.jfif
39	Verres Marocains Cristal Gravé Transparent	Lot de verres marocains élégants en cristal transparent, ornés de motifs gravés inspirés de l’art oriental traditionnel. Leur design raffiné allie modernité et authenticité, parfait pour servir le thé, les jus ou les boissons fraîches avec style. Idéal pour une table chic et une ambiance marocaine sophistiquée.	60.00	12	5	2026-05-13 16:08:06.906	2026-05-13 16:08:06.906	/uploads/products/1778688486886-t-l-chargement-3-.jfif
40	Coffret de Verres Marocains Colorés Dorés	Coffret élégant de verres marocains artisanaux aux couleurs vibrantes et aux motifs dorés inspirés de l’art oriental traditionnel. Chaque verre présente des finitions raffinées et un design authentique idéal pour servir le thé marocain avec élégance. Parfait pour les réceptions, les cadeaux raffinés ou pour apporter une touche chaleureuse et luxueuse à votre table.	100.00	12	5	2026-05-13 16:09:35.394	2026-05-13 16:09:35.394	/uploads/products/1778688575358-t-l-chargement-4-.jfif
41	Coffret Marocain en Verre Décoré Oriental	Magnifique coffret marocain composé de quatre pots en verre décorés de motifs orientaux multicolores et de détails dorés raffinés. Accompagné d’un support élégant en métal doré, cet ensemble artisanal est idéal pour présenter sucre, épices, fruits secs ou gourmandises avec style. Une pièce décorative authentique qui apporte charme et élégance à toute table marocaine ou orientale.	130.00	10	5	2026-05-13 16:11:13.334	2026-05-13 16:14:28.465	/uploads/products/1778688805212--Apportez-une-touche-d-l-gance-traditionnelle-votr.jfif
27	Sac Bohème Berbère Tissé Beige & Terracotta	Sac artisanal marocain en textile tissé avec motifs berbères brodés aux nuances beige, terracotta et brun. Doté de poignées tressées élégantes et de finitions bohèmes raffinées, il allie authenticité, confort et style contemporain. Spacieux et pratique, ce sac est parfait pour un usage quotidien avec une touche artisanale chic et ethnique.	150.00	8	3	2026-05-12 15:40:43.061	2026-05-13 16:18:12.057	/uploads/products/1778689091836-t-l-chargement-6-.jfif
\.


--
-- Data for Name: Recommendation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Recommendation" (id, content, "customerId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SupportTicket; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SupportTicket" (id, subject, status, "customerId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, password, role, "createdAt", "updatedAt") FROM stdin;
1	Dar Artisanat Admin	admin@darartisanat.com	$2b$10$8qEpawik46kX5ulBpNFJ5OGdMaVx5YcjdkRGb9NUpGYTBDfaqkm/y	ADMIN	2026-05-11 17:26:23.602	2026-05-12 14:28:51.787
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
f986873b-cf0e-47ac-8ef2-b9cb4225cf91	b638ebd17971728e6eefa6ae0f453a9e604591ca2025b503d23a1be506837c27	2026-05-13 13:11:52.288993+00	20260427223520_day2_init_schema	\N	\N	2026-05-13 13:11:51.973039+00	1
f5a08de8-1857-4c6e-809b-28773cfa7020	25614c36b0a5ca2bec54f7c141cf2f83354f3ec89ebe6634217a2ede7ed63ed6	2026-05-13 13:11:52.310655+00	20260430135343_add_total_amount_to_order	\N	\N	2026-05-13 13:11:52.294349+00	1
78eb440a-2510-4310-9f4b-035dad501205	afd213c154dbc9c3eead9ced631f309f9c14d9a1e684c9133d86f74752540afc	2026-05-13 13:11:52.333141+00	20260507223818_add_product_image_url	\N	\N	2026-05-13 13:11:52.317119+00	1
51262aa1-bdb1-4fbb-84cf-6b1aaebd4d89	b638ebd17971728e6eefa6ae0f453a9e604591ca2025b503d23a1be506837c27	2026-05-11 17:26:00.466242+00	20260427223520_day2_init_schema	\N	\N	2026-05-11 17:26:00.141575+00	1
8f414cc2-20e8-43f3-9c5f-f9c0401f98c7	25614c36b0a5ca2bec54f7c141cf2f83354f3ec89ebe6634217a2ede7ed63ed6	2026-05-11 17:26:00.48138+00	20260430135343_add_total_amount_to_order	\N	\N	2026-05-11 17:26:00.469775+00	1
2dd4b8ec-edc9-42db-a9fc-6f9706034879	afd213c154dbc9c3eead9ced631f309f9c14d9a1e684c9133d86f74752540afc	2026-05-11 17:26:00.496498+00	20260507223818_add_product_image_url	\N	\N	2026-05-11 17:26:00.485384+00	1
\.


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_id_seq"', 20, true);


--
-- Name: Customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Customer_id_seq"', 1, false);


--
-- Name: Interaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Interaction_id_seq"', 1, false);


--
-- Name: OrderItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OrderItem_id_seq"', 1, false);


--
-- Name: Order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Order_id_seq"', 1, false);


--
-- Name: Payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Payment_id_seq"', 1, false);


--
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Product_id_seq"', 41, true);


--
-- Name: Recommendation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Recommendation_id_seq"', 1, false);


--
-- Name: SupportTicket_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SupportTicket_id_seq"', 1, false);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 2, true);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Customer Customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_pkey" PRIMARY KEY (id);


--
-- Name: Interaction Interaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Interaction"
    ADD CONSTRAINT "Interaction_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: Recommendation Recommendation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Recommendation"
    ADD CONSTRAINT "Recommendation_pkey" PRIMARY KEY (id);


--
-- Name: SupportTicket SupportTicket_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SupportTicket"
    ADD CONSTRAINT "SupportTicket_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: Customer_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Customer_userId_key" ON public."Customer" USING btree ("userId");


--
-- Name: Interaction_customerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Interaction_customerId_idx" ON public."Interaction" USING btree ("customerId");


--
-- Name: OrderItem_orderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "OrderItem_orderId_idx" ON public."OrderItem" USING btree ("orderId");


--
-- Name: OrderItem_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "OrderItem_productId_idx" ON public."OrderItem" USING btree ("productId");


--
-- Name: Order_customerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_customerId_idx" ON public."Order" USING btree ("customerId");


--
-- Name: Payment_orderId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Payment_orderId_key" ON public."Payment" USING btree ("orderId");


--
-- Name: Product_categoryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_categoryId_idx" ON public."Product" USING btree ("categoryId");


--
-- Name: Recommendation_customerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Recommendation_customerId_idx" ON public."Recommendation" USING btree ("customerId");


--
-- Name: SupportTicket_customerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SupportTicket_customerId_idx" ON public."SupportTicket" USING btree ("customerId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Customer Customer_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Interaction Interaction_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Interaction"
    ADD CONSTRAINT "Interaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payment Payment_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Product Product_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Recommendation Recommendation_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Recommendation"
    ADD CONSTRAINT "Recommendation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SupportTicket SupportTicket_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SupportTicket"
    ADD CONSTRAINT "SupportTicket_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict F9pTd7sX2vtELilhtUBOaBhnShzte8zgr87ze2qR8hjNbfHH1tLvQS8kTWDh4eA

