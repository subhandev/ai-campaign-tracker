import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Get the workspace that was auto-created on login
  const workspace = await prisma.workspace.findFirst();

  if (!workspace) {
    console.error("No workspace found. Please log in first to create one.");
    process.exit(1);
  }

  console.log(`Seeding workspace: ${workspace.name}`);

  // ── Clients ──────────────────────────────────────────────

  const clients = await Promise.all([
    prisma.client.create({
      data: {
        workspaceId: workspace.id,
        name: "StartupX",
        company: "StartupX Pvt Ltd",
        industry: "SaaS",
        email: "hello@startupx.com",
        status: "active",
        notes: "Growth-focused SaaS startup. Targeting SMB market in North America. Key focus on organic and paid acquisition.",
      },
    }),
    prisma.client.create({
      data: {
        workspaceId: workspace.id,
        name: "Nike Regional",
        company: "Nike Inc.",
        industry: "E-commerce",
        email: "marketing@nike-regional.com",
        status: "active",
        notes: "Regional campaign management for Nike's South Asia digital presence.",
      },
    }),
    prisma.client.create({
      data: {
        workspaceId: workspace.id,
        name: "GreenLeaf Organics",
        company: "GreenLeaf Pvt Ltd",
        industry: "Health & Wellness",
        email: "contact@greenleaf.com",
        status: "active",
        notes: "Organic food brand scaling D2C. Focus on Instagram and Google Shopping.",
      },
    }),
    prisma.client.create({
      data: {
        workspaceId: workspace.id,
        name: "EduLearn",
        company: "EduLearn Technologies",
        industry: "Education",
        email: "growth@edulearn.com",
        status: "active",
        notes: "EdTech platform targeting college students. Heavy focus on Meta lead gen.",
      },
    }),
    prisma.client.create({
      data: {
        workspaceId: workspace.id,
        name: "Local Mart",
        company: "Local Mart Retail",
        industry: "Retail",
        email: "info@localmart.com",
        status: "inactive",
        notes: "Local retail chain. Seasonal campaigns only.",
      },
    }),
  ]);

  console.log(`Created ${clients.length} clients`);

  const [startupX, nike, greenleaf, edulearn, localmart] = clients;

  // ── Campaigns ─────────────────────────────────────────────

  const campaigns = await Promise.all([
    // StartupX campaigns
    prisma.campaign.create({
      data: {
        clientId: startupX.id,
        name: "SEO Growth Q2 2026",
        description: "Improve organic traffic and lead generation through SEO strategies and content marketing. Target 10k monthly visitors by end of Q2.",
        platform: "SEO",
        status: "active",
        goal: "Increase Website Traffic",
        startDate: new Date("2026-04-01"),
        endDate: new Date("2026-06-30"),
        deadline: new Date("2026-06-30"),
      },
    }),
    prisma.campaign.create({
      data: {
        clientId: startupX.id,
        name: "Product Launch — AI Feature",
        description: "Launch campaign for StartupX's new AI-powered analytics feature. Multi-channel approach across LinkedIn and Google.",
        platform: "LinkedIn",
        status: "planned",
        goal: "Generate Leads",
        startDate: new Date("2026-05-15"),
        endDate: new Date("2026-06-15"),
        deadline: new Date("2026-06-15"),
      },
    }),

    // Nike campaigns
    prisma.campaign.create({
      data: {
        clientId: nike.id,
        name: "Summer Sale Launch 2026",
        description: "Promote summer collection across Meta and Google. Drive e-commerce sales with retargeting and lookalike audiences.",
        platform: "Meta",
        status: "active",
        goal: "Drive Sales",
        startDate: new Date("2026-05-01"),
        endDate: new Date("2026-07-31"),
        deadline: new Date("2026-07-31"),
      },
    }),
    prisma.campaign.create({
      data: {
        clientId: nike.id,
        name: "Brand Awareness — YouTube",
        description: "YouTube pre-roll and skippable ads targeting 18-35 sports enthusiasts in South Asia.",
        platform: "YouTube",
        status: "completed",
        goal: "Boost Brand Awareness",
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-03-31"),
        deadline: new Date("2026-03-31"),
      },
    }),

    // GreenLeaf campaigns
    prisma.campaign.create({
      data: {
        clientId: greenleaf.id,
        name: "Instagram Growth Campaign",
        description: "Grow GreenLeaf's Instagram following and drive D2C sales through influencer partnerships and paid social.",
        platform: "Meta",
        status: "at_risk",
        goal: "Grow Social Following",
        startDate: new Date("2026-03-01"),
        endDate: new Date("2026-05-31"),
        deadline: new Date("2026-05-15"),
      },
    }),
    prisma.campaign.create({
      data: {
        clientId: greenleaf.id,
        name: "Google Shopping — Organic Products",
        description: "Google Shopping campaign for GreenLeaf's top 20 SKUs. Focus on ROAS optimization and smart bidding.",
        platform: "Google",
        status: "active",
        goal: "Improve ROAS",
        startDate: new Date("2026-04-01"),
        endDate: new Date("2026-06-30"),
        deadline: new Date("2026-06-30"),
      },
    }),

    // EduLearn campaigns
    prisma.campaign.create({
      data: {
        clientId: edulearn.id,
        name: "Lead Gen — Summer Enrollment",
        description: "Meta lead generation campaign targeting college students for EduLearn's summer courses. Goal of 500 qualified leads.",
        platform: "Meta",
        status: "active",
        goal: "Generate Leads",
        startDate: new Date("2026-04-15"),
        endDate: new Date("2026-06-01"),
        deadline: new Date("2026-06-01"),
      },
    }),

    // LocalMart campaigns
    prisma.campaign.create({
      data: {
        clientId: localmart.id,
        name: "Eid Sale Campaign",
        description: "Seasonal Eid sale promotion across Meta and Google for LocalMart's retail locations.",
        platform: "Meta",
        status: "completed",
        goal: "Drive Sales",
        startDate: new Date("2026-03-20"),
        endDate: new Date("2026-04-10"),
        deadline: new Date("2026-04-10"),
      },
    }),
  ]);

  console.log(`Created ${campaigns.length} campaigns`);

  const [
    seoGrowth,
    productLaunch,
    summerSale,
    brandAwareness,
    instagramGrowth,
    googleShopping,
    leadGen,
    eidSale,
  ] = campaigns;

  // ── Metrics ───────────────────────────────────────────────

  await Promise.all([
    // SEO Growth metrics
    prisma.metric.create({
      data: {
        campaignId: seoGrowth.id,
        impressions: 45200,
        clicks: 3840,
        spend: 1200,
        conversions: 124,
        date: new Date("2026-04-30"),
      },
    }),
    prisma.metric.create({
      data: {
        campaignId: seoGrowth.id,
        impressions: 38600,
        clicks: 3200,
        spend: 1100,
        conversions: 98,
        date: new Date("2026-04-15"),
      },
    }),

    // Summer Sale metrics
    prisma.metric.create({
      data: {
        campaignId: summerSale.id,
        impressions: 128000,
        clicks: 8640,
        spend: 4200,
        conversions: 312,
        date: new Date("2026-05-01"),
      },
    }),

    // Brand Awareness metrics (completed)
    prisma.metric.create({
      data: {
        campaignId: brandAwareness.id,
        impressions: 890000,
        clicks: 12400,
        spend: 18500,
        conversions: 0,
        date: new Date("2026-03-31"),
      },
    }),

    // Instagram Growth metrics
    prisma.metric.create({
      data: {
        campaignId: instagramGrowth.id,
        impressions: 62000,
        clicks: 4100,
        spend: 2800,
        conversions: 89,
        date: new Date("2026-04-30"),
      },
    }),

    // Google Shopping metrics
    prisma.metric.create({
      data: {
        campaignId: googleShopping.id,
        impressions: 38400,
        clicks: 5200,
        spend: 3100,
        conversions: 287,
        date: new Date("2026-04-30"),
      },
    }),

    // Lead Gen metrics
    prisma.metric.create({
      data: {
        campaignId: leadGen.id,
        impressions: 94000,
        clicks: 6800,
        spend: 3600,
        conversions: 342,
        date: new Date("2026-04-30"),
      },
    }),

    // Eid Sale metrics (completed)
    prisma.metric.create({
      data: {
        campaignId: eidSale.id,
        impressions: 156000,
        clicks: 11200,
        spend: 5400,
        conversions: 624,
        date: new Date("2026-04-10"),
      },
    }),
  ]);

  console.log(`Created metrics for all campaigns`);
  console.log(`✅ Seed complete!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
