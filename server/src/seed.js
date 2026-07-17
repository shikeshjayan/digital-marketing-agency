import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env") });

import Services from "./models/services.model.js";
import Technology from "./models/technology.model.js";
import Industry from "./models/industry.model.js";
import Team from "./models/team.model.js";
import Review from "./models/reviews.model.js";
import Projects from "./models/projects.model.js";
import FAQ from "./models/faq.model.js";
import CaseStudy from "./models/caseStudy.model.js";
import Contact from "./models/contacts.model.js";

// External placeholder images (picsum.photos) — served directly, no local files needed.
// `img(seed)` returns a stable real photo per seed. Frontend resolveImagePath passes
// http(s) URLs through unchanged, so no frontend changes are required.
const img = (seed, w = 1200, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const SEED_IMAGES = {
  seo: img("crawlcrown-seo"),
  ppc: img("crawlcrown-ppc"),
  social: img("crawlcrown-social"),
  web: img("crawlcrown-web"),
  content: img("crawlcrown-content"),
  branding: img("crawlcrown-branding"),
  email: img("crawlcrown-email"),
  analytics: img("crawlcrown-analytics"),
  cro: img("crawlcrown-cro"),
  video: img("crawlcrown-video"),
  influencer: img("crawlcrown-influencer"),
  affiliate: img("crawlcrown-affiliate"),
  mobile: img("crawlcrown-mobile"),
  pr: img("crawlcrown-pr"),
  orm: img("crawlcrown-orm"),
  voice: img("crawlcrown-voice"),
  ecom: img("crawlcrown-ecom"),
  growth: img("crawlcrown-growth"),
  projectMedicare: img("crawlcrown-medicare"),
  projectFintrack: img("crawlcrown-fintrack"),
  projectUrbannest: img("crawlcrown-urbannest"),
  projectCloudscale: img("crawlcrown-cloudscale"),
  projectEdulearn: img("crawlcrown-edulearn"),
  projectGreenleaf: img("crawlcrown-greenleaf"),
  projectMediconnect: img("crawlcrown-mediconnect"),
  projectDatavault: img("crawlcrown-datavault"),
  projectBrewhouse: img("crawlcrown-brewhouse"),
  projectFittrack: img("crawlcrown-fittrack"),
  projectTravelbuddy: img("crawlcrown-travelbuddy"),
  projectAgrisense: img("crawlcrown-agrisense"),
  caseStudyMedicare: img("crawlcrown-cs-medicare"),
  caseStudyFintrack: img("crawlcrown-cs-fintrack"),
  caseStudyEdulearn: img("crawlcrown-cs-edulearn"),
  caseStudyGreenleaf: img("crawlcrown-cs-greenleaf"),
  caseStudyDatavault: img("crawlcrown-cs-datavault"),
  caseStudyAgrisense: img("crawlcrown-cs-agrisense"),
};

const seedData = {
  services: [
    {
      service_name: "Search Engine Optimization",
      short_description: "Boost your organic visibility and drive qualified traffic with data-driven SEO strategies tailored to your business goals.",
      description:
        "Our Search Engine Optimization (SEO) service is designed to help your business rank higher on search engines like Google, Bing, and Yahoo. We combine technical SEO audits, in-depth keyword research, on-page optimization, and high-quality link building to create a comprehensive strategy that delivers sustainable organic growth. Whether you are a local business targeting nearby customers or a global brand competing in a crowded market, our team crafts a tailored approach that aligns with your unique objectives and industry dynamics.",
      hero_image: SEED_IMAGES.seo,
      icon: "faSearch",
      deliverables: [
        "Comprehensive SEO audit and strategy report",
        "Keyword research and competitor gap analysis",
        "On-page optimization for up to 50 pages",
        "Technical SEO fixes and site speed improvements",
        "Monthly link building and digital PR",
        "Local SEO setup and Google Business Profile optimization",
        "Monthly performance reports with actionable insights",
      ],
      benefits: [
        "Higher organic rankings for target keywords",
        "Increased qualified traffic to your website",
        "Improved local visibility and foot traffic",
        "Long-term cost savings compared to paid advertising",
        "Better user experience and site performance",
        "Measurable ROI with transparent reporting",
      ],
      featured: true,
      display_order: 1,
      seo: {
        meta_title: "Search Engine Optimization (SEO) Services | CrawlCrown",
        meta_description: "Drive organic growth with our data-driven SEO services. Technical audits, keyword research, on-page optimization, and link building.",
      },
      status: "Active",
    },
    {
      service_name: "Pay-Per-Click Advertising",
      short_description: "Maximize your ad spend with targeted PPC campaigns on Google Ads, Meta, and LinkedIn that deliver measurable results.",
      description:
        "Our Pay-Per-Click (PPC) Advertising service helps businesses reach their ideal customers through highly targeted campaigns on Google Ads, Meta (Facebook and Instagram), and LinkedIn. We handle everything from keyword research and ad copywriting to bid management and A/B testing. Our data-driven approach ensures that every dollar you spend is optimized for maximum return, whether you are looking to generate leads, drive e-commerce sales, or increase brand awareness across multiple channels.",
      hero_image: SEED_IMAGES.ppc,
      icon: "faAd",
      deliverables: [
        "PPC strategy and campaign architecture",
        "Keyword research and audience targeting setup",
        "Ad copywriting and creative design",
        "Landing page optimization recommendations",
        "Bid management and budget allocation",
        "Weekly performance monitoring and adjustments",
        "Detailed monthly reporting with ROI analysis",
      ],
      benefits: [
        "Immediate traffic and lead generation",
        "Precise audience targeting by demographics and intent",
        "Full budget control with real-time bid adjustments",
        "A/B testing to continuously improve ad performance",
        "Transparent reporting so you see exactly where your money goes",
        "Scalable campaigns that grow with your business",
      ],
      featured: true,
      display_order: 2,
      seo: {
        meta_title: "Pay-Per-Click (PPC) Advertising Services | CrawlCrown",
        meta_description: "Run high-converting PPC campaigns on Google Ads, Meta, and LinkedIn. Keyword research, ad copywriting, and ROI-driven management.",
      },
      status: "Active",
    },
    {
      service_name: "Social Media Marketing",
      short_description: "Build an engaged community and grow your brand presence across all major social media platforms with strategic content and campaigns.",
      description:
        "Our Social Media Marketing service helps businesses build authentic relationships with their audience across platforms like Instagram, Facebook, LinkedIn, Twitter, and TikTok. We develop a tailored content strategy that includes branded graphics, engaging captions, community management, and paid social campaigns. From growing your follower count to driving meaningful engagement and conversions, our team ensures your social channels become a powerful engine for brand awareness and customer loyalty.",
      hero_image: SEED_IMAGES.social,
      icon: "faBullhorn",
      deliverables: [
        "Social media audit and competitor analysis",
        "Content calendar with 30 posts per month",
        "Branded graphic design and video content",
        "Community management and audience engagement",
        "Paid social media advertising campaigns",
        "Influencer collaboration coordination",
        "Monthly analytics report with growth metrics",
      ],
      benefits: [
        "Stronger brand recognition and recall",
        "Deeper relationships with your target audience",
        "Increased website traffic from social channels",
        "Higher conversion rates from social proof",
        "Real-time customer feedback and insights",
        "Cost-effective marketing with viral potential",
      ],
      featured: false,
      display_order: 3,
      seo: {
        meta_title: "Social Media Marketing Services | CrawlCrown",
        meta_description: "Grow your brand on social media with strategic content, community management, and paid campaigns on Instagram, Facebook, LinkedIn, and more.",
      },
      status: "Active",
    },
    {
      service_name: "Web Development",
      short_description: "Build fast, responsive, and conversion-optimized websites that look stunning and perform flawlessly across all devices.",
      description:
        "Our Web Development service delivers custom-built websites that combine beautiful design with powerful functionality. Whether you need a corporate site, an e-commerce platform, or a web application, our team builds with modern frameworks like React, Next.js, and Node.js to ensure blazing-fast performance and seamless user experiences. We follow a user-centered design approach, rigorous QA testing, and SEO best practices to create websites that not only look great but also convert visitors into customers.",
      hero_image: SEED_IMAGES.web,
      icon: "faCode",
      deliverables: [
        "Custom UI/UX design and prototyping",
        "Responsive front-end development",
        "Backend API and database architecture",
        "CMS integration for easy content management",
        "E-commerce functionality and payment gateway setup",
        "Performance optimization and Core Web Vitals tuning",
        "Post-launch support and maintenance plan",
      ],
      benefits: [
        "Fast loading speeds that reduce bounce rates",
        "Mobile-first design that works on every device",
        "SEO-friendly architecture that helps you rank higher",
        "Scalable codebase that grows with your business",
        "Intuitive admin panel for content updates",
        "Secure and reliable hosting and deployment",
      ],
      featured: true,
      display_order: 4,
      seo: {
        meta_title: "Web Development Services | CrawlCrown",
        meta_description: "Custom web development with React, Next.js, and Node.js. Fast, responsive, and conversion-optimized websites for businesses of all sizes.",
      },
      status: "Active",
    },
    {
      service_name: "Content Marketing",
      short_description: "Attract, engage, and convert your target audience with high-quality blogs, videos, and whitepapers that establish thought leadership.",
      description:
        "Our Content Marketing service helps your brand tell its story through compelling content that educates, entertains, and converts. We create a strategic content mix including blog articles, case studies, infographics, video scripts, email newsletters, and downloadable resources. Every piece of content is crafted with your audience in mind, optimized for search engines, and aligned with your business goals to drive traffic, generate leads, and position your brand as an industry authority.",
      hero_image: SEED_IMAGES.content,
      icon: "faPenNib",
      deliverables: [
        "Content strategy and editorial calendar",
        "12 SEO-optimized blog articles per month",
        "Case study and whitepaper creation",
        "Infographic and visual content design",
        "Email newsletter copywriting",
        "Content distribution and promotion",
        "Performance tracking and content optimization",
      ],
      benefits: [
        "Establish your brand as an industry thought leader",
        "Drive consistent organic traffic through valuable content",
        "Nurture leads through the buyer journey with targeted content",
        "Improve SEO rankings with high-quality, keyword-rich content",
        "Build trust and credibility with your audience",
        "Generate reusable assets across multiple marketing channels",
      ],
      featured: false,
      display_order: 5,
      seo: {
        meta_title: "Content Marketing Services | CrawlCrown",
        meta_description: "Attract and convert with strategic content marketing. Blog articles, case studies, infographics, and email newsletters that drive results.",
      },
      status: "Active",
    },
    {
      service_name: "Branding and Identity",
      short_description: "Create a memorable brand identity that resonates with your audience and sets you apart from the competition.",
      description:
        "Our Branding and Identity service helps businesses define who they are and communicate it consistently across every touchpoint. From logo design and color palette selection to brand guidelines and messaging frameworks, we craft a cohesive brand identity that reflects your values, resonates with your target audience, and stands out in a crowded marketplace. Our process involves deep discovery, strategic thinking, and creative execution to build a brand that people remember, trust, and love.",
      hero_image: SEED_IMAGES.branding,
      icon: "faPalette",
      deliverables: [
        "Brand discovery and strategy workshop",
        "Logo design with multiple concept options",
        "Color palette and typography system",
        "Brand guidelines document",
        "Business card and stationery design",
        "Brand messaging and voice guidelines",
        "Social media brand kit",
      ],
      benefits: [
        "Professional, cohesive brand appearance across all channels",
        "Stronger emotional connection with your target audience",
        "Increased brand recognition and customer loyalty",
        "Clear differentiation from competitors",
        "Consistent messaging that builds trust over time",
        "Scalable brand system that grows with your business",
      ],
      featured: false,
      display_order: 6,
      seo: {
        meta_title: "Branding and Identity Design Services | CrawlCrown",
        meta_description: "Create a memorable brand identity with logo design, brand guidelines, and visual systems that set your business apart.",
      },
      status: "Active",
    },
    {
      service_name: "Email Marketing",
      short_description: "Reach your audience directly with targeted email campaigns that nurture leads and drive conversions.",
      description: "Our Email Marketing service helps you build and nurture relationships with your audience through targeted, automated email campaigns. From welcome sequences to abandoned cart recovery and newsletters, we design every email to engage and convert.",
      hero_image: SEED_IMAGES.email,
      icon: "faEnvelope",
      deliverables: ["Email strategy and audience segmentation", "Campaign automation workflows", "A/B tested subject lines and content", "Responsive email template design", "Analytics and performance reporting", "List cleaning and deliverability optimization"],
      benefits: ["Direct communication channel with your audience", "High ROI with measurable results", "Automated lead nurturing funnels", "Personalized content at scale", "Detailed analytics to refine strategy"],
      featured: false,
      display_order: 7,
      seo: { meta_title: "Email Marketing Services | CrawlCrown", meta_description: "Drive conversions with targeted email campaigns. Automation, segmentation, and analytics-driven email marketing." },
      status: "Active",
    },
    {
      service_name: "Analytics & Reporting",
      short_description: "Turn data into decisions with comprehensive analytics dashboards and actionable performance insights.",
      description: "Our Analytics & Reporting service provides a complete view of your digital performance. We set up custom dashboards, track KPIs across all channels, and deliver clear monthly reports that help you make smarter marketing decisions.",
      hero_image: SEED_IMAGES.analytics,
      icon: "faChartBar",
      deliverables: ["Custom analytics dashboard setup", "Multi-channel KPI tracking", "Monthly performance reports", "Conversion funnel analysis", "Cohort and retention analysis", "Data visualization and executive summaries"],
      benefits: ["Data-driven decision making", "Clear visibility into campaign ROI", "Identify growth opportunities quickly", "Align team around shared metrics", "Transparent reporting for stakeholders"],
      featured: false,
      display_order: 8,
      seo: { meta_title: "Analytics & Reporting Services | CrawlCrown", meta_description: "Make data-driven decisions with custom analytics dashboards and comprehensive performance reporting." },
      status: "Active",
    },
    {
      service_name: "Conversion Rate Optimization",
      short_description: "Maximize your existing traffic by systematically testing and improving your website conversion paths.",
      description: "Our CRO service uses data-driven experimentation to improve your website conversion rates. We conduct user research, A/B testing, and heatmap analysis to identify friction points and optimize every step of your customer journey.",
      hero_image: SEED_IMAGES.cro,
      icon: "faRocket",
      deliverables: ["Conversion funnel audit", "A/B and multivariate testing", "Heatmap and session recording analysis", "User experience research", "Landing page optimization", "CTA and form optimization"],
      benefits: ["Higher conversion rates from existing traffic", "Reduced cost per acquisition", "Improved user experience", "Data-backed design decisions", "Compound ROI from ongoing optimization"],
      featured: false,
      display_order: 9,
      seo: { meta_title: "Conversion Rate Optimization Services | CrawlCrown", meta_description: "Convert more visitors with data-driven A/B testing, heatmap analysis, and UX optimization." },
      status: "Active",
    },
    {
      service_name: "Video Marketing",
      short_description: "Captivate your audience with professional video content that tells your brand story and drives engagement.",
      description: "Our Video Marketing service produces high-quality video content for every stage of the funnel. From brand stories and product demos to social clips and explainer videos, we handle scripting, production, editing, and distribution.",
      hero_image: SEED_IMAGES.video,
      icon: "faVideo",
      deliverables: ["Video content strategy", "Scriptwriting and storyboarding", "Professional production and editing", "Motion graphics and animation", "Platform-optimized exports", "Performance analytics and optimization"],
      benefits: ["Higher engagement and shareability", "Improved brand recall and trust", "Boosted conversion rates", "Stronger social media performance", "Versatile content for multiple platforms"],
      featured: false,
      display_order: 10,
      seo: { meta_title: "Video Marketing Services | CrawlCrown", meta_description: "Engage your audience with professional video content. Brand stories, product demos, and social video production." },
      status: "Active",
    },
    {
      service_name: "Influencer Marketing",
      short_description: "Amplify your brand reach by partnering with trusted influencers who connect with your target audience.",
      description: "Our Influencer Marketing service connects your brand with relevant influencers across Instagram, TikTok, YouTube, and LinkedIn. We handle vetting, outreach, campaign management, and performance tracking to ensure authentic partnerships that deliver real results.",
      hero_image: SEED_IMAGES.influencer,
      icon: "faUsers",
      deliverables: ["Influencer identification and vetting", "Outreach and negotiation management", "Campaign creative briefs", "Content approval and brand alignment", "Performance tracking and ROI reporting", "Long-term partnership development"],
      benefits: ["Access to engaged, niche audiences", "Authentic brand advocacy", "Increased social proof and trust", "Scalable campaign models", "Diverse content creation"],
      featured: false,
      display_order: 11,
      seo: { meta_title: "Influencer Marketing Services | CrawlCrown", meta_description: "Partner with trusted influencers to amplify your brand reach across Instagram, TikTok, YouTube, and LinkedIn." },
      status: "Active",
    },
    {
      service_name: "Affiliate Marketing",
      short_description: "Build a scalable revenue channel through strategic affiliate partnerships and performance-based programs.",
      description: "Our Affiliate Marketing service sets up and manages performance-based programs that reward partners for driving sales. We recruit relevant affiliates, provide them with creative assets, track performance, and optimize campaigns for maximum ROI.",
      hero_image: SEED_IMAGES.affiliate,
      icon: "faHandshake",
      deliverables: ["Affiliate program strategy and setup", "Recruitment of relevant affiliates", "Creative assets and tracking links", "Commission structure optimization", "Performance monitoring and fraud detection", "Monthly reconciliation and reporting"],
      benefits: ["Pay only for performance", "Scalable revenue growth", "Expanded brand reach through partners", "Diversified marketing channels", "Low-risk, high-reward model"],
      featured: false,
      display_order: 12,
      seo: { meta_title: "Affiliate Marketing Services | CrawlCrown", meta_description: "Build a scalable affiliate program that pays for performance. Recruit, manage, and optimize your affiliate partnerships." },
      status: "Active",
    },
    {
      service_name: "Mobile Marketing",
      short_description: "Engage your audience on the devices they use most with SMS, push notifications, and mobile-optimized campaigns.",
      description: "Our Mobile Marketing service reaches customers on their smartphones through SMS campaigns, push notifications, in-app messaging, and mobile-optimized landing pages. We help you connect with your audience anytime, anywhere.",
      hero_image: SEED_IMAGES.mobile,
      icon: "faMobileAlt",
      deliverables: ["Mobile marketing strategy", "SMS and MMS campaign management", "Push notification setup and automation", "Mobile landing page optimization", "App store optimization", "Mobile analytics and attribution"],
      benefits: ["Direct, high-open-rate communication", "Immediate customer engagement", "Location-based targeting", "Complementary to other channels", "High conversion rates on mobile"],
      featured: false,
      display_order: 13,
      seo: { meta_title: "Mobile Marketing Services | CrawlCrown", meta_description: "Engage customers on their phones with SMS, push notifications, and mobile-optimized campaigns." },
      status: "Active",
    },
    {
      service_name: "Public Relations",
      short_description: "Earn meaningful media coverage and build your brand credibility through strategic PR campaigns.",
      description: "Our Public Relations service helps you earn valuable media coverage across digital and traditional outlets. We craft compelling narratives, build relationships with journalists, and manage press outreach to position your brand as an industry leader.",
      hero_image: SEED_IMAGES.pr,
      icon: "faNewspaper",
      deliverables: ["PR strategy and messaging framework", "Media list building and journalist outreach", "Press release writing and distribution", "Thought leadership content", "Media monitoring and reporting", "Crisis communication planning"],
      benefits: ["Earned media credibility", "Increased brand awareness", "Stronger stakeholder trust", "Competitive differentiation", "Long-lasting SEO value from coverage"],
      featured: false,
      display_order: 14,
      seo: { meta_title: "Public Relations Services | CrawlCrown", meta_description: "Build brand credibility through strategic PR campaigns. Media outreach, press releases, and thought leadership." },
      status: "Active",
    },
    {
      service_name: "Online Reputation Management",
      short_description: "Protect and enhance your brand reputation by monitoring, managing, and improving your online presence.",
      description: "Our ORM service monitors your brand mentions across the web and helps you maintain a positive online reputation. We manage review platforms, address negative feedback, and promote positive content to ensure your brand is seen in the best light.",
      hero_image: SEED_IMAGES.orm,
      icon: "faStar",
      deliverables: ["Brand mention monitoring setup", "Review platform management", "Negative feedback response strategy", "Positive content promotion", "Reputation audit and gap analysis", "Monthly reputation scorecard"],
      benefits: ["Protect your brand image", "Build customer trust and confidence", "Improve search result perception", "Proactive issue resolution", "Data-backed reputation insights"],
      featured: false,
      display_order: 15,
      seo: { meta_title: "Online Reputation Management Services | CrawlCrown", meta_description: "Protect and enhance your brand reputation with monitoring, review management, and positive content promotion." },
      status: "Active",
    },
    {
      service_name: "Voice Search SEO",
      short_description: "Optimize your content for voice search to capture growing traffic from smart speakers and virtual assistants.",
      description: "Our Voice Search SEO service prepares your brand for the growing voice-activated search market. We optimize for conversational queries, featured snippets, and local search to ensure your business is found when users ask Siri, Alexa, or Google Assistant.",
      hero_image: SEED_IMAGES.voice,
      icon: "faMicrophone",
      deliverables: ["Voice search keyword research", "Conversational content optimization", "Featured snippet targeting", "Local SEO for voice queries", "Schema markup implementation", "Voice search performance tracking"],
      benefits: ["Early mover advantage in voice search", "Capture growing hands-free traffic", "Improved featured snippet rankings", "Enhanced local search visibility", "Future-proof your SEO strategy"],
      featured: false,
      display_order: 16,
      seo: { meta_title: "Voice Search SEO Services | CrawlCrown", meta_description: "Optimize for voice search and capture traffic from smart speakers and virtual assistants like Siri and Alexa." },
      status: "Active",
    },
    {
      service_name: "E-commerce Marketing",
      short_description: "Drive sales and grow your online store with a full-funnel marketing strategy tailored for e-commerce.",
      description: "Our E-commerce Marketing service is purpose-built for online stores. We integrate PPC, SEO, email, and social campaigns with your product catalog to drive traffic, increase average order value, and maximize customer lifetime value across all channels.",
      hero_image: SEED_IMAGES.ecom,
      icon: "faStore",
      deliverables: ["Full-funnel e-commerce strategy", "Product feed optimization for shopping ads", "Cart abandonment email automation", "Upsell and cross-sell campaign design", "Customer loyalty program setup", "Revenue attribution and reporting"],
      benefits: ["Increased average order value", "Reduced cart abandonment rates", "Higher customer lifetime value", "Multi-channel revenue attribution", "Scalable growth for peak seasons"],
      featured: false,
      display_order: 17,
      seo: { meta_title: "E-commerce Marketing Services | CrawlCrown", meta_description: "Drive online sales with full-funnel e-commerce marketing. PPC, email, social, and SEO optimized for your store." },
      status: "Active",
    },
    {
      service_name: "Growth Hacking",
      short_description: "Accelerate your business growth with rapid experimentation and data-driven marketing tactics.",
      description: "Our Growth Hacking service uses rapid experimentation across all channels to identify the most effective ways to grow your business. We combine creative marketing tactics with rigorous data analysis to find scalable, repeatable growth engines.",
      hero_image: SEED_IMAGES.growth,
      icon: "faChartLine",
      deliverables: ["Growth funnel audit and analysis", "Rapid experimentation roadmap", "Viral loop and referral program design", "Channel mix optimization", "Retention and re-engagement strategies", "Growth metric tracking and reporting"],
      benefits: ["Rapid, cost-effective growth", "Data-validated marketing channels", "Scalable acquisition strategies", "Improved retention and virality", "Culture of experimentation"],
      featured: false,
      display_order: 18,
      seo: { meta_title: "Growth Hacking Services | CrawlCrown", meta_description: "Accelerate growth with rapid experimentation and data-driven tactics across every marketing channel." },
      status: "Active",
    },
  ],

  technologies: [
    { name: "React", description: "A JavaScript library for building user interfaces with a component-based architecture.", icon: "faCode", display_order: 1 },
    { name: "Node.js", description: "A JavaScript runtime built on Chrome's V8 engine for scalable server-side applications.", icon: "faServer", display_order: 2 },
    { name: "Python", description: "A versatile programming language used for web development, data analysis, and machine learning.", icon: "faLaptopCode", display_order: 3 },
    { name: "AWS", description: "Amazon Web Services cloud platform for scalable hosting, storage, and infrastructure.", icon: "faCloud", display_order: 4 },
    { name: "MongoDB", description: "A NoSQL document database for flexible, high-performance data storage.", icon: "faDatabase", display_order: 5 },
    { name: "TypeScript", description: "A typed superset of JavaScript that improves code quality and developer productivity.", icon: "faFileAlt", display_order: 6 },
    { name: "Next.js", description: "A React framework for production-grade server-rendered and static web applications.", icon: "faGlobe", display_order: 7 },
    { name: "Tailwind CSS", description: "A utility-first CSS framework for rapidly building custom user interfaces.", icon: "faPaintBrush", display_order: 8 },
    { name: "Docker", description: "A containerization platform for building, shipping, and running applications consistently.", icon: "faCube", display_order: 9 },
    { name: "GraphQL", description: "A query language for APIs that enables efficient, flexible data fetching.", icon: "faProjectDiagram", display_order: 10 },
    { name: "Redis", description: "An in-memory data store for high-performance caching and real-time data processing.", icon: "faBolt", display_order: 11 },
    { name: "Kubernetes", description: "An orchestration platform for automating deployment, scaling, and management of containers.", icon: "faCogs", display_order: 12 },
    { name: "PostgreSQL", description: "A powerful, open-source relational database with advanced query capabilities.", icon: "faDatabase", display_order: 13 },
    { name: "Git", description: "A distributed version control system for tracking changes in source code.", icon: "faCodeBranch", display_order: 14 },
    { name: "Linux", description: "An open-source operating system powering most servers and cloud infrastructure.", icon: "faTerminal", display_order: 15 },
    { name: "Nginx", description: "A high-performance web server and reverse proxy for serving web applications.", icon: "faServer", display_order: 16 },
    { name: "RabbitMQ", description: "A message broker that enables reliable asynchronous communication between services.", icon: "faEnvelope", display_order: 17 },
    { name: "Elasticsearch", description: "A distributed search and analytics engine for fast data exploration.", icon: "faSearch", display_order: 18 },
    { name: "Jenkins", description: "An automation server for building, testing, and deploying code continuously.", icon: "faTools", display_order: 19 },
    { name: "Terraform", description: "An infrastructure-as-code tool for provisioning and managing cloud resources.", icon: "faCloud", display_order: 20 },
    { name: "Vue.js", description: "A progressive JavaScript framework for building interactive user interfaces.", icon: "faCode", display_order: 21 },
    { name: "Go", description: "A statically typed compiled language designed for high-performance applications.", icon: "faTerminal", display_order: 22 },
    { name: "Rust", description: "A systems programming language focused on safety, speed, and concurrency.", icon: "faShieldAlt", display_order: 23 },
    { name: "Firebase", description: "A Google platform for building web and mobile apps with backend services.", icon: "faFire", display_order: 24 },
  ],

  industries: [
    { name: "Healthcare", description: "Digital solutions for hospitals, clinics, telemedicine, and health tech startups.", icon: "faHeartPulse", display_order: 1 },
    { name: "Finance and Banking", description: "Fintech platforms, banking apps, and financial service digital experiences.", icon: "faMoneyBillTrendUp", display_order: 2 },
    { name: "E-Commerce", description: "Online stores, marketplaces, and D2C brands with high-converting shopping experiences.", icon: "faCartShopping", display_order: 3 },
    { name: "Education", description: "EdTech platforms, LMS systems, and educational institution websites.", icon: "faGraduationCap", display_order: 4 },
    { name: "Real Estate", description: "Property listing platforms, virtual tours, and real estate marketing solutions.", icon: "faBuilding", display_order: 5 },
    { name: "Technology", description: "SaaS products, tech startups, and enterprise software platforms.", icon: "faMicrochip", display_order: 6 },
    { name: "Travel & Hospitality", description: "Travel booking platforms, hotel chains, and tourism experiences.", icon: "faPlane", display_order: 7 },
    { name: "Legal", description: "Law firms, legal tech platforms, and compliance solutions.", icon: "faGavel", display_order: 8 },
    { name: "Non-profit", description: "Charities, foundations, and social impact organizations.", icon: "faHandHoldingHeart", display_order: 9 },
    { name: "Manufacturing", description: "Industrial automation, supply chain, and production management.", icon: "faIndustry", display_order: 10 },
    { name: "Media & Entertainment", description: "Streaming platforms, publishing, and digital content studios.", icon: "faFilm", display_order: 11 },
    { name: "Telecommunications", description: "Network providers, communication platforms, and connectivity solutions.", icon: "faBroadcastTower", display_order: 12 },
    { name: "Energy", description: "Renewable energy, utilities, and smart grid technologies.", icon: "faBolt", display_order: 13 },
    { name: "Agriculture", description: "AgTech, farm management, and sustainable food production.", icon: "faTractor", display_order: 14 },
    { name: "Transportation & Logistics", description: "Fleet management, shipping, and supply chain optimization.", icon: "faTruck", display_order: 15 },
    { name: "Government", description: "Public sector digital services and civic technology solutions.", icon: "faLandmark", display_order: 16 },
    { name: "Sports", description: "Sports teams, fitness platforms, and athletic performance technology.", icon: "faFutbol", display_order: 17 },
    { name: "Food & Beverage", description: "Restaurant chains, food delivery, and beverage brands.", icon: "faUtensils", display_order: 18 },
  ],

  team: [
    {
      name: "Sarah Johnson",
      designation: "Chief Executive Officer",
      description: "With over 15 years of experience in digital marketing and business strategy, Sarah leads our vision of helping businesses thrive in the digital landscape.",
      photo: img("team-sarah"),
      linkedin: "https://linkedin.com/in/sarahjohnson",
      email: "sarah@digitalagency.com",
      display_order: 1,
    },
    {
      name: "Michael Chen",
      designation: "Chief Technology Officer",
      description: "A full-stack architect with deep expertise in cloud infrastructure and modern web technologies. Michael ensures our solutions are scalable, secure, and performant.",
      photo: img("team-michael"),
      linkedin: "https://linkedin.com/in/michaelchen",
      email: "michael@digitalagency.com",
      display_order: 2,
    },
    {
      name: "Emily Rodriguez",
      designation: "Creative Director",
      description: "Emily brings brands to life through compelling visual storytelling. Her award-winning designs have helped dozens of companies establish memorable brand identities.",
      photo: img("team-emily"),
      linkedin: "https://linkedin.com/in/emilyrodriguez",
      email: "emily@digitalagency.com",
      display_order: 3,
    },
    {
      name: "David Kim",
      designation: "Lead Developer",
      description: "David is a senior engineer specializing in React and Node.js. He leads our development team in building performant, accessible web applications.",
      photo: img("team-david"),
      linkedin: "https://linkedin.com/in/davidkim",
      email: "david@digitalagency.com",
      display_order: 4,
    },
    {
      name: "Rachel Patel",
      designation: "SEO Manager",
      description: "Rachel is a certified SEO specialist who combines data analysis with creative strategy to deliver consistent organic growth for our clients.",
      photo: img("team-rachel"),
      linkedin: "https://linkedin.com/in/rachelpatel",
      email: "rachel@digitalagency.com",
      display_order: 5,
    },
    {
      name: "James Wilson",
      designation: "Marketing Director",
      description: "James oversees all marketing campaigns across channels. His data-driven approach has generated millions in revenue for our clients.",
      photo: img("team-james"),
      linkedin: "https://linkedin.com/in/jameswilson",
      email: "james@digitalagency.com",
      display_order: 6,
    },
    {
      name: "Sofia Andersson",
      designation: "UI/UX Designer",
      description: "Sofia crafts intuitive, beautiful interfaces rooted in user research. She is passionate about creating digital experiences that feel effortless.",
      photo: img("team-sofia"),
      linkedin: "https://linkedin.com/in/sofiaandersson",
      email: "sofia@digitalagency.com",
      display_order: 7,
    },
    {
      name: "Alex Thompson",
      designation: "Project Manager",
      description: "Alex ensures every project is delivered on time, within budget, and to the highest standard. He keeps the entire team aligned and moving forward.",
      photo: img("team-alex"),
      linkedin: "https://linkedin.com/in/alexthompson",
      email: "alex@digitalagency.com",
      display_order: 8,
    },
    {
      name: "Marcus Williams",
      designation: "Lead UX Researcher",
      description: "Marcus uncovers deep user insights through qualitative and quantitative research that shapes every design decision.",
      photo: img("team-marcus"),
      linkedin: "https://linkedin.com/in/marcuswilliams",
      email: "marcus@digitalagency.com",
      display_order: 9,
    },
    {
      name: "Nina Patel",
      designation: "Digital Marketing Strategist",
      description: "Nina architects multi-channel marketing strategies that align with business goals and deliver measurable growth.",
      photo: img("team-nina"),
      linkedin: "https://linkedin.com/in/ninapatel",
      email: "nina@digitalagency.com",
      display_order: 10,
    },
    {
      name: "Oliver Grant",
      designation: "Senior Backend Developer",
      description: "Oliver builds scalable, secure APIs and microservices that power complex web applications.",
      photo: img("team-oliver"),
      linkedin: "https://linkedin.com/in/olivergrant",
      email: "oliver@digitalagency.com",
      display_order: 11,
    },
    {
      name: "Priya Kapoor",
      designation: "Social Media Manager",
      description: "Priya creates engaging social content and manages communities across Instagram, TikTok, and LinkedIn.",
      photo: img("team-priya"),
      linkedin: "https://linkedin.com/in/priyakapoor",
      email: "priya@digitalagency.com",
      display_order: 12,
    },
    {
      name: "Quentin Blake",
      designation: "Copywriter",
      description: "Quentin crafts compelling copy that captures brand voice and drives action across every channel.",
      photo: img("team-quentin"),
      linkedin: "https://linkedin.com/in/quentinblake",
      email: "quentin@digitalagency.com",
      display_order: 13,
    },
    {
      name: "Rachel Chen",
      designation: "Data Analyst",
      description: "Rachel turns complex datasets into clear insights that guide strategy and prove campaign ROI.",
      photo: img("team-rachelchen"),
      linkedin: "https://linkedin.com/in/rachelchen",
      email: "rachelchen@digitalagency.com",
      display_order: 14,
    },
    {
      name: "Samuel Torres",
      designation: "DevOps Engineer",
      description: "Samuel automates infrastructure and deployment pipelines to keep applications reliable and scalable.",
      photo: img("team-samuel"),
      linkedin: "https://linkedin.com/in/samueltorres",
      email: "samuel@digitalagency.com",
      display_order: 15,
    },
    {
      name: "Tina Huang",
      designation: "Brand Designer",
      description: "Tina creates visual identities that tell compelling stories and leave lasting impressions.",
      photo: img("team-tina"),
      linkedin: "https://linkedin.com/in/tinahuang",
      email: "tina@digitalagency.com",
      display_order: 16,
    },
    {
      name: "Uma Krishnan",
      designation: "SEO Specialist",
      description: "Uma combines technical SEO expertise with creative content strategies to drive organic growth.",
      photo: img("team-uma"),
      linkedin: "https://linkedin.com/in/umakrishnan",
      email: "uma@digitalagency.com",
      display_order: 17,
    },
    {
      name: "Victor Adeyemi",
      designation: "Full Stack Developer",
      description: "Victor builds end-to-end features with equal comfort across frontend and backend systems.",
      photo: img("team-victor"),
      linkedin: "https://linkedin.com/in/victoradeyemi",
      email: "victor@digitalagency.com",
      display_order: 18,
    },
    {
      name: "Wendy Chang",
      designation: "PPC Campaign Manager",
      description: "Wendy manages high-performing ad campaigns with meticulous bid strategies and relentless optimization.",
      photo: img("team-wendy"),
      linkedin: "https://linkedin.com/in/wendychang",
      email: "wendy@digitalagency.com",
      display_order: 19,
    },
    {
      name: "Xavier Dupont",
      designation: "Creative Lead",
      description: "Xavier leads creative direction across projects, ensuring every output meets the highest design standards.",
      photo: img("team-xavier"),
      linkedin: "https://linkedin.com/in/xavierdupont",
      email: "xavier@digitalagency.com",
      display_order: 20,
    },
    {
      name: "Yuki Tanaka",
      designation: "Frontend Developer",
      description: "Yuki builds pixel-perfect, accessible interfaces with modern frontend frameworks and tools.",
      photo: img("team-yuki"),
      linkedin: "https://linkedin.com/in/yukitanaka",
      email: "yuki@digitalagency.com",
      display_order: 21,
    },
    {
      name: "Zoe Williams",
      designation: "Content Strategist",
      description: "Zoe develops content strategies that attract, engage, and convert target audiences through every stage of the funnel.",
      photo: img("team-zoe"),
      linkedin: "https://linkedin.com/in/zoewilliams",
      email: "zoe@digitalagency.com",
      display_order: 22,
    },
    {
      name: "Aaron Mitchell",
      designation: "Marketing Analyst",
      description: "Aaron tracks campaign performance, identifies trends, and delivers actionable recommendations for improvement.",
      photo: img("team-aaron"),
      linkedin: "https://linkedin.com/in/aaronmitchell",
      email: "aaron@digitalagency.com",
      display_order: 23,
    },
    {
      name: "Bella Santos",
      designation: "UI Designer",
      description: "Bella designs intuitive, beautiful interfaces that balance aesthetics with usability.",
      photo: img("team-bella"),
      linkedin: "https://linkedin.com/in/bellasantos",
      email: "bella@digitalagency.com",
      display_order: 24,
    },
  ],

  reviews: [
    {
      name: "Robert Mitchell",
      location: "New York, NY",
      rating: 5,
      user_avatar: img("review-robert"),
      review_text: "Working with this agency completely transformed our online presence. Our organic traffic increased by 340% within six months, and the leads we receive are now highly qualified. The team is responsive, creative, and truly understands our business goals.",
      status: "Approved",
    },
    {
      name: "Jennifer Lee",
      location: "San Francisco, CA",
      rating: 5,
      user_avatar: img("review-jennifer"),
      review_text: "The PPC campaigns they set up for us delivered a 5x return on ad spend in the first quarter alone. Their attention to detail in audience targeting and ad copywriting is exceptional. We have finally found a marketing partner that truly cares about results.",
      status: "Approved",
    },
    {
      name: "David Park",
      location: "Chicago, IL",
      rating: 4,
      user_avatar: img("review-david"),
      review_text: "They redesigned our website and the results speak for themselves. Bounce rate dropped by 45%, page load time went from 6 seconds to under 2, and our conversion rate doubled. The process was smooth and the team kept us informed at every step.",
      status: "Approved",
    },
    {
      name: "Maria Gonzalez",
      location: "Austin, TX",
      rating: 5,
      user_avatar: img("review-maria"),
      review_text: "Their social media marketing has been a game-changer for our brand. We went from 2,000 to over 25,000 followers in eight months, and the engagement rates are consistently above industry averages. They understand how to build an authentic community.",
      status: "Approved",
    },
    {
      name: "Thomas Wright",
      location: "Seattle, WA",
      rating: 4,
      user_avatar: img("review-thomas"),
      review_text: "The branding project they delivered exceeded our expectations. Our new logo, color palette, and brand guidelines have given us a professional, cohesive look that our customers and partners constantly compliment. Highly recommended for any rebranding effort.",
      status: "Approved",
    },
    {
      name: "Amanda Foster",
      location: "Denver, CO",
      rating: 5,
      user_avatar: img("review-amanda"),
      review_text: "We hired them for content marketing and the quality of the articles and case studies they produce is outstanding. Our blog traffic increased by 280% and we have seen a noticeable uptick in inbound leads. They are an extension of our marketing team.",
      status: "Approved",
    },
    {
      name: "Sarah Mitchell",
      location: "Miami, FL",
      rating: 5,
      user_avatar: img("review-sarah"),
      review_text: "Their email marketing campaigns have completely transformed our customer retention. Our open rates increased by 45% and we are seeing consistent revenue from our automated flows.",
      status: "Approved",
    },
    {
      name: "Chris Anderson",
      location: "Atlanta, GA",
      rating: 4,
      user_avatar: img("review-chris"),
      review_text: "The analytics dashboard they built gives us real-time visibility into our marketing performance. We can now make decisions based on data rather than gut feelings.",
      status: "Approved",
    },
    {
      name: "Michelle Kim",
      location: "Los Angeles, CA",
      rating: 5,
      user_avatar: img("review-michelle"),
      review_text: "Our conversion rate improved by 65% after implementing their CRO recommendations. The A/B testing framework they set up continues to deliver improvements every month.",
      status: "Approved",
    },
    {
      name: "Ryan Taylor",
      location: "Dallas, TX",
      rating: 4,
      user_avatar: img("review-ryan"),
      review_text: "The video content they produced for our product launch was exceptional. The explainer video alone generated over 50,000 views and directly contributed to our strongest quarter ever.",
      status: "Approved",
    },
    {
      name: "Olivia Brooks",
      location: "Portland, OR",
      rating: 5,
      user_avatar: img("review-olivia"),
      review_text: "Working with their PR team earned us coverage in five major industry publications. Our brand credibility has never been higher and we are being approached by partners we could only dream of before.",
      status: "Approved",
    },
    {
      name: "Nathan Cooper",
      location: "Phoenix, AZ",
      rating: 5,
      user_avatar: img("review-nathan"),
      review_text: "Their e-commerce marketing strategy doubled our Black Friday revenue year over year. The multi-channel approach they implemented created a seamless customer experience from discovery to purchase.",
      status: "Approved",
    },
    {
      name: "Hannah Lee",
      location: "Nashville, TN",
      rating: 4,
      user_avatar: img("review-hannah"),
      review_text: "The influencer marketing campaign they managed for us was incredibly authentic and effective. We saw a 300% increase in social engagement and a significant bump in website traffic.",
      status: "Approved",
    },
    {
      name: "Ethan Garcia",
      location: "Minneapolis, MN",
      rating: 5,
      user_avatar: img("review-ethan"),
      review_text: "Their team helped us completely turn around our online reputation. Negative reviews were addressed professionally, and our average rating went from 3.2 to 4.6 stars.",
      status: "Approved",
    },
    {
      name: "Lily Thompson",
      location: "Charlotte, NC",
      rating: 4,
      user_avatar: img("review-lily"),
      review_text: "The affiliate program they built for us now accounts for 20% of our monthly revenue. Their partner recruitment and management have been top-notch from day one.",
      status: "Approved",
    },
    {
      name: "Jack Robinson",
      location: "Detroit, MI",
      rating: 5,
      user_avatar: img("review-jack"),
      review_text: "Their growth hacking approach helped us find our most effective customer acquisition channel. We reduced our CPA by 40% while scaling our monthly leads by 3x.",
      status: "Approved",
    },
    {
      name: "Emily Foster",
      location: "Philadelphia, PA",
      rating: 5,
      user_avatar: img("review-emily"),
      review_text: "The mobile marketing campaigns they designed have been incredibly effective. Our SMS campaigns see open rates above 90% and our app push notifications drive consistent daily engagement.",
      status: "Approved",
    },
    {
      name: "Daniel Wright",
      location: "San Diego, CA",
      rating: 4,
      user_avatar: img("review-daniel"),
      review_text: "Their voice search SEO work has put us in the featured snippet for over 50 key queries. We are capturing traffic we were missing entirely before.",
      status: "Approved",
    },
  ],

  contacts: [
    {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1-555-0101",
      service: "Search Engine Optimization",
      message: "Hi, I am interested in your SEO services for our e-commerce store. We currently rank on page 3 for our main keywords and would love to improve our organic visibility. Could we schedule a call to discuss?",
      status: "New",
    },
    {
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+1-555-0102",
      service: "Web Development",
      message: "We are looking to redesign our corporate website. It needs to be mobile-friendly, fast, and easy to update. We would appreciate a quote for a custom React-based solution.",
      status: "New",
    },
    {
      name: "Carlos Mendez",
      email: "carlos.mendez@example.com",
      phone: "+1-555-0103",
      service: "Social Media Marketing",
      message: "Our social media presence has been inconsistent. We need help building a content strategy and managing our Instagram and LinkedIn accounts. Do you offer monthly retainer packages?",
      status: "Pending",
    },
    {
      name: "Emma Wilson",
      email: "emma.wilson@example.com",
      phone: "+1-555-0104",
      service: "Pay-Per-Click Advertising",
      message: "We are launching a new product next quarter and want to run a comprehensive PPC campaign across Google and LinkedIn. Could you share your typical campaign setup process and pricing?",
      status: "New",
    },
    {
      name: "Daniel Lee",
      email: "daniel.lee@example.com",
      phone: "+1-555-0105",
      service: "Branding and Identity",
      message: "Our startup is going through a rebrand and we need help with logo design, brand guidelines, and a new website. Do you offer a combined branding plus web development package?",
      status: "New",
    },
    {
      name: "Sophia Martinez",
      email: "sophia.martinez@example.com",
      phone: "+1-555-0106",
      service: "Content Marketing",
      message: "We are a B2B SaaS company looking for a content marketing partner. We need blog posts, case studies, and whitepapers on a monthly retainer. Can you share examples of similar work?",
      status: "Pending",
    },
    {
      name: "Liam O'Brien",
      email: "liam.obrien@example.com",
      phone: "+1-555-0107",
      service: "Video Marketing",
      message: "We need a product explainer video and ongoing social video content for our brand. Do you handle both scriptwriting and production in-house?",
      status: "New",
    },
    {
      name: "Isabella Kim",
      email: "isabella.kim@example.com",
      phone: "+1-555-0108",
      service: "Conversion Rate Optimization",
      message: "Our e-commerce conversion rate has been stagnant for months. We would like a full CRO audit and ongoing optimization support. What tools and methodologies do you use?",
      status: "Replied",
    },
    {
      name: "James Chen",
      email: "james.chen@example.com",
      phone: "+1-555-0109",
      service: "Analytics & Reporting",
      message: "We need help setting up a comprehensive analytics dashboard that consolidates data from Google Ads, Meta, Shopify, and our CRM. Is this something you can handle?",
      status: "New",
    },
  ],
};

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected successfully.\n");

    // Check if data already exists
    const existingCount = await Services.countDocuments();
    if (existingCount > 0) {
      console.log("Database already seeded. Skipping.");
      console.log("To re-seed, drop the database first or use --force flag.");
      const force = process.argv.includes("--force");
      if (!force) {
        await mongoose.disconnect();
        process.exit(0);
      }
      console.log("--force flag detected. Clearing existing data...\n");
      await CaseStudy.deleteMany();
      await FAQ.deleteMany();
      await Projects.deleteMany();
      await Contact.deleteMany();
      await Review.deleteMany();
      await Team.deleteMany();
      await Industry.deleteMany();
      await Technology.deleteMany();
      await Services.deleteMany();
      console.log("Existing data cleared.\n");
    }

    // Tier 1 — Standalone models
    console.log("Seeding Services...");
    const services = await Services.create(seedData.services);
    console.log(`  Created ${services.length} services.\n`);

    console.log("Seeding Technologies...");
    const technologies = await Technology.create(seedData.technologies);
    console.log(`  Created ${technologies.length} technologies.\n`);

    console.log("Seeding Industries...");
    const industries = await Industry.create(seedData.industries);
    console.log(`  Created ${industries.length} industries.\n`);

    console.log("Seeding Team Members...");
    const team = await Team.create(seedData.team);
    console.log(`  Created ${team.length} team members.\n`);

    console.log("Seeding Reviews...");
    const reviews = await Review.create(seedData.reviews);
    console.log(`  Created ${reviews.length} reviews.\n`);

    console.log("Seeding Contacts...");
    const contacts = await Contact.create(seedData.contacts);
    console.log(`  Created ${contacts.length} contacts.\n`);

    // Tier 2 — Projects (refs: services, technologies, industries, team)
    const seoService = services.find((s) => s.service_name === "Search Engine Optimization");
    const ppcService = services.find((s) => s.service_name === "Pay-Per-Click Advertising");
    const socialService = services.find((s) => s.service_name === "Social Media Marketing");
    const webService = services.find((s) => s.service_name === "Web Development");
    const contentService = services.find((s) => s.service_name === "Content Marketing");
    const brandingService = services.find((s) => s.service_name === "Branding and Identity");

    const reactTech = technologies.find((t) => t.name === "React");
    const nodeTech = technologies.find((t) => t.name === "Node.js");
    const pythonTech = technologies.find((t) => t.name === "Python");
    const awsTech = technologies.find((t) => t.name === "AWS");
    const mongoTech = technologies.find((t) => t.name === "MongoDB");
    const tsTech = technologies.find((t) => t.name === "TypeScript");
    const nextTech = technologies.find((t) => t.name === "Next.js");
    const tailTech = technologies.find((t) => t.name === "Tailwind CSS");

    const healthIndustry = industries.find((i) => i.name === "Healthcare");
    const financeIndustry = industries.find((i) => i.name === "Finance and Banking");
    const ecommerceIndustry = industries.find((i) => i.name === "E-Commerce");
    const techIndustry = industries.find((i) => i.name === "Technology");

    const sarah = team.find((t) => t.name === "Sarah Johnson");
    const michael = team.find((t) => t.name === "Michael Chen");
    const emily = team.find((t) => t.name === "Emily Rodriguez");
    const david = team.find((t) => t.name === "David Kim");
    const rachel = team.find((t) => t.name === "Rachel Patel");
    const james = team.find((t) => t.name === "James Wilson");
    const sofia = team.find((t) => t.name === "Sofia Andersson");
    const alex = team.find((t) => t.name === "Alex Thompson");
    const xavier = team.find((t) => t.name === "Xavier Dupont");
    const oliver = team.find((t) => t.name === "Oliver Grant");
    const bella = team.find((t) => t.name === "Bella Santos");

    const emailService = services.find((s) => s.service_name === "Email Marketing");
    const analyticsService = services.find((s) => s.service_name === "Analytics & Reporting");
    const ecomMarketing = services.find((s) => s.service_name === "E-commerce Marketing");
    const prService = services.find((s) => s.service_name === "Public Relations");

    const dockerTech = technologies.find((t) => t.name === "Docker");
    const redisTech = technologies.find((t) => t.name === "Redis");
    const postgresTech = technologies.find((t) => t.name === "PostgreSQL");
    const firebaseTech = technologies.find((t) => t.name === "Firebase");
    const graphqlTech = technologies.find((t) => t.name === "GraphQL");

    const educationIndustry = industries.find((i) => i.name === "Education");
    const travelIndustry = industries.find((i) => i.name === "Travel & Hospitality");
    const agricultureIndustry = industries.find((i) => i.name === "Agriculture");
    const foodBeverageIndustry = industries.find((i) => i.name === "Food & Beverage");

    console.log("Seeding Projects...");
    const projectData = [
      {
        project_name: "MediCare Health Portal",
        short_description: "A comprehensive telemedicine platform connecting patients with healthcare providers through video consultations and secure messaging.",
        description:
          "MediCare Health Portal is a full-featured telemedicine platform built to bridge the gap between patients and healthcare providers. The platform supports real-time video consultations, secure patient messaging, electronic health record integration, appointment scheduling, and prescription management. Built with security and compliance in mind, the system adheres to HIPAA regulations and uses end-to-end encryption for all patient data. The intuitive interface makes it easy for patients of all ages to connect with their doctors from the comfort of their homes.",
        thumbnail: SEED_IMAGES.projectMedicare,
        gallery: [
          SEED_IMAGES.projectMedicare,
          img("crawlcrown-medicare-g2"),
          img("crawlcrown-medicare-g3"),
        ],
        services: [webService._id, seoService._id],
        technologies: [reactTech._id, nodeTech._id, mongoTech._id, awsTech._id],
        industries: [healthIndustry._id],
        team: [david._id, sofia._id, alex._id],
        client: {
          name: "Dr. Amanda Lewis",
          company: "MediCare Health Systems",
          website: "https://medicare-health.example.com",
          location: "Boston, MA",
        },
        project_url: "https://medicare-health.example.com",
        completion_date: new Date("2025-11-15"),
        featured: true,
        seo: {
          meta_title: "MediCare Health Portal — Telemedicine Platform Case Study",
          meta_description: "How we built a HIPAA-compliant telemedicine platform with video consultations, secure messaging, and EHR integration.",
        },
        status: "Published",
      },
      {
        project_name: "FinTrack Analytics Dashboard",
        short_description: "A real-time financial analytics dashboard for a fintech startup, featuring live market data, portfolio tracking, and AI-driven insights.",
        description:
          "FinTrack is a sophisticated financial analytics dashboard designed for a fast-growing fintech startup. The platform aggregates real-time market data from multiple sources, provides interactive portfolio tracking with customizable watchlists, and delivers AI-powered investment insights based on historical trends and market sentiment. The application handles over 10,000 concurrent users with sub-second response times, achieved through a combination of WebSocket connections for live data streaming and intelligent caching strategies. The clean, data-rich interface enables traders and investors to make informed decisions quickly.",
        thumbnail: SEED_IMAGES.projectFintrack,
        gallery: [
          SEED_IMAGES.projectFintrack,
          img("crawlcrown-fintrack-g2"),
          img("crawlcrown-fintrack-g3"),
        ],
        services: [webService._id, ppcService._id],
        technologies: [reactTech._id, nodeTech._id, tsTech._id, awsTech._id],
        industries: [financeIndustry._id],
        team: [michael._id, david._id, rachel._id],
        client: {
          name: "Marcus Webb",
          company: "FinTrack Technologies",
          website: "https://fintrack.example.com",
          location: "San Francisco, CA",
        },
        project_url: "https://fintrack.example.com",
        completion_date: new Date("2025-09-20"),
        featured: true,
        seo: {
          meta_title: "FinTrack Analytics Dashboard — Fintech Platform Case Study",
          meta_description: "How we built a real-time financial analytics dashboard with AI-driven insights and live market data for 10,000+ concurrent users.",
        },
        status: "Published",
      },
      {
        project_name: "UrbanNest E-Commerce Platform",
        short_description: "A modern e-commerce platform for a home decor brand, featuring personalized recommendations and a seamless checkout experience.",
        description:
          "UrbanNest is a custom e-commerce platform built for a growing home decor brand looking to establish a strong online presence. The platform features a visually rich product catalog with 360-degree product views, AI-powered personalized recommendations, a streamlined multi-step checkout with multiple payment options, and an admin dashboard for inventory and order management. The mobile-first design ensures a flawless shopping experience on any device, while the backend handles thousands of orders per day during peak seasons without performance degradation.",
        thumbnail: SEED_IMAGES.projectUrbannest,
        gallery: [
          SEED_IMAGES.projectUrbannest,
          img("crawlcrown-urbannest-g2"),
          img("crawlcrown-urbannest-g3"),
        ],
        services: [webService._id, brandingService._id],
        technologies: [nextTech._id, nodeTech._id, tailTech._id, mongoTech._id],
        industries: [ecommerceIndustry._id],
        team: [emily._id, sofia._id, alex._id, james._id],
        client: {
          name: "Olivia Bennett",
          company: "UrbanNest Home Decor",
          website: "https://urbannest.example.com",
          location: "Portland, OR",
        },
        project_url: "https://urbannest.example.com",
        completion_date: new Date("2025-12-01"),
        featured: false,
        seo: {
          meta_title: "UrbanNest E-Commerce Platform — Home Decor Case Study",
          meta_description: "How we built a high-converting e-commerce platform with AI-powered recommendations and a seamless checkout experience.",
        },
        status: "Published",
      },
      {
        project_name: "CloudScale DevOps Platform",
        short_description: "An internal DevOps automation platform that streamlines CI/CD pipelines, infrastructure monitoring, and deployment workflows.",
        description:
          "CloudScale is an internal DevOps platform built for a technology company managing complex microservices architectures. The platform provides a unified dashboard for managing CI/CD pipelines across multiple repositories, real-time infrastructure monitoring with alerting, automated deployment workflows with rollback capabilities, and cost optimization recommendations for cloud resources. By consolidating dozens of disparate tools into a single pane of glass, the platform reduced deployment times by 60% and significantly improved developer productivity across the organization.",
        thumbnail: SEED_IMAGES.projectCloudscale,
        gallery: [
          SEED_IMAGES.projectCloudscale,
          img("crawlcrown-cloudscale-g2"),
          img("crawlcrown-cloudscale-g3"),
        ],
        services: [webService._id, seoService._id, contentService._id],
        technologies: [reactTech._id, nodeTech._id, pythonTech._id, awsTech._id],
        industries: [techIndustry._id],
        team: [michael._id, david._id, rachel._id, james._id],
        client: {
          name: "Kevin Zhao",
          company: "NexaTech Solutions",
          website: "https://nexatech.example.com",
          location: "Seattle, WA",
        },
        project_url: "https://nexatech.example.com",
        completion_date: new Date("2025-08-10"),
        featured: false,
        seo: {
          meta_title: "CloudScale DevOps Platform — CI/CD Automation Case Study",
          meta_description: "How we built a DevOps automation platform that cut deployment times by 60% with unified CI/CD pipelines and infrastructure monitoring.",
        },
        status: "Published",
      },
      {
        project_name: "EduLearn Online Learning Platform",
        short_description: "An interactive online learning platform with live classes, progress tracking, and AI-powered course recommendations.",
        description: "EduLearn is a comprehensive online learning platform built for a fast-growing edtech startup. The platform features live interactive classes with real-time collaboration tools, progress tracking with personalized dashboards, AI-powered course recommendations based on learning style and goals, and a content authoring system for instructors. The platform scales to handle thousands of concurrent learners while maintaining low latency for live sessions.",
        thumbnail: SEED_IMAGES.projectEdulearn,
        gallery: [SEED_IMAGES.projectEdulearn, img("crawlcrown-edulearn-g2"), img("crawlcrown-edulearn-g3")],
        services: [webService._id, seoService._id],
        technologies: [reactTech._id, nodeTech._id, mongoTech._id, dockerTech._id],
        industries: [educationIndustry._id],
        team: [david._id, sofia._id, alex._id],
        client: { name: "Dr. Sarah Mitchell", company: "EduLearn Technologies", website: "https://edulearn.example.com", location: "Austin, TX" },
        project_url: "https://edulearn.example.com",
        completion_date: new Date("2026-01-15"),
        featured: true,
        seo: { meta_title: "EduLearn Online Learning Platform — EdTech Case Study", meta_description: "How we built a scalable online learning platform with live classes, progress tracking, and AI course recommendations." },
        status: "Published",
      },
      {
        project_name: "GreenLeaf Sustainable Marketplace",
        short_description: "A purpose-driven e-commerce platform for eco-friendly products with carbon footprint tracking and ethical sourcing.",
        description: "GreenLeaf is a sustainable marketplace connecting conscious consumers with verified eco-friendly brands. The platform features product carbon footprint tracking, ethical sourcing verification badges, a transparent supply chain explorer, and a community impact dashboard. Built with accessibility and performance in mind, the platform serves a growing community of environmentally conscious shoppers.",
        thumbnail: SEED_IMAGES.projectGreenleaf,
        gallery: [SEED_IMAGES.projectGreenleaf, img("crawlcrown-greenleaf-g2"), img("crawlcrown-greenleaf-g3")],
        services: [webService._id, ecomMarketing._id],
        technologies: [nextTech._id, nodeTech._id, tailTech._id, mongoTech._id, dockerTech._id],
        industries: [ecommerceIndustry._id],
        team: [emily._id, david._id, james._id, xavier._id],
        client: { name: "Maya Patel", company: "GreenLeaf Commerce", website: "https://greenleaf.example.com", location: "Portland, OR" },
        project_url: "https://greenleaf.example.com",
        completion_date: new Date("2026-02-20"),
        featured: true,
        seo: { meta_title: "GreenLeaf Sustainable Marketplace — E-Commerce Case Study", meta_description: "How we built a sustainable e-commerce platform with carbon footprint tracking and ethical sourcing verification." },
        status: "Published",
      },
      {
        project_name: "MediConnect Patient Portal",
        short_description: "A unified patient portal consolidating medical records, appointment management, and telemedicine across provider networks.",
        description: "MediConnect is a patient-centric health platform that unifies medical records from multiple providers into a single view. Features include cross-provider appointment booking, secure messaging with care teams, medication tracking with reminders, and integrated telemedicine visits. The platform serves as a central hub for patients managing complex healthcare across multiple specialists and facilities.",
        thumbnail: SEED_IMAGES.projectMediconnect,
        gallery: [SEED_IMAGES.projectMediconnect, img("crawlcrown-mediconnect-g2"), img("crawlcrown-mediconnect-g3")],
        services: [webService._id, seoService._id],
        technologies: [reactTech._id, tsTech._id, awsTech._id, dockerTech._id],
        industries: [healthIndustry._id],
        team: [michael._id, sofia._id, david._id],
        client: { name: "Dr. James Carter", company: "MediConnect Health", website: "https://mediconnect.example.com", location: "Chicago, IL" },
        project_url: "https://mediconnect.example.com",
        completion_date: new Date("2026-03-10"),
        featured: false,
        seo: { meta_title: "MediConnect Patient Portal — Health Tech Case Study", meta_description: "How we built a unified patient portal consolidating medical records and appointments across provider networks." },
        status: "Published",
      },
      {
        project_name: "DataVault Security Platform",
        short_description: "An enterprise cybersecurity platform with real-time threat detection, compliance automation, and incident response.",
        description: "DataVault is a comprehensive cybersecurity platform designed for enterprises managing sensitive data across cloud and on-premise environments. The platform features real-time threat detection powered by machine learning, automated compliance reporting for SOC 2, HIPAA, and GDPR, incident response orchestration, and vulnerability management. The system processes millions of security events daily with real-time alerting and remediation workflows.",
        thumbnail: SEED_IMAGES.projectDatavault,
        gallery: [SEED_IMAGES.projectDatavault, img("crawlcrown-datavault-g2"), img("crawlcrown-datavault-g3")],
        services: [webService._id, prService._id],
        technologies: [reactTech._id, nodeTech._id, mongoTech._id, dockerTech._id, redisTech._id],
        industries: [techIndustry._id, financeIndustry._id],
        team: [michael._id, david._id, oliver._id],
        client: { name: "Rachel Kim", company: "DataVault Security", website: "https://datavault.example.com", location: "San Jose, CA" },
        project_url: "https://datavault.example.com",
        completion_date: new Date("2026-04-05"),
        featured: false,
        seo: { meta_title: "DataVault Security Platform — Cybersecurity Case Study", meta_description: "How we built an enterprise cybersecurity platform with ML-powered threat detection and compliance automation." },
        status: "Published",
      },
      {
        project_name: "BrewHouse POS System",
        short_description: "A modern point-of-sale and management system for craft breweries with inventory tracking and taproom analytics.",
        description: "BrewHouse is a specialized POS and management platform built for the craft beverage industry. The system handles taproom sales, online ordering, inventory management with batch tracking, keg lifecycle management, and employee scheduling. Integrated analytics provide insights into pour volumes, peak hours, and customer preferences, helping breweries optimize operations and increase profitability.",
        thumbnail: SEED_IMAGES.projectBrewhouse,
        gallery: [SEED_IMAGES.projectBrewhouse, img("crawlcrown-brewhouse-g2"), img("crawlcrown-brewhouse-g3")],
        services: [webService._id, brandingService._id],
        technologies: [reactTech._id, nodeTech._id, postgresTech._id, dockerTech._id],
        industries: [foodBeverageIndustry._id],
        team: [sofia._id, emily._id, alex._id, bella._id],
        client: { name: "Tom Walker", company: "BrewHouse Systems", website: "https://brewhouse.example.com", location: "Denver, CO" },
        project_url: "https://brewhouse.example.com",
        completion_date: new Date("2026-05-20"),
        featured: false,
        seo: { meta_title: "BrewHouse POS System — Food & Beverage Case Study", meta_description: "How we built a modern POS system for craft breweries with inventory tracking, taproom analytics, and keg management." },
        status: "Published",
      },
      {
        project_name: "FitTrack Wellness App",
        short_description: "A holistic wellness application combining fitness tracking, nutrition planning, and mental health support.",
        description: "FitTrack is a comprehensive wellness app that goes beyond step counting. The platform combines workout tracking with video exercise libraries, personalized nutrition planning with recipe databases, meditation and mindfulness sessions, and progress analytics with health metric visualizations. The app integrates with popular wearables and provides AI-driven coaching recommendations based on user goals and activity patterns.",
        thumbnail: SEED_IMAGES.projectFittrack,
        gallery: [SEED_IMAGES.projectFittrack, img("crawlcrown-fittrack-g2"), img("crawlcrown-fittrack-g3")],
        services: [contentService._id, socialService._id],
        technologies: [reactTech._id, nodeTech._id, mongoTech._id, firebaseTech._id],
        industries: [healthIndustry._id, techIndustry._id],
        team: [sarah._id, james._id, rachel._id],
        client: { name: "Alex Rivera", company: "FitTrack Health", website: "https://fittrack.example.com", location: "Los Angeles, CA" },
        project_url: "https://fittrack.example.com",
        completion_date: new Date("2026-06-01"),
        featured: false,
        seo: { meta_title: "FitTrack Wellness App — Health & Fitness Case Study", meta_description: "How we built a holistic wellness app combining fitness tracking, nutrition planning, and mental health support." },
        status: "Published",
      },
      {
        project_name: "TravelBuddy Booking Engine",
        short_description: "A multi-provider travel booking platform with dynamic pricing, itinerary management, and real-time availability.",
        description: "TravelBuddy is a comprehensive travel booking platform that aggregates flights, hotels, and experiences from multiple providers into a single search and booking experience. The platform features dynamic pricing with real-time availability checks, interactive itinerary builder with map integration, multi-currency support with live exchange rates, and a recommendation engine based on travel preferences and past bookings. The system handles millions of search queries daily with sub-second response times.",
        thumbnail: SEED_IMAGES.projectTravelbuddy,
        gallery: [SEED_IMAGES.projectTravelbuddy, img("crawlcrown-travelbuddy-g2"), img("crawlcrown-travelbuddy-g3")],
        services: [webService._id, ppcService._id],
        technologies: [nextTech._id, tsTech._id, mongoTech._id, awsTech._id, dockerTech._id],
        industries: [travelIndustry._id],
        team: [david._id, sofia._id, michael._id, alex._id],
        client: { name: "Sophie Anderson", company: "TravelBuddy Inc.", website: "https://travelbuddy.example.com", location: "New York, NY" },
        project_url: "https://travelbuddy.example.com",
        completion_date: new Date("2026-07-15"),
        featured: true,
        seo: { meta_title: "TravelBuddy Booking Engine — Travel Tech Case Study", meta_description: "How we built a multi-provider travel booking platform with dynamic pricing and real-time availability." },
        status: "Published",
      },
      {
        project_name: "AgriSense Analytics Dashboard",
        short_description: "A precision agriculture platform with IoT sensor integration, crop health monitoring, and yield prediction.",
        description: "AgriSense is a precision agriculture platform that helps farmers optimize crop yields through data-driven insights. The platform integrates with IoT soil sensors, weather APIs, and satellite imagery to provide real-time crop health monitoring, irrigation recommendations, pest detection alerts, and AI-powered yield predictions. The dashboard visualizes complex agricultural data into actionable insights that help reduce water usage, optimize fertilizer application, and maximize harvest quality.",
        thumbnail: SEED_IMAGES.projectAgrisense,
        gallery: [SEED_IMAGES.projectAgrisense, img("crawlcrown-agrisense-g2"), img("crawlcrown-agrisense-g3")],
        services: [webService._id, analyticsService._id],
        technologies: [pythonTech._id, tsTech._id, awsTech._id, dockerTech._id, graphqlTech._id],
        industries: [agricultureIndustry._id, techIndustry._id],
        team: [michael._id, rachel._id, david._id],
        client: { name: "John Erikson", company: "AgriSense Analytics", website: "https://agrisense.example.com", location: "Des Moines, IA" },
        project_url: "https://agrisense.example.com",
        completion_date: new Date("2026-08-01"),
        featured: false,
        seo: { meta_title: "AgriSense Analytics Dashboard — AgTech Case Study", meta_description: "How we built a precision agriculture platform with IoT sensor integration, crop health monitoring, and AI yield prediction." },
        status: "Published",
      },
    ];

    const projects = await Projects.create(projectData);
    console.log(`  Created ${projects.length} projects.\n`);

    // Tier 2 — FAQs (refs: services)
    const faqData = [];
    const faqPairs = [
      [
        "How long does it take to see SEO results?",
        "Most clients begin to see meaningful improvements in organic rankings within 3 to 6 months. However, this timeline can vary depending on the competitiveness of your industry, the current state of your website, and the scope of the SEO strategy.",
      ],
      [
        "What is included in your SEO audit?",
        "Our comprehensive SEO audit covers over 200 factors including technical health, on-page optimization, content quality and keyword coverage, backlink profile analysis, and a detailed competitor gap analysis.",
      ],
      [
        "How much should I budget for Google Ads?",
        "Budgets vary based on your industry, competition, and goals. We typically recommend starting with a minimum monthly ad spend of $2,000 to $5,000, which gives us enough data to optimize campaigns effectively.",
      ],
      [
        "Which advertising platforms do you manage?",
        "We manage campaigns across Google Ads, Meta Ads, LinkedIn Ads, and Microsoft Advertising. We select the platforms that best match your target audience and business objectives.",
      ],
      [
        "How do you create social media content?",
        "Our creative team develops a content strategy based on your brand voice, audience preferences, and industry trends. We produce branded graphics, short-form videos, carousels, and written captions.",
      ],
      [
        "Which social media platforms should my business be on?",
        "The right platforms depend on where your audience spends their time. B2B companies typically benefit most from LinkedIn, while B2C brands often see strong results on Instagram, Facebook, and TikTok.",
      ],
      [
        "What technologies do you use for web development?",
        "We primarily use React, Next.js, and Node.js for modern web applications, with MongoDB or PostgreSQL for data storage. All projects are built with responsive design and performance optimization.",
      ],
      [
        "How long does a typical web development project take?",
        "A standard corporate website takes 6 to 10 weeks from kickoff to launch. More complex projects like e-commerce platforms typically take 3 to 5 months.",
      ],
      [
        "What does your content marketing service include?",
        "We handle everything from strategy and keyword research to writing, design, and distribution. deliverables include blog articles, case studies, whitepapers, infographics, and email newsletters.",
      ],
      [
        "How do you measure content marketing success?",
        "We track organic traffic growth, keyword rankings, engagement rates, lead generation, and conversion rates. You receive a detailed monthly report with insights and recommendations.",
      ],
      [
        "What is included in a branding project?",
        "A typical branding engagement includes a brand discovery workshop, logo design with multiple concepts, color palette and typography system, brand guidelines, and messaging framework.",
      ],
      [
        "How do you ensure brand consistency across channels?",
        "We create comprehensive brand guidelines that define how your logo, colors, typography, imagery, and messaging should be used across every touchpoint, ensuring a unified brand experience.",
      ],
      [
        "What is email marketing and how does it work?",
        "Email marketing involves sending targeted messages to your subscribers to nurture leads, promote products, and build customer loyalty. We design automated sequences that deliver the right message at the right time.",
      ],
      [
        "How do you measure email campaign performance?",
        "We track open rates, click-through rates, conversion rates, bounce rates, and ROI. Our detailed reports show exactly how each campaign performs and where improvements can be made.",
      ],
      [
        "What analytics tools do you use?",
        "We use Google Analytics 4, Looker Studio, Mixpanel, and custom dashboards to provide a complete view of your digital performance across all channels.",
      ],
      [
        "How often will I receive analytics reports?",
        "You receive detailed monthly reports with executive summaries and actionable insights. Real-time dashboards are also available for monitoring KPIs at any time.",
      ],
      [
        "What is conversion rate optimization?",
        "CRO is the systematic process of improving the percentage of website visitors who take a desired action. We use A/B testing, user research, and data analysis to identify and remove friction points.",
      ],
      [
        "How long does it take to see CRO results?",
        "Some improvements can be seen within weeks of implementing changes. However, a comprehensive optimization program typically shows significant results within 2 to 3 months of continuous testing.",
      ],
      [
        "What types of video content do you produce?",
        "We produce brand stories, product demos, explainer videos, social media clips, testimonials, animated videos, and live event coverage. Each video is tailored to your audience and platform.",
      ],
      [
        "Do you handle video distribution as well?",
        "Yes, we optimize and distribute your videos across YouTube, Instagram, LinkedIn, TikTok, and your website. We also manage paid video promotion campaigns.",
      ],
      [
        "How do you find the right influencers for my brand?",
        "We use a combination of AI-powered discovery tools and manual vetting to identify influencers whose audience, values, and content style align with your brand.",
      ],
      [
        "How do you measure influencer campaign success?",
        "We track engagement rates, reach, follower growth, website traffic, and conversions attributed to each influencer partnership, providing clear ROI reporting.",
      ],
      [
        "How does affiliate marketing differ from influencer marketing?",
        "Affiliate marketing is performance-based — partners earn commissions on sales they generate. It is more transactional, while influencer marketing focuses on brand awareness and authentic advocacy.",
      ],
      [
        "What commission structure do you recommend?",
        "Commission rates vary by industry, typically ranging from 5% to 30%. We help you design a structure that attracts quality affiliates while maintaining healthy profit margins.",
      ],
      [
        "What mobile channels do you work with?",
        "We manage SMS and MMS campaigns, push notifications for mobile apps, in-app messaging, and mobile-optimized landing pages. Each channel is integrated into a cohesive mobile strategy.",
      ],
      [
        "How do you ensure SMS compliance?",
        "We ensure all campaigns comply with TCPA, GDPR, and applicable regulations. This includes proper opt-in mechanisms, clear opt-out instructions, and consent management.",
      ],
    ];

    services.forEach((service, idx) => {
      const pair1 = faqPairs[idx];
      const pair2 = faqPairs[idx + services.length];
      faqData.push({
        question: pair1[0],
        answer: pair1[1],
        service: service._id,
        display_order: 1,
        status: "Active",
      });
      faqData.push({
        question: pair2[0],
        answer: pair2[1],
        service: service._id,
        display_order: 2,
        status: "Active",
      });
    });

    console.log("Seeding FAQs...");
    const faqs = await FAQ.create(faqData);
    console.log(`  Created ${faqs.length} FAQs.\n`);

    // Tier 3 — Case Studies (refs: projects)
    const medicareProject = projects.find((p) => p.project_name === "MediCare Health Portal");
    const fintrackProject = projects.find((p) => p.project_name === "FinTrack Analytics Dashboard");
    const edulearnProject = projects.find((p) => p.project_name === "EduLearn Online Learning Platform");
    const greenleafProject = projects.find((p) => p.project_name === "GreenLeaf Sustainable Marketplace");
    const datavaultProject = projects.find((p) => p.project_name === "DataVault Security Platform");
    const agrisenseProject = projects.find((p) => p.project_name === "AgriSense Analytics Dashboard");

    console.log("Seeding Case Studies...");
    const caseStudies = await CaseStudy.create([
      {
        title: "Building a HIPAA-Compliant Telemedicine Platform at Scale",
        project: medicareProject._id,
        hero_image: SEED_IMAGES.caseStudyMedicare,
        overview:
          "MediCare Health Systems needed a modern telemedicine platform to serve patients across 12 states. The existing system was built on legacy technology, suffered from frequent downtime, and provided a poor user experience on mobile devices. We were tasked with rebuilding the platform from the ground up using modern web technologies while maintaining strict HIPAA compliance throughout the development process.",
        challenge:
          "The primary challenge was building a system that could handle sensitive patient health information while meeting HIPAA compliance requirements. The platform needed to support real-time video consultations with minimal latency, integrate with existing electronic health record systems, and provide a seamless experience for both patients and healthcare providers. Additionally, the system needed to be accessible to elderly patients with limited technical proficiency.",
        objectives: [
          "Build a HIPAA-compliant telemedicine platform supporting 50,000+ patients",
          "Achieve sub-200ms latency for real-time video consultations",
          "Integrate with three major EHR systems used by partner hospitals",
          "Design an accessible interface suitable for patients aged 18 to 85",
          "Reduce patient onboarding time from 15 minutes to under 3 minutes",
        ],
        strategy: "We adopted an agile development approach with bi-weekly sprints and continuous stakeholder feedback. The architecture was designed with microservices to ensure isolation of patient data.",
        solution: "The final platform features real-time video consultations powered by WebRTC, secure messaging with end-to-end encryption, an integrated appointment scheduling system, and a patient portal.",
        deliverables: ["Patient-facing web application", "Healthcare provider dashboard", "Admin panel", "RESTful APIs for EHR integration", "Progressive web app", "Documentation and training materials"],
        timeline: { duration: "5 months", started_at: new Date("2025-06-01"), completed_at: new Date("2025-11-15") },
        development_process: [
          { title: "Discovery and Architecture Design", description: "Conducted stakeholder interviews, mapped patient workflows, and designed a HIPAA-compliant microservices architecture on AWS." },
          { title: "Core Platform Development", description: "Built the video consultation engine using WebRTC, secure messaging, and appointment scheduling systems." },
          { title: "Integration, Testing, and Launch", description: "Integrated with Epic and Cerner EHR systems. Conducted security audits and user acceptance testing with 500 patients." },
        ],
        challenges_and_solutions: [
          { challenge: "HIPAA compliance complicated the microservices architecture.", solution: "We implemented AWS PrivateLink for service-to-service communication and AWS KMS for key management." },
          { challenge: "Video quality degraded for rural patients with limited bandwidth.", solution: "We implemented adaptive bitrate streaming with WebRTC and a low-bandwidth audio-only mode." },
        ],
        results: [
          { title: "Patient Adoption", value: "42,000+ patients onboarded in first 3 months" },
          { title: "Consultation Latency", value: "Average 140ms end-to-end" },
          { title: "Patient Satisfaction", value: "4.8 out of 5 average rating" },
        ],
        gallery: [SEED_IMAGES.caseStudyMedicare, img("crawlcrown-cs-medicare-g2"), img("crawlcrown-cs-medicare-g3")],
        client_testimonial: { quote: "This platform has fundamentally changed how we deliver healthcare.", client_name: "Dr. Amanda Lewis", designation: "Chief Medical Officer", company: "MediCare Health Systems" },
        featured: true,
        seo: { meta_title: "MediCare Telemedicine Case Study | CrawlCrown", meta_description: "HIPAA-compliant telemedicine platform serving 42,000+ patients." },
        status: "Published",
      },
      {
        title: "Real-Time Financial Analytics for a Growing Fintech Startup",
        project: fintrackProject._id,
        hero_image: SEED_IMAGES.caseStudyFintrack,
        overview: "FinTrack Technologies needed a financial analytics dashboard handling real-time market data, portfolio tracking, and AI-driven investment insights for thousands of concurrent users.",
        challenge: "Processing and displaying real-time market data from multiple sources without latency while supporting WebSocket connections and complex financial calculations.",
        objectives: [
          "Support 10,000+ concurrent users",
          "Display live market data with sub-500ms latency",
          "AI-driven investment insights",
          "Customizable watchlists and portfolio tracking",
          "99.9% uptime during trading hours",
        ],
        strategy: "WebSocket-first architecture with Redis caching. Python-based ML models deployed as microservices. React frontend with optimized rendering.",
        solution: "Real-time market ticker, interactive charts with 50+ technical indicators, portfolio tracking, AI-generated signals, and customizable alerts.",
        deliverables: ["Real-time dashboard with WebSocket streaming", "AI insights engine", "Portfolio tracking", "Customizable alerts", "Admin dashboard", "Mobile-responsive design"],
        timeline: { duration: "4 months", started_at: new Date("2025-05-20"), completed_at: new Date("2025-09-20") },
        development_process: [
          { title: "Architecture and Data Pipeline Design", description: "Designed WebSocket-based architecture with Redis caching. Built data ingestion pipelines from multiple financial APIs." },
          { title: "Frontend and Visualization Development", description: "Built React dashboard with D3.js charts, virtual scrolling, and customizable widget layouts." },
          { title: "AI Integration and Load Testing", description: "Integrated Python ML models for sentiment analysis. Load tested 15,000 concurrent users." },
        ],
        challenges_and_solutions: [
          { challenge: "Real-time data for thousands of instruments caused rendering bottlenecks.", solution: "Virtual rendering and requestAnimationFrame-based update batching reduced DOM operations by 80%." },
          { challenge: "AI insights needed large data processing without impacting dashboard performance.", solution: "ML inference deployed as separate microservices with pre-computed results cached in Redis." },
        ],
        results: [
          { title: "Concurrent Users", value: "12,500+ simultaneous users" },
          { title: "Data Latency", value: "Average 320ms delivery" },
          { title: "User Retention", value: "78% monthly active rate" },
        ],
        gallery: [SEED_IMAGES.caseStudyFintrack, img("crawlcrown-cs-fintrack-g2"), img("crawlcrown-cs-fintrack-g3")],
        client_testimonial: { quote: "The platform handles real-time data better than solutions costing ten times more.", client_name: "Marcus Webb", designation: "CTO", company: "FinTrack Technologies" },
        featured: true,
        seo: { meta_title: "FinTrack Analytics Dashboard Case Study | CrawlCrown", meta_description: "Real-time financial analytics for 12,500+ concurrent users." },
        status: "Published",
      },
      {
        title: "Scaling Online Education with an Interactive Learning Platform",
        project: edulearnProject._id,
        hero_image: SEED_IMAGES.caseStudyEdulearn,
        overview: "EduLearn Technologies needed a scalable online learning platform with live classes, progress tracking, and AI-powered recommendations to serve thousands of concurrent learners.",
        challenge: "Building a platform supporting real-time interactive classes with low latency while handling personalized content delivery and progress tracking at scale.",
        objectives: ["Support 5,000+ concurrent live learners", "Real-time collaboration tools", "AI-powered course recommendations", "Comprehensive progress tracking", "Content authoring system for instructors"],
        strategy: "Microservices architecture with WebRTC for live classes. MongoDB for flexible content storage. AI recommendation engine built with Python.",
        solution: "Live interactive classes with screen sharing and breakout rooms. Personalized learning dashboards. AI course recommendations based on learning patterns.",
        deliverables: ["Live class platform with WebRTC", "Progress tracking dashboard", "AI recommendation engine", "Content authoring system", "Student and instructor portals", "Analytics and reporting"],
        timeline: { duration: "4 months", started_at: new Date("2025-09-01"), completed_at: new Date("2026-01-15") },
        development_process: [
          { title: "Platform Architecture", description: "Designed scalable microservices architecture with WebRTC infrastructure for live video classes." },
          { title: "Core Feature Development", description: "Built live class engine, progress tracking, and AI recommendation system." },
          { title: "Testing and Launch", description: "Load tested 5,000 concurrent users. Launched with pilot group of 20 instructors." },
        ],
        challenges_and_solutions: [
          { challenge: "Low latency for live video across varied internet connections.", solution: "Adaptive bitrate streaming with fallback to audio-only for poor connections." },
        ],
        results: [
          { title: "Active Learners", value: "3,500+ enrolled in first month" },
          { title: "Course Completion", value: "72% average completion rate" },
          { title: "Instructor Satisfaction", value: "4.7 out of 5 rating" },
        ],
        gallery: [SEED_IMAGES.caseStudyEdulearn, img("crawlcrown-cs-edulearn-g2"), img("crawlcrown-cs-edulearn-g3")],
        client_testimonial: { quote: "The platform exceeded our expectations. Our instructors love the teaching tools and students are achieving better outcomes.", client_name: "Dr. Sarah Mitchell", designation: "CEO", company: "EduLearn Technologies" },
        featured: true,
        seo: { meta_title: "EduLearn Online Learning Platform Case Study | CrawlCrown", meta_description: "Scalable edtech platform with live classes, AI recommendations, and progress tracking." },
        status: "Published",
      },
      {
        title: "Building a Purpose-Driven Sustainable E-Commerce Marketplace",
        project: greenleafProject._id,
        hero_image: SEED_IMAGES.caseStudyGreenleaf,
        overview: "GreenLeaf Commerce needed a sustainable marketplace connecting conscious consumers with verified eco-friendly brands, featuring carbon footprint tracking and ethical sourcing transparency.",
        challenge: "Creating an engaging e-commerce experience while accurately tracking and displaying product sustainability metrics across thousands of products.",
        objectives: ["Carbon footprint tracking for all products", "Ethical sourcing verification badges", "Supply chain explorer", "Community impact dashboard", "Mobile-first shopping experience"],
        strategy: "Next.js frontend for performance. Node.js backend with MongoDB. Integrated third-party sustainability APIs for carbon footprint calculations.",
        solution: "Product pages with carbon footprint visualizations. Ethical sourcing badges with blockchain-verified certificates. Community impact dashboard showing collective environmental impact.",
        deliverables: ["Sustainable marketplace platform", "Carbon footprint calculator", "Verification badge system", "Supply chain transparency explorer", "Impact dashboard", "Mobile-optimized PWA"],
        timeline: { duration: "5 months", started_at: new Date("2025-10-01"), completed_at: new Date("2026-02-20") },
        development_process: [
          { title: "Discovery and Design", description: "Mapped sustainability data models and designed user flows for ethical shopping experience." },
          { title: "Platform Development", description: "Built product catalog with sustainability metrics, verification system, and impact dashboard." },
          { title: "Integration and Launch", description: "Integrated sustainability APIs and launched with 200+ verified brands." },
        ],
        challenges_and_solutions: [
          { challenge: "Accurate carbon footprint data required multiple data sources.", solution: "Built aggregation layer that normalizes data from multiple sustainability APIs." },
        ],
        results: [
          { title: "Registered Users", value: "15,000+ in first 2 months" },
          { title: "Verified Products", value: "2,500+ products with footprint data" },
          { title: "Community Impact", value: "500+ tons CO2 tracked" },
        ],
        gallery: [SEED_IMAGES.caseStudyGreenleaf, img("crawlcrown-cs-greenleaf-g2"), img("crawlcrown-cs-greenleaf-g3")],
        client_testimonial: { quote: "Our customers love the transparency. GreenLeaf has become the go-to marketplace for conscious consumers.", client_name: "Maya Patel", designation: "CEO", company: "GreenLeaf Commerce" },
        featured: false,
        seo: { meta_title: "GreenLeaf Sustainable Marketplace Case Study | CrawlCrown", meta_description: "Sustainable e-commerce platform with carbon footprint tracking and ethical sourcing." },
        status: "Published",
      },
      {
        title: "Enterprise Cybersecurity with ML-Powered Threat Detection",
        project: datavaultProject._id,
        hero_image: SEED_IMAGES.caseStudyDatavault,
        overview: "DataVault Security needed an enterprise cybersecurity platform with real-time threat detection, compliance automation, and incident response capabilities.",
        challenge: "Building a system that processes millions of security events daily while providing real-time threat detection and maintaining compliance with multiple regulatory frameworks.",
        objectives: ["Real-time threat detection with ML", "SOC 2, HIPAA, and GDPR compliance", "Automated incident response", "Vulnerability management", "Security dashboard with analytics"],
        strategy: "React frontend with Node.js backend. ML models deployed on Kubernetes for threat detection. Redis for real-time event processing.",
        solution: "ML-powered threat detection engine. Automated compliance reporting. Incident response orchestration with playbooks. Centralized security dashboard.",
        deliverables: ["Threat detection engine", "Compliance automation platform", "Incident response system", "Vulnerability scanner", "Security analytics dashboard", "Alert and notification system"],
        timeline: { duration: "6 months", started_at: new Date("2025-10-15"), completed_at: new Date("2026-04-05") },
        development_process: [
          { title: "Security Architecture", description: "Designed event processing pipeline and ML infrastructure for real-time threat detection." },
          { title: "Platform Development", description: "Built threat detection engine, compliance reporting, and incident response automation." },
          { title: "Security Audits and Launch", description: "Conducted penetration testing and achieved SOC 2 Type II certification." },
        ],
        challenges_and_solutions: [
          { challenge: "Millions of daily security events required high-throughput processing.", solution: "Distributed event pipeline with Kafka and Redis for real-time processing and alerting." },
        ],
        results: [
          { title: "Events Processed", value: "5M+ security events daily" },
          { title: "Threat Detection", value: "99.2% detection rate" },
          { title: "Compliance Coverage", value: "3 regulatory frameworks" },
        ],
        gallery: [SEED_IMAGES.caseStudyDatavault, img("crawlcrown-cs-datavault-g2"), img("crawlcrown-cs-datavault-g3")],
        client_testimonial: { quote: "DataVault transformed our security posture. The ML threat detection catches issues we never saw before.", client_name: "Rachel Kim", designation: "CISO", company: "DataVault Security" },
        featured: false,
        seo: { meta_title: "DataVault Security Platform Case Study | CrawlCrown", meta_description: "Enterprise cybersecurity with ML-powered threat detection and compliance automation." },
        status: "Published",
      },
      {
        title: "Precision Agriculture with IoT and AI Analytics",
        project: agrisenseProject._id,
        hero_image: SEED_IMAGES.caseStudyAgrisense,
        overview: "AgriSense Analytics needed a precision agriculture platform integrating IoT sensors, satellite imagery, and AI-powered predictions to help farmers optimize crop yields.",
        challenge: "Integrating diverse data sources including IoT soil sensors, weather APIs, and satellite imagery into a unified platform with actionable insights for farmers.",
        objectives: ["IoT sensor data integration", "Crop health monitoring from satellite", "AI-powered yield predictions", "Irrigation recommendations", "Pest detection alerts"],
        strategy: "Python backend for data processing. TypeScript frontend with interactive maps. GraphQL for flexible data queries. Docker for deployment.",
        solution: "Interactive dashboard with field maps. Real-time sensor data visualizations. AI yield predictions. Automated irrigation and pest alerts.",
        deliverables: ["IoT sensor integration platform", "Satellite imagery analytics", "AI yield prediction engine", "Irrigation recommendation system", "Pest detection alerts", "Mobile field app"],
        timeline: { duration: "5 months", started_at: new Date("2026-03-01"), completed_at: new Date("2026-08-01") },
        development_process: [
          { title: "Data Integration Architecture", description: "Designed data pipeline for IoT sensors, weather APIs, and satellite imagery processing." },
          { title: "Analytics and AI Development", description: "Built yield prediction models and crop health monitoring algorithms." },
          { title: "Farm Deployment", description: "Deployed with pilot farms and integrated with existing farm management systems." },
        ],
        challenges_and_solutions: [
          { challenge: "IoT sensor data varied across different hardware manufacturers.", solution: "Built universal data adapter layer that normalizes data from 20+ sensor types." },
        ],
        results: [
          { title: "Water Savings", value: "30% reduction in water usage" },
          { title: "Yield Improvement", value: "22% average crop yield increase" },
          { title: "Active Farms", value: "150+ farms in pilot program" },
        ],
        gallery: [SEED_IMAGES.caseStudyAgrisense, img("crawlcrown-cs-agrisense-g2"), img("crawlcrown-cs-agrisense-g3")],
        client_testimonial: { quote: "AgriSense has transformed how we farm. The AI insights help us make better decisions every day.", client_name: "John Erikson", designation: "CEO", company: "AgriSense Analytics" },
        featured: false,
        seo: { meta_title: "AgriSense Precision Agriculture Case Study | CrawlCrown", meta_description: "Precision agriculture platform with IoT sensors, satellite imagery, and AI yield predictions." },
        status: "Published",
      },
    ]);

    console.log(`  Created ${caseStudies.length} case studies.\n`);

    // Summary
    console.log("=".repeat(50));
    console.log("SEED COMPLETE");
    console.log("=".repeat(50));
    console.log(`  Services:     ${services.length}`);
    console.log(`  Technologies: ${technologies.length}`);
    console.log(`  Industries:   ${industries.length}`);
    console.log(`  Team:         ${team.length}`);
    console.log(`  Reviews:      ${reviews.length}`);
    console.log(`  Projects:     ${projects.length}`);
    console.log(`  FAQs:         ${faqs.length}`);
    console.log(`  Case Studies: ${caseStudies.length}`);
    console.log(`  Contacts:     ${contacts.length}`);
    console.log("=".repeat(50));
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB.");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    console.error(error.stack);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
