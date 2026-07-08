import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env") });

import Admin from "./models/Admin.model.js";
import Services from "./models/services.model.js";
import Technology from "./models/technology.model.js";
import Industry from "./models/industry.model.js";
import Team from "./models/team.model.js";
import Review from "./models/reviews.model.js";
import Projects from "./models/projects.model.js";
import FAQ from "./models/faq.model.js";
import CaseStudy from "./models/caseStudy.model.js";
import Contact from "./models/contacts.model.js";

const IMG = "/uploads/placeholder.webp";

const seedData = {
  admins: [
    {
      name: "Admin",
      email: "admin@example.com",
      password: "password123",
      photo: "",
      role: "admin",
    },
  ],

  services: [
    {
      service_name: "Search Engine Optimization",
      short_description: "Boost your organic visibility and drive qualified traffic with data-driven SEO strategies tailored to your business goals.",
      description:
        "Our Search Engine Optimization (SEO) service is designed to help your business rank higher on search engines like Google, Bing, and Yahoo. We combine technical SEO audits, in-depth keyword research, on-page optimization, and high-quality link building to create a comprehensive strategy that delivers sustainable organic growth. Whether you are a local business targeting nearby customers or a global brand competing in a crowded market, our team crafts a tailored approach that aligns with your unique objectives and industry dynamics.",
      hero_image: IMG,
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
      hero_image: IMG,
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
      hero_image: IMG,
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
      hero_image: IMG,
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
      hero_image: IMG,
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
      hero_image: IMG,
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
  ],

  industries: [
    { name: "Healthcare", description: "Digital solutions for hospitals, clinics, telemedicine, and health tech startups.", icon: "faHeartPulse", display_order: 1 },
    { name: "Finance and Banking", description: "Fintech platforms, banking apps, and financial service digital experiences.", icon: "faMoneyBillTrendUp", display_order: 2 },
    { name: "E-Commerce", description: "Online stores, marketplaces, and D2C brands with high-converting shopping experiences.", icon: "faCartShopping", display_order: 3 },
    { name: "Education", description: "EdTech platforms, LMS systems, and educational institution websites.", icon: "faGraduationCap", display_order: 4 },
    { name: "Real Estate", description: "Property listing platforms, virtual tours, and real estate marketing solutions.", icon: "faBuilding", display_order: 5 },
    { name: "Technology", description: "SaaS products, tech startups, and enterprise software platforms.", icon: "faMicrochip", display_order: 6 },
  ],

  team: [
    {
      name: "Sarah Johnson",
      designation: "Chief Executive Officer",
      description: "With over 15 years of experience in digital marketing and business strategy, Sarah leads our vision of helping businesses thrive in the digital landscape.",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      email: "sarah@digitalagency.com",
      display_order: 1,
    },
    {
      name: "Michael Chen",
      designation: "Chief Technology Officer",
      description: "A full-stack architect with deep expertise in cloud infrastructure and modern web technologies. Michael ensures our solutions are scalable, secure, and performant.",
      linkedin: "https://linkedin.com/in/michaelchen",
      email: "michael@digitalagency.com",
      display_order: 2,
    },
    {
      name: "Emily Rodriguez",
      designation: "Creative Director",
      description: "Emily brings brands to life through compelling visual storytelling. Her award-winning designs have helped dozens of companies establish memorable brand identities.",
      linkedin: "https://linkedin.com/in/emilyrodriguez",
      email: "emily@digitalagency.com",
      display_order: 3,
    },
    {
      name: "David Kim",
      designation: "Lead Developer",
      description: "David is a senior engineer specializing in React and Node.js. He leads our development team in building performant, accessible web applications.",
      linkedin: "https://linkedin.com/in/davidkim",
      email: "david@digitalagency.com",
      display_order: 4,
    },
    {
      name: "Rachel Patel",
      designation: "SEO Manager",
      description: "Rachel is a certified SEO specialist who combines data analysis with creative strategy to deliver consistent organic growth for our clients.",
      linkedin: "https://linkedin.com/in/rachelpatel",
      email: "rachel@digitalagency.com",
      display_order: 5,
    },
    {
      name: "James Wilson",
      designation: "Marketing Director",
      description: "James oversees all marketing campaigns across channels. His data-driven approach has generated millions in revenue for our clients.",
      linkedin: "https://linkedin.com/in/jameswilson",
      email: "james@digitalagency.com",
      display_order: 6,
    },
    {
      name: "Sofia Andersson",
      designation: "UI/UX Designer",
      description: "Sofia crafts intuitive, beautiful interfaces rooted in user research. She is passionate about creating digital experiences that feel effortless.",
      linkedin: "https://linkedin.com/in/sofiaandersson",
      email: "sofia@digitalagency.com",
      display_order: 7,
    },
    {
      name: "Alex Thompson",
      designation: "Project Manager",
      description: "Alex ensures every project is delivered on time, within budget, and to the highest standard. He keeps the entire team aligned and moving forward.",
      linkedin: "https://linkedin.com/in/alexthompson",
      email: "alex@digitalagency.com",
      display_order: 8,
    },
  ],

  reviews: [
    {
      name: "Robert Mitchell",
      location: "New York, NY",
      rating: 5,
      review_text: "Working with this agency completely transformed our online presence. Our organic traffic increased by 340% within six months, and the leads we receive are now highly qualified. The team is responsive, creative, and truly understands our business goals.",
      status: "Approved",
    },
    {
      name: "Jennifer Lee",
      location: "San Francisco, CA",
      rating: 5,
      review_text: "The PPC campaigns they set up for us delivered a 5x return on ad spend in the first quarter alone. Their attention to detail in audience targeting and ad copywriting is exceptional. We have finally found a marketing partner that truly cares about results.",
      status: "Approved",
    },
    {
      name: "David Park",
      location: "Chicago, IL",
      rating: 4,
      review_text: "They redesigned our website and the results speak for themselves. Bounce rate dropped by 45%, page load time went from 6 seconds to under 2, and our conversion rate doubled. The process was smooth and the team kept us informed at every step.",
      status: "Approved",
    },
    {
      name: "Maria Gonzalez",
      location: "Austin, TX",
      rating: 5,
      review_text: "Their social media marketing has been a game-changer for our brand. We went from 2,000 to over 25,000 followers in eight months, and the engagement rates are consistently above industry averages. They understand how to build an authentic community.",
      status: "Approved",
    },
    {
      name: "Thomas Wright",
      location: "Seattle, WA",
      rating: 4,
      review_text: "The branding project they delivered exceeded our expectations. Our new logo, color palette, and brand guidelines have given us a professional, cohesive look that our customers and partners constantly compliment. Highly recommended for any rebranding effort.",
      status: "Approved",
    },
    {
      name: "Amanda Foster",
      location: "Denver, CO",
      rating: 5,
      review_text: "We hired them for content marketing and the quality of the articles and case studies they produce is outstanding. Our blog traffic increased by 280% and we have seen a noticeable uptick in inbound leads. They are an extension of our marketing team.",
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
  ],
};

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected successfully.\n");

    // Check if data already exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
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
      await Admin.deleteMany();
      console.log("Existing data cleared.\n");
    }

    // Tier 1 — Standalone models
    console.log("Seeding Admin...");
    const admins = await Admin.create(seedData.admins);
    console.log(`  Created ${admins.length} admin(s).\n`);

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

    console.log("Seeding Projects...");
    const projectData = [
      {
        project_name: "MediCare Health Portal",
        short_description: "A comprehensive telemedicine platform connecting patients with healthcare providers through video consultations and secure messaging.",
        description:
          "MediCare Health Portal is a full-featured telemedicine platform built to bridge the gap between patients and healthcare providers. The platform supports real-time video consultations, secure patient messaging, electronic health record integration, appointment scheduling, and prescription management. Built with security and compliance in mind, the system adheres to HIPAA regulations and uses end-to-end encryption for all patient data. The intuitive interface makes it easy for patients of all ages to connect with their doctors from the comfort of their homes.",
        thumbnail: IMG,
        gallery: [IMG, IMG, IMG],
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
        thumbnail: IMG,
        gallery: [IMG, IMG, IMG],
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
        thumbnail: IMG,
        gallery: [IMG, IMG, IMG],
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
        thumbnail: IMG,
        gallery: [IMG, IMG, IMG],
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
    ];

    const projects = await Projects.create(projectData);
    console.log(`  Created ${projects.length} projects.\n`);

    // Tier 2 — FAQs (refs: services)
    const faqData = [];
    const faqPairs = [
      [
        "How long does it take to see SEO results?",
        "Most clients begin to see meaningful improvements in organic rankings within 3 to 6 months. However, this timeline can vary depending on the competitiveness of your industry, the current state of your website, and the scope of the SEO strategy. We focus on building sustainable, long-term growth rather than quick fixes that fade.",
      ],
      [
        "What is included in your SEO audit?",
        "Our comprehensive SEO audit covers over 200 factors including technical health (crawlability, indexation, Core Web Vitals), on-page optimization (title tags, meta descriptions, heading structure, internal linking), content quality and keyword coverage, backlink profile analysis, and a detailed competitor gap analysis. The audit delivers a prioritized action plan with clear recommendations.",
      ],
      [
        "How much should I budget for Google Ads?",
        "Budgets vary based on your industry, competition, and goals. We typically recommend starting with a minimum monthly ad spend of $2,000 to $5,000, which gives us enough data to optimize campaigns effectively. We charge a separate management fee on top of your ad spend, and we are transparent about all costs from day one.",
      ],
      [
        "Which advertising platforms do you manage?",
        "We manage campaigns across Google Ads (Search, Display, Shopping, YouTube), Meta Ads (Facebook, Instagram), LinkedIn Ads, and Microsoft Advertising. We select the platforms that best match your target audience and business objectives, ensuring your budget is allocated where it will generate the highest return.",
      ],
      [
        "How do you create social media content?",
        "Our creative team develops a content strategy based on your brand voice, audience preferences, and industry trends. We produce a mix of branded graphics, short-form videos, carousels, stories, and written captions. Every piece of content is reviewed for brand consistency before publishing, and we maintain an editorial calendar for your approval each month.",
      ],
      [
        "Which social media platforms should my business be on?",
        "The right platforms depend on where your audience spends their time. B2B companies typically benefit most from LinkedIn and Twitter, while B2C brands often see strong results on Instagram, Facebook, and TikTok. We help you identify the most relevant platforms and develop a focused strategy rather than spreading your efforts too thin.",
      ],
      [
        "What technologies do you use for web development?",
        "We primarily use React, Next.js, and Node.js for modern web applications, with MongoDB or PostgreSQL for data storage. For content-heavy sites, we often integrate headless CMS solutions like Strapi or Contentful. All projects are built with responsive design, performance optimization, and SEO best practices as standard.",
      ],
      [
        "How long does a typical web development project take?",
        "A standard corporate website takes 6 to 10 weeks from kickoff to launch. More complex projects like e-commerce platforms or custom web applications typically take 3 to 5 months. We provide a detailed timeline during the proposal phase and keep you updated throughout the development process with regular demos and progress reports.",
      ],
      [
        "What does your content marketing service include?",
        "We handle everything from strategy and keyword research to writing, design, and distribution. deliverables include blog articles, case studies, whitepapers, infographics, email newsletters, and social media content. All content is SEO-optimized and aligned with your marketing funnel to attract, engage, and convert your target audience.",
      ],
      [
        "How do you measure content marketing success?",
        "We track a combination of metrics aligned with your business goals, including organic traffic growth, keyword rankings, engagement rates (time on page, bounce rate), lead generation (form fills, downloads), and conversion rates. You receive a detailed monthly report with insights and recommendations for continuous improvement.",
      ],
      [
        "What is included in a branding project?",
        "A typical branding engagement includes a brand discovery workshop, logo design with multiple concepts, color palette and typography system, brand guidelines document, business card and stationery design, brand messaging and voice guidelines, and a social media brand kit. We refine each element through collaborative feedback rounds until you are completely satisfied.",
      ],
      [
        "How do you ensure brand consistency across channels?",
        "We create comprehensive brand guidelines that define exactly how your logo, colors, typography, imagery, and messaging should be used across every touchpoint. This document becomes your single source of truth, ensuring that your website, social media, print materials, and any other channels all present a unified, professional brand experience.",
      ],
    ];

    services.forEach((service, idx) => {
      const pair = faqPairs[idx];
      faqData.push({
        question: pair[0],
        answer: pair[1],
        service: service._id,
        display_order: 1,
        status: "Active",
      });
      faqData.push({
        question: faqPairs[idx + 6][0],
        answer: faqPairs[idx + 6][1],
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

    console.log("Seeding Case Studies...");
    const caseStudies = await CaseStudy.create([
      {
        title: "Building a HIPAA-Compliant Telemedicine Platform at Scale",
        project: medicareProject._id,
        hero_image: IMG,
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
        strategy:
          "We adopted an agile development approach with bi-weekly sprints and continuous stakeholder feedback. The architecture was designed with microservices to ensure isolation of patient data, and all infrastructure was deployed on HIPAA-eligible AWS services with encryption at rest and in transit.",
        solution:
          "The final platform features real-time video consultations powered by WebRTC, secure messaging with end-to-end encryption, an integrated appointment scheduling system, electronic prescription management, and a patient portal that provides access to medical history and test results. The provider dashboard includes patient queue management, consultation notes, and billing integration.",
        deliverables: [
          "Patient-facing web application with responsive design",
          "Healthcare provider dashboard with consultation tools",
          "Admin panel for system management and reporting",
          "RESTful APIs for EHR integration",
          "Mobile-optimized progressive web app",
          "Comprehensive documentation and training materials",
        ],
        timeline: {
          duration: "5 months",
          started_at: new Date("2025-06-01"),
          completed_at: new Date("2025-11-15"),
        },
        development_process: [
          {
            title: "Discovery and Architecture Design",
            description: "Conducted stakeholder interviews, mapped patient and provider workflows, and designed a HIPAA-compliant microservices architecture on AWS. Established security protocols and data encryption standards for the entire project.",
          },
          {
            title: "Core Platform Development",
            description: "Built the video consultation engine using WebRTC, implemented secure messaging with end-to-end encryption, and developed the appointment scheduling system. Created provider and patient dashboards with real-time notifications and status updates.",
          },
          {
            title: "Integration, Testing, and Launch",
            description: "Integrated with Epic, Cerner, and Allscripts EHR systems. Conducted extensive security audits, penetration testing, and user acceptance testing with a pilot group of 500 patients. Deployed to production with a phased rollout across 12 states.",
          },
        ],
        challenges_and_solutions: [
          {
            challenge: "HIPAA compliance required strict data isolation and encryption, which complicated the microservices architecture and slowed development velocity.",
            solution: "We implemented AWS PrivateLink for service-to-service communication and used AWS KMS for centralized key management. This maintained compliance without sacrificing development speed or application performance.",
          },
          {
            challenge: "Video quality degraded significantly for patients in rural areas with limited bandwidth.",
            solution: "We implemented adaptive bitrate streaming with WebRTC and added a bandwidth detection mechanism that automatically adjusts video quality. A low-bandwidth mode switches to audio-only with shared screen when connection quality drops below threshold.",
          },
        ],
        results: [
          { title: "Patient Adoption", value: "42,000+ patients onboarded in first 3 months" },
          { title: "Consultation Latency", value: "Average 140ms end-to-end (target was 200ms)" },
          { title: "Patient Satisfaction", value: "4.8 out of 5 average rating across 12,000+ consultations" },
        ],
        gallery: [IMG, IMG, IMG, IMG],
        client_testimonial: {
          quote: "This platform has fundamentally changed how we deliver healthcare. Our patients love the ease of use, and our providers can focus on what matters most — patient care. The team delivered a solution that exceeded every expectation we had.",
          client_name: "Dr. Amanda Lewis",
          designation: "Chief Medical Officer",
          company: "MediCare Health Systems",
        },
        featured: true,
        seo: {
          meta_title: "MediCare Telemedicine Platform Case Study | CrawlCrown",
          meta_description: "How we built a HIPAA-compliant telemedicine platform serving 42,000+ patients with 140ms average consultation latency.",
        },
        status: "Published",
      },
      {
        title: "Real-Time Financial Analytics for a Growing Fintech Startup",
        project: fintrackProject._id,
        hero_image: IMG,
        overview:
          "FinTrack Technologies approached us to build a financial analytics dashboard that could handle real-time market data, provide portfolio tracking with interactive visualizations, and deliver AI-driven investment insights. The platform needed to support thousands of concurrent users while maintaining sub-second response times for critical trading data.",
        challenge:
          "The main technical challenge was processing and displaying real-time market data from multiple sources without introducing latency. The platform needed to handle WebSocket connections for live data streaming, compute complex financial calculations on the fly, and present it all in an intuitive interface that both novice and experienced investors could navigate easily. Performance under load was non-negotiable — even brief delays could mean missed trading opportunities.",
        objectives: [
          "Build a real-time dashboard supporting 10,000+ concurrent users",
          "Display live market data with less than 500ms update latency",
          "Implement AI-driven investment insights based on historical data",
          "Create customizable watchlists and portfolio tracking tools",
          "Ensure 99.9% uptime during market trading hours",
        ],
        strategy:
          "We chose a WebSocket-first architecture for live data delivery, with Redis caching for frequently accessed market data. The AI insights engine was built using Python-based ML models deployed as microservices, while the frontend used React with optimized rendering to handle rapid data updates without UI jank.",
        solution:
          "The resulting platform features a real-time market ticker, interactive charts with 50+ technical indicators, portfolio performance tracking with gain/loss calculations, AI-generated buy/sell signals based on market sentiment analysis, and customizable alert notifications. The admin dashboard provides user analytics, system health monitoring, and content management capabilities.",
        deliverables: [
          "Real-time analytics dashboard with WebSocket data streaming",
          "AI insights engine with ML-powered market analysis",
          "Portfolio tracking with 50+ technical indicators",
          "Customizable alerts and notification system",
          "Admin dashboard with user and system analytics",
          "Mobile-responsive design for on-the-go access",
        ],
        timeline: {
          duration: "4 months",
          started_at: new Date("2025-05-20"),
          completed_at: new Date("2025-09-20"),
        },
        development_process: [
          {
            title: "Architecture and Data Pipeline Design",
            description: "Designed a WebSocket-based architecture for real-time data delivery with Redis caching layers. Built a data ingestion pipeline that aggregates market data from multiple financial APIs and normalizes it for consistent display across the platform.",
          },
          {
            title: "Frontend and Visualization Development",
            description: "Built the React dashboard with D3.js-powered interactive charts, implemented virtual scrolling for large datasets, and created customizable widget layouts. Developed the portfolio tracking engine with real-time P&L calculations and historical performance visualization.",
          },
          {
            title: "AI Integration and Load Testing",
            description: "Integrated Python-based ML models for market sentiment analysis and trend prediction. Conducted extensive load testing simulating 15,000 concurrent users with real-time data streams. Optimized WebSocket handling and database queries to achieve target latency under peak load.",
          },
        ],
        challenges_and_solutions: [
          {
            challenge: "Displaying real-time data for thousands of financial instruments simultaneously caused significant frontend rendering bottlenecks and memory leaks.",
            solution: "Implemented virtual rendering that only mounts visible chart components, combined with requestAnimationFrame-based update batching. This reduced DOM operations by 80% and eliminated memory leaks during long trading sessions.",
          },
          {
            challenge: "The AI insights engine needed to process large volumes of historical data without impacting real-time dashboard performance.",
            solution: "Deployed ML model inference as separate microservices with their own compute resources. Results are pre-computed during off-peak hours and cached in Redis, so the dashboard can serve insights with sub-50ms latency without blocking real-time data streams.",
          },
        ],
        results: [
          { title: "Concurrent Users", value: "12,500+ simultaneous users at peak load" },
          { title: "Data Latency", value: "Average 320ms market data update delivery" },
          { title: "User Retention", value: "78% monthly active user retention rate" },
        ],
        gallery: [IMG, IMG, IMG, IMG],
        client_testimonial: {
          quote: "The platform handles real-time data better than solutions costing ten times more. Our users consistently praise the speed and clarity of the dashboard. The AI insights have become one of our most popular features and a key differentiator in the market.",
          client_name: "Marcus Webb",
          designation: "Chief Technology Officer",
          company: "FinTrack Technologies",
        },
        featured: true,
        seo: {
          meta_title: "FinTrack Financial Analytics Dashboard Case Study | CrawlCrown",
          meta_description: "How we built a real-time financial analytics dashboard supporting 12,500+ concurrent users with AI-powered investment insights.",
        },
        status: "Published",
      },
    ]);

    console.log(`  Created ${caseStudies.length} case studies.\n`);

    // Summary
    console.log("=".repeat(50));
    console.log("SEED COMPLETE");
    console.log("=".repeat(50));
    console.log(`  Admins:       ${admins.length}`);
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
    console.log("\nAdmin login: admin@example.com / password123");

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
